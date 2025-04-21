import { DataSource } from "typeorm";
import { SqlDatabase } from "langchain/sql_db";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import cors from 'cors';
import express from "express";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());

// --- Database Connection (Keep your existing setup) ---
const datasource = new DataSource({
  type: "mysql",
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT || "3306", 10),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  synchronize: false, // Keep false for stability
  logging: false,
});

try {
    await datasource.initialize();
    console.log("✅ Database Connected!");
} catch (err) {
    console.error("❌ Database Connection Error:", err);
    process.exit(1); // Exit if DB connection fails
}


const db = await SqlDatabase.fromDataSourceParams({
  appDataSource: datasource,
  includeTables: ["assignees", "tasks"], // Ensure these tables exist
});

// --- LLM Configuration (Keep your existing setup) ---
const llm = new ChatOpenAI({
  model: "gpt-4o",
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// --- Utility Function (Keep as is) ---
function cleanSqlQuery(query) {
    if (!query) return "";
    // Remove potential markdown code blocks and language identifiers
    let cleaned = query.replace(/```(?:sql|mysql)?\s*/gi, "");
    cleaned = cleaned.replace(/```/g, "");
    // Remove prefixes like "SQL Query:"
    cleaned = cleaned.replace(/^(sql\s*query:|mysql:|sql:)\s*/i, "");
    // Normalize whitespace and trim
    cleaned = cleaned.replace(/\s+/g, " ").trim();
    // Ensure semicolons are handled correctly
    cleaned = cleaned.replace(/;+$/, ";");
    if (cleaned === ";") return "";
    // DO NOT remove backticks here, MySQL might need them if table/column names are keywords or contain spaces
    return cleaned;
}


// --- SQL Query Generation Chain ---

// UPDATED Prompt: Instruct LLM *never* to include ID for INSERTs
const sqlGenerationPrompt = PromptTemplate.fromTemplate(`
  You are a precise SQL query generator for a MySQL database. Given a natural language question, create an SQL query that follows these STRICT guidelines:

  1. Use ONLY the exact table and column names from this schema: {schema}
  2. Use COUNT() functions when the question asks "how many".
  3. Match the query structure to the question's intent (counting, listing, filtering, inserting, updating).
  4. Use JOINs when needed to combine information from multiple tables.
  5. Do NOT explain—return ONLY the raw SQL query text.
  6. **VERY IMPORTANT FOR INSERTS:** When generating an INSERT statement for 'assignees' or 'tasks', **NEVER EVER** include the 'id' column in the column list or the VALUES clause. The application code will handle adding the ID value calculation.
     Example Correct OUTPUT for assignees: INSERT INTO assignees (name, email, phoneNum, dob) VALUES ('John Doe', 'john.doe@email.com', '123456789', '1995-05-15');
     Example Correct OUTPUT for tasks: INSERT INTO tasks (task_name, priority, taskAssignee, taskStatus, start, end) VALUES ('Develop feature X', 'High', 5, 'Pending', '2025-04-23', '2025-04-30');
     (The application code will later modify this to include the ID calculation).
  7. If the user asks to add something but provides incomplete information (e.g., "add employee John"), ask for the missing details *instead* of generating an SQL query. Respond ONLY with: "INCOMPLETE_INFO: [mention missing fields like email, phone, dob]".
  8. Use default values if sensible and details are missing:
     - Default phone number: '487487847' (use as string)
     - Default dob: '1990-01-01'
  9. Do NOT generate a query if the question is too ambiguous or lacks necessary details for a specific action (like updating or deleting without a clear identifier like ID or email). Respond ONLY with: "AMBIGUOUS_REQUEST".
  10. Ensure values like phone numbers and dates are treated as strings (wrap in single quotes).

  User question: {question}

  SQL Query:
  `);

// UPDATED post-processing step to inject ID calculation
const sqlQueryChain = RunnableSequence.from([
  {
    schema: async () => {
      try {
        const schemaInfo = await db.getTableInfo();
        if (!schemaInfo || typeof schemaInfo !== 'string' || schemaInfo.trim() === '') {
            console.error("Failed to retrieve valid schema information.");
            throw new Error("Database schema is empty or could not be retrieved.");
        }
        return schemaInfo;
      } catch(error) {
          console.error("Error fetching schema:", error);
          throw new Error("Could not fetch database schema."); // Propagate error
      }
    },
    question: (input) => input.question,
  },
  sqlGenerationPrompt, // Use the updated prompt template
  llm.bind({ stop: ["\nSQLResult:"] }),
  new StringOutputParser(),
  // *** Post-processing step to inject ID calculation for INSERTs ***
  (query) => {
    let cleanedQuery = cleanSqlQuery(query);

    if (cleanedQuery.startsWith("INCOMPLETE_INFO") || cleanedQuery.startsWith("AMBIGUOUS_REQUEST")) {
        return cleanedQuery; // Pass refusal messages through
    }

    // Check if it's an INSERT statement for the relevant tables
    const isAssigneeInsert = cleanedQuery.toUpperCase().startsWith("INSERT INTO ASSIGNEES");
    const isTaskInsert = cleanedQuery.toUpperCase().startsWith("INSERT INTO TASKS");

    if (isAssigneeInsert || isTaskInsert) {
      // Ensure LLM didn't include ID despite instructions (remove if present)
      cleanedQuery = cleanedQuery.replace(/\(\s*id\s*,?/i, "("); // Remove (id,
      cleanedQuery = cleanedQuery.replace(/,\s*id\s*\)/i, ")"); // Remove , id)
      cleanedQuery = cleanedQuery.replace(/VALUES\s*\(\s*\d+\s*,?/i, "VALUES ("); // Remove VALUES (123,

      // Inject the ID column and the subquery for calculation
      const tableName = isAssigneeInsert ? "assignees" : "tasks";
      const idSubquery = `(SELECT COALESCE(MAX(id), 0) + 1 FROM ${tableName})`;

      // Inject 'id' into the column list: INSERT INTO table (col1, col2) -> INSERT INTO table (id, col1, col2)
      cleanedQuery = cleanedQuery.replace(/INSERT INTO\s+\w+\s*\(/i, `$&id, `);

      // Inject the subquery into the VALUES list: VALUES (val1, val2) -> VALUES (<subquery>, val1, val2)
      cleanedQuery = cleanedQuery.replace(/VALUES\s*\(/i, `$&${idSubquery}, `);

      console.log(`Modified INSERT query with ID subquery: ${cleanedQuery}`);
    }
     // Basic validation for other query types
     else if (cleanedQuery && cleanedQuery.length > 5 &&
             !cleanedQuery.trim().toUpperCase().startsWith("SELECT") &&
             !cleanedQuery.trim().toUpperCase().startsWith("UPDATE") &&
             !cleanedQuery.trim().toUpperCase().startsWith("DELETE")) {
        console.warn("Generated query might be non-standard or invalid:", cleanedQuery);
        // Potentially throw an error or return an indicator of failure
        // return "INVALID_QUERY_GENERATED";
     }

    return cleanedQuery; // Return the (potentially modified) cleaned query
  }
]);


// --- Intent/Entity Detection (Keep as is) ---
const userSession = {}; // Simple session store

function detectIntent(question, sessionData) {
  // (Keep your existing intent detection logic)
  const qLower = question.toLowerCase();
  if (sessionData && sessionData.pendingDetails) return "incomplete-action";
  if (qLower.includes("add") && (qLower.includes("employee") || qLower.includes("assignee"))) return "add-employee";
  if (qLower.includes("add") || qLower.includes("assign")) {
      if (qLower.includes("task")) return "add-task";
  }
  if (qLower.includes("how many") && (qLower.includes("employee") || qLower.includes("assignee"))) return "count-employees";
  if (qLower.includes("how many") && qLower.includes("task")) return "count-tasks";
  if (qLower.includes("who") || qLower.includes("which") || qLower.includes("what is the")) return "entity-identification";
  if (qLower.includes("list") || qLower.includes("show me")) return "list-entities";
  return "general-query";
}

function detectEntities(question) {
    // (Keep your existing entity detection logic)
    const entities = [];
     if (!question || typeof question !== 'string') return null;
    const qLower = question.toLowerCase();
    if (qLower.includes("email")) entities.push("email");
    if (qLower.includes("priority")) entities.push("priority");
    if (qLower.includes("assignee")) entities.push("taskAssignee");
    if (qLower.includes("task name")) entities.push("task_name");
    if (qLower.includes("status")) entities.push("taskStatus");
    const nameMatch = question.match(/named\s+([A-Za-z]+)/i);
    if (nameMatch && nameMatch[1]) entities.push(`name:${nameMatch[1]}`);
    return entities.length > 0 ? entities : null;
}


// --- Final Response Chain ---

// Final response prompt (Keep as is)
const finalResponsePrompt = PromptTemplate.fromTemplate(`
  You are a helpful database assistant. Provide a clear, accurate, and concise natural language answer based ONLY on the provided SQL query result.

  STRICT RULES:
  1. Answer the user's original {question} directly using the {response} data.
  2. **DO NOT** mention SQL, queries, or the database structure unless the question explicitly asked about them.
  3. If the SQL result is a count state the number clearly.
  4. If the SQL result is a list of items, present them clearly.
  5. If the SQL result indicates success for an INSERT/UPDATE/DELETE, confirm the action was completed.
  6. If the SQL result is empty for a SELECT query, state that no matching information was found.
  7. If the {intentMessage} or {entityMessage} indicates an issue (like missing info), incorporate that into your response *instead* of trying to interpret the possibly empty {response}.
  8. Be polite and conversational.

  User's Question: {question}
  SQL Query Result: {response}
  Intent/Entities Note: {intentMessage} {entityMessage}

  Your Answer:
  `);

// UPDATED finalChain with refined Retry Logic
const finalChain = RunnableSequence.from([
  // 1. Generate SQL Query (or refusal message)
  {
    question: (input) => input.question,
    userId: (input) => input.userId,
    queryOrRefusal: sqlQueryChain, // This now potentially includes the ID subquery
  },
  // 2. Execute Query / Handle Refusal / Handle Duplicate Entry Error
  async (input) => {
    const { question, userId, queryOrRefusal } = input;
    const sessionData = userSession[userId] || {};

    // Handle refusal messages
    if (queryOrRefusal.startsWith("INCOMPLETE_INFO:") || queryOrRefusal.startsWith("AMBIGUOUS_REQUEST")) {
        console.log(`Handling refusal for user ${userId}: ${queryOrRefusal}`);
        return {
            question: question,
            query: "N/A (LLM Refusal)",
            response: queryOrRefusal, // Pass refusal message
            intentMessage: `⚠️ ${queryOrRefusal.split(':')[0]}`,
            entityMessage: queryOrRefusal.includes(':') ? `Details: ${queryOrRefusal.split(':')[1].trim()}` : "",
        };
    }

    const initialQuery = queryOrRefusal; // The query potentially with the ID subquery
    let response;
    let executedQuery = initialQuery; // Track the query actually executed
    let intentMessage = "📌 Intent: General Query";
    let entityMessage = "🔍 Entities: None Detected";

    try {
        if (!initialQuery || initialQuery.trim() === "") {
            throw new Error("Generated SQL query is empty or invalid after processing.");
        }

        console.log(`Attempting SQL for user ${userId}:`, initialQuery);
        response = await db.run(initialQuery); // First attempt
        console.log(`SQL Result (1st attempt) for user ${userId}:`, response);

    } catch (sqlError) {
        console.error(`❌ SQL Execution Error (1st attempt) for user ${userId} on query "${initialQuery}":`, sqlError);

        // *** Retry logic specifically for Duplicate Primary Key Error ***
        if (sqlError.code === 'ER_DUP_ENTRY' && (initialQuery.toUpperCase().startsWith("INSERT INTO ASSIGNEES") || initialQuery.toUpperCase().startsWith("INSERT INTO TASKS"))) {
            console.warn(`⚠️ Duplicate entry detected for user ${userId}. Retrying insert...`);

            const tableName = initialQuery.toUpperCase().startsWith("INSERT INTO ASSIGNEES") ? "assignees" : "tasks";
            let nextId;
            try {
                // Fetch the absolute current MAX ID + 1 again
                const maxIdResult = await db.run(`SELECT MAX(id) + 1 as nextId FROM ${tableName}`);
                 // Ensure maxIdResult is an array and has the expected structure
                 if (Array.isArray(maxIdResult) && maxIdResult.length > 0 && maxIdResult[0] && maxIdResult[0].nextId !== null && maxIdResult[0].nextId !== undefined) {
                    nextId = maxIdResult[0].nextId;
                 } else if (Array.isArray(maxIdResult) && maxIdResult.length > 0 && maxIdResult[0] && (maxIdResult[0].nextId === null || maxIdResult[0].nextId === undefined) ){
                     // Handle case where table is empty (MAX(id) is NULL)
                     console.log(`Table ${tableName} appears empty, setting nextId to 1.`);
                     nextId = 1;
                 }
                 else {
                    // Handle unexpected structure, maybe log it
                    console.error("Unexpected result structure from MAX(id) query:", maxIdResult);
                     throw new Error(`Could not determine next ID for ${tableName}. Result: ${JSON.stringify(maxIdResult)}`);
                 }
                console.log(`Determined nextId for retry: ${nextId}`);

                // Replace the ID subquery in the original failed query with the new concrete ID
                // This regex targets the specific subquery we added earlier
                const idSubqueryRegex = /\(SELECT COALESCE\(MAX\(id\), 0\) \+ 1 FROM \w+\)/i;
                if (initialQuery.match(idSubqueryRegex)) {
                    executedQuery = initialQuery.replace(idSubqueryRegex, nextId.toString()); // Replace subquery with the new ID
                } else {
                     // Fallback: If the subquery wasn't found (shouldn't happen with the new logic), maybe try replacing the first value? This is risky.
                     console.error("Could not find ID subquery in the failed query for replacement during retry. Query:", initialQuery);
                     throw new Error("Failed to construct retry query: ID subquery pattern not found.");
                     // executedQuery = initialQuery.replace(/VALUES\s*\(\s*[^,]+,/i, `VALUES (${nextId},`); // Less reliable fallback
                }

                console.log(`Retrying SQL for user ${userId} with new ID ${nextId}:`, executedQuery);
                response = await db.run(executedQuery); // Second attempt with fixed ID
                console.log(`SQL Result (2nd attempt) for user ${userId}:`, response);

            } catch (retryError) {
                console.error(`❌ SQL Execution Error (Retry attempt) for user ${userId} on query "${executedQuery}":`, retryError);
                // If retry also fails, report a generic error
                response = "Sorry, I encountered a problem adding the entry even after retrying. Please try again later or check the details.";
                intentMessage = "⚠️ Error Occurred (Retry Failed)";
                entityMessage = "";
            }
        } else {
            // Handle other SQL errors (not duplicate entry)
            let userFriendlyError = "Sorry, I encountered a database problem processing your request.";
             if (sqlError.code) {
                 userFriendlyError = `There was a database error (${sqlError.code}). Please check if your request is valid.`;
             } else if (sqlError.message.includes("Generated SQL query is empty")) {
                  userFriendlyError = "I couldn't generate a valid action based on your request. Could you please rephrase it?";
             }
            response = userFriendlyError;
            intentMessage = "⚠️ Error Occurred";
            entityMessage = "";
        }
    }

    // --- Intent/Entity detection (can run regardless of success/failure) ---
    const intent = detectIntent(question, sessionData);
    const entities = detectEntities(question);
    if (intent) intentMessage = `📌 Intent: ${intent}`;
    if (entities) entityMessage = `🔍 Entities: ${JSON.stringify(entities)}`;
    // ---

    // Format response for LLM
    let finalResponseData = response;
     if (typeof response === 'object' && response !== null && response !== undefined) {
        // Handle potential confirmation objects from DB driver (like OkPacket)
         if (response.affectedRows !== undefined || response.insertId !== undefined || (Array.isArray(response) && response.length === 0 && (executedQuery.toUpperCase().startsWith("INSERT") || executedQuery.toUpperCase().startsWith("UPDATE")|| executedQuery.toUpperCase().startsWith("DELETE"))) ) {
            finalResponseData = "Action completed successfully.";
         } else if (Array.isArray(response)) {
             finalResponseData = response.length === 0 ? "No results found." : JSON.stringify(response, null, 2);
         }
         else {
             finalResponseData = JSON.stringify(response, null, 2);
         }
    } else if (response === undefined || response === null) {
         finalResponseData = executedQuery.toUpperCase().startsWith("SELECT") ? "No results found." : "Action completed successfully.";
    }

    return {
        question: question,
        query: executedQuery, // The query that was last attempted
        response: finalResponseData, // The result or formatted message
        intentMessage: intentMessage,
        entityMessage: entityMessage,
    };
  },
  // 3. Format the final response using the LLM
  finalResponsePrompt,
  llm,
  new StringOutputParser(),
]);


// --- API Endpoint (using Watson Assistant format) ---
app.post("/process-sql", async (req, res) => {
  try {
    const userId = req.body.userId || req.headers['x-user-id'] || "defaultUser";
    const question = req.body.question || req.query.question || (req.body.input && req.body.input.text) || req.body.text;

    if (!question || typeof question !== 'string' || question.trim() === '') {
        console.error("Received empty or invalid question input.");
        return res.status(400).json({ error: "Bad Request", message: "No question provided." });
    }

    console.log(`📝 Processing for user [${userId}]: "${question}"`);
    const finalResponse = await finalChain.invoke({ question, userId });
    const finalText = typeof finalResponse === "string" ? finalResponse : JSON.stringify(finalResponse);

    console.log(`✅ Response for user [${userId}]:`, finalText);
    res.json({
        generic: [{ response_type: "text", text: finalText }]
    });

  } catch (error) {
    console.error("❌ Error processing request in /process-sql handler:", error);
    res.status(500).json({
        generic: [{ response_type: "text", text: "Sorry, an unexpected internal error occurred." }],
        error: process.env.NODE_ENV !== 'production' ? { message: error.message } : undefined
    });
  }
});

// --- Server Start ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});