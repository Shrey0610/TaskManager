import { DataSource } from "typeorm";
import { SqlDatabase } from "langchain/sql_db"; // Updated import path
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import cors from 'cors';
import express from "express";
import "dotenv/config";



const app = express();
const PORT = 5005;

app.use(cors());
app.use(express.json());



const datasource = new DataSource({
  type: "mysql", // Change from sqlite to mysql
  // host: "localhost",
  // port: 3307,
  // username: "root",
  // password: "", // Replace with your MySQL password if set
  // database: "node-sql_test", // Replace with your actual database name
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD, // Replace with your MySQL password if set
  database: process.env.MYSQL_DATABASE,
  // url: process.env.DATABASE_URL, // Use DATABASE_URL from
  synchronize: true, // Set true for development (auto-create tables, but use with caution)
});

await datasource.initialize();
console.log("✅ Database Connected!");

const db = await SqlDatabase.fromDataSourceParams({
  appDataSource: datasource,
  includeTables: ["assignees","tasks"], // Add your tables here
});

const llm = new ChatOpenAI({
  model:"gpt-4o",
  openAIApiKey: process.env.OPENAI_API_KEY,
});

function cleanSqlQuery(query) {
  if (!query) return "";

  return query
    .replace(/```(?:sql|SQL|SQLQuery|mysql|postgresql)?\s*/g, "") // Remove code blocks
    .replace(/```/g, "") // Remove closing triple backticks
    .replace(/^(SQL\s*Query|SQLQuery|MySQL|PostgreSQL|SQL)\s*:\s*/i, "") // Remove unnecessary prefixes
    .replace(/`([^`]*)`/g, "$1") // Remove backticks around table and column names
    .replace(/\s+/g, " ") // Normalize spaces
    .trim();
}



/**
 * ✅ SQL Query Generation Prompt
 */
// const prompt = PromptTemplate.fromTemplate(`
// You are a SQL assistant. Convert the following natural language question into an SQL query. Do not provide any explanation or answers, only return the SQL query. Use the same table names and column names in the query as in the {schema} and don't misinterpret the question.
// Question: {question}
// SQL Query:
// `);

// const prompt = PromptTemplate.fromTemplate(`
//   You are a SQL assistant. Convert the following natural language question into an SQL query.
//   Do NOT use markdown or code blocks (e.g., do NOT wrap the query inside triple backticks like \`\`\`sql).
//   Simply return the SQL query as plain text.
  
//   NOTE: Use the exact same table and column names from the ${schema}!!
//   Do not interpret any names from the {question}!

//   Question: {question}
//   SQL Query:
//   `);

// const prompt = PromptTemplate.fromTemplate(`
//   You are a SQL assistant. Convert the following {question} into an SQL query.
  
//   STRICT RULES:
//   1️⃣ Use the **exact** table and column names from the provided schema:  
//      {schema}
//   2️⃣ **DO NOT** rename, interpret, or modify any table or column names.
//   3️⃣ Do NOT format the output in markdown or code blocks.
  
//   SQL Query:
// `);

  

// /**
//  * ✅ Chain to Generate SQL Query from User's Question
//  */
// const sqlQueryChain = RunnableSequence.from([
//   {
//     schema: async () => db.getTableInfo(),
//     question: (input) => input.question,
//   },
//   prompt,
//   llm.bind({ stop: ["\nSQLResult:"] }),
//   new StringOutputParser(),
// ]);

// // const res = await sqlQueryChain.invoke({
// //   question: "What is the dob of `Prithvi` in `assignees` ?",
// // });
// // console.log({ res }); // Should return SQL query like "SELECT COUNT(*) FROM employees;"

// /**
//  * ✅ Prompt to Convert SQL Response into Natural Language
//  */
// // const finalResponsePrompt = PromptTemplate.fromTemplate(`
// // Based on the table schema below, question, SQL query, and SQL response, write a natural language response:
// // ------------
// // SCHEMA: {schema}
// // ------------
// // QUESTION: {question}
// // ------------
// // SQL QUERY: {query}
// // ------------
// // SQL RESPONSE: {response}
// // ------------
// // NATURAL LANGUAGE RESPONSE:

// // . Make it clear and concise in a readable format. Do NOT use markdown or code blocks (e.g., do NOT wrap the query inside triple backticks like \`\`\`sql). Use the same table names and column names as in {schema} & {query}
// // `);

// const finalResponsePrompt = PromptTemplate.fromTemplate(`
//   Based on the table {schema},{query}, {response}, understand the {question}, then give the response for that {question} in a clear and concise readable format:

//   RESPONSE:
  
//     STRICT RULES:
//   1️⃣ Use the **exact** table and column names from the provided schema:  
//      {schema}
//   2️⃣ **DO NOT** rename, interpret, or modify any table or column names.
//   3️⃣ Do NOT format the output in markdown or code blocks.
//   `);

// /**
//  * ✅ Execute SQL Query and Get Natural Language Response
//  */
// const finalChain = RunnableSequence.from([
//   {
//     question: (input) => input.question,
//     query: sqlQueryChain,
//   },
//   {
//     schema: async () => db.getTableInfo(),
//     question: (input) => input.question,
//     query: (input) => input.query,
//     response: async (input) => db.run(input.query),
//   },
//   finalResponsePrompt,
//   llm,
//   new StringOutputParser(),
// ]);

// app.post("/generate-sql", async (req, res) => {
//   try {
//     const { question } = req.body;
//     let sqlQuery = await sqlQueryChain.invoke({ question });

//     // Clean the SQL query
//     sqlQuery = cleanSqlQuery(sqlQuery);
     
//     console.log({ sqlQuery });
//     res.json({ sqlQuery });
//   } catch (error) {
//     console.error("Error generating SQL query:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });


//   app.post("/execute-query", async (req, res) => {
//     try {
//       const { question } = req.body;
//       let finalResponse = await finalChain.invoke({ question });
//       finalResponse = cleanSqlQuery(finalResponse);
      
//       console.log("🔹 Cleaned SQL Query:", finalResponse); // Debug log
//       res.json({ finalResponse });
//     } catch (error) {
//       console.error("Error executing query:", error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   });

const prompt = PromptTemplate.fromTemplate(`
  You are a precise SQL query generator. Given a natural language question, create an SQL query that follows these STRICT guidelines:
  
  1. Use ONLY the exact table and column names from this schema: {schema}
  2. Use COUNT() functions when the question asks "how many"
  3. Match the query structure to the question's intent (counting, listing, filtering)
  4. Use JOINs when needed to combine multiple tables
  5. Do NOT explain—return only the SQL query
  6. If the question is to add a task or a new assignee, then check the last ID and write the query accordingly.
  7. Wait for the next question if there is anything missing in the current question before providing the SQL query.
  8. Auto-increment the ID for new entries in the table.

  User question: {question}
  
  SQL Query:
  `);

  const sqlQueryChain = RunnableSequence.from([
    {
      schema: async () => {
        const schemaInfo = await db.getTableInfo();
        if (!schemaInfo || Object.keys(schemaInfo).length === 0) {
          throw new Error("Database schema is empty or undefined.");
        }
        return schemaInfo;
      },
      question: (input) => input.question,
    },
    prompt,
    llm.bind({ stop: ["\nSQLResult:"] }),
    new StringOutputParser(),
    async (query) => {
      // If the query is an INSERT and contains a fixed id value, replace it with a dynamic id subquery.
      if (query.startsWith("INSERT INTO assignees") && query.includes("VALUES (")) {
        query = query.replace(
          /VALUES \(\s*\d+\s*,/,
          "VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM assignees),"
        );
      }
      if (!query || query.trim() === "") {
        throw new Error("Generated SQL query is empty.");
      }
      return query;
    }
    
  ]);

  const userSession = {}; // Temporary session store for tracking conversation state

  

// Function to detect intents
function detectIntent(question, sessionData) {
  const qLower = question.toLowerCase();

  if (sessionData && sessionData.pendingDetails) return "incomplete-action";

  if (qLower.includes("add") && qLower.includes("employee" || "assignee")) return "add-employee";
  if (qLower.includes("add" || "assign") && qLower.includes("task")) return "add-task";
  if (qLower.includes("how many") && qLower.includes("employee")) return "count-employees";
  if (qLower.includes("who") || qLower.includes("which")) return "entity-identification";
  if (qLower.includes("list") || qLower.includes("show me")) return "list-entities";

  return "general-query";
}


// Function to detect entities
function detectEntities(question) {
  const entities = [];
  if (!question || typeof question !== "string") {
    console.error("Invalid question input:", question);
    return entities.length > 0 ? entities : null;
  }
  const qLower = question.toLowerCase();

  if (qLower.includes("email")) entities.push("email");
  if (qLower.includes("priority")) entities.push("priority");
  if (qLower.includes("assignee")) entities.push("taskAssignee");
  if (qLower.includes("task name")) entities.push("task_name");
  if (qLower.includes("status")) entities.push("taskStatus");

  return entities.length > 0 ? entities : null;
}

const finalResponsePrompt = PromptTemplate.fromTemplate(`
  You are a helpful database assistant. Provide a clear, accurate answer based ONLY on these SQL results.
  
  GUIDELINES:
  1. Answer the question directly and briefly
  2. DO NOT mention SQL or queries
  3. If the result is a count, give the number directly
  4. Use natural, simple language
  5. If intent or entities are detected, instruct the user, otherwise ignore them.
  *6. Only If the query is to add the details in the table and there are missing values, guide the user by requesting specifics like @assignee_name or @task_name, or @priority or anything which is required.*
  7. If you feel like the question is incomplete while updating the details, only then ask the user for those details. For ex. If there are conflicting names in the table, ask the user to provide the ID of the task or assignee.
  8. If there is anything NULL in the SQL query, ask for it before providing the answer.
  

  Question: {question}
  SQL Result: {response}

  {intentMessage}
  {entityMessage}

  Your answer:
  `);

 // Define required fields for each intent
const requiredFields = {
  "add-employee": ["name", "email", "phoneNum", "dob"],
  "add-task": ["task_name", "priority", "taskAssignee", "taskStatus", "start", "end"],
};

// A helper function to check for missing fields
function getMissingFields(question, intent) {
  // For simplicity, here we assume that if a required field’s keyword is not found in the question text, it’s missing.
  // (In production, you might have a more robust entity extraction.)
  const qLower = question.toLowerCase();
  const required = requiredFields[intent] || [];
  return required.filter(field => !qLower.includes(field));
}

// Remove id field from an INSERT query if present (for add-employee or add-task)
function removeIdFromInsert(query, tableName) {
  // For example, remove "id, " from the column list and the corresponding value (assumed to be a number) from the VALUES list.
  // This regex assumes the query is of the form: INSERT INTO tableName (id, col1, col2, ...) VALUES (4, val1, val2, ...);
  const pattern = new RegExp(`\\(\\s*id\\s*,\\s*`, 'i');
  if (query.startsWith(`INSERT INTO ${tableName}`) && pattern.test(query)) {
    query = query.replace(pattern, '(');
    // Also remove the first value from the VALUES list:
    query = query.replace(/\( ?\d+ ?,(.*)\)/, '($1)');
  }
  return query;
}

const finalChain = RunnableSequence.from([
  {
    question: (input) => input.question,
    query: sqlQueryChain,
  },
  async (input) => {
    const userId = input.userId || "defaultUser";
    const question = input.question;
    let query = input.query;
    
    // Determine the intent
    const intent = detectIntent(question);
    const entities = detectEntities(question) || [];
    
    // Check if this is an "add" intent that requires extra details
    if (intent === "add-employee" || intent === "add-task") {
      const missingFields = getMissingFields(question, intent);
      if (missingFields.length > 0) {
        // Return a follow-up prompt rather than executing the SQL.
        return {
          question,
          response: `I need the following details to proceed: ${missingFields.map(f => "@" + f).join(", ")}.`,
          intentMessage: `📌 **Intent Detected:** ${intent}`,
          entityMessage: `🔍 **Entities Identified:** ${entities.length > 0 ? entities.join(", ") : "None"}`,
          followUp: true,
        };
      }
      // For add intents, remove the fixed id field from the generated query.
      if (intent === "add-employee") {
        query = removeIdFromInsert(query, "assignees");
      }
      if (intent === "add-task") {
        query = removeIdFromInsert(query, "tasks");
      }
    }
    
    // If we reached here, assume all required details are present.
    if (!query || query.trim() === "") {
      throw new Error("SQL query is empty.");
    }
    
    // Execute the query (for example, an INSERT or UPDATE)
    let response;
    try {
      response = await db.run(cleanSqlQuery(query));
    } catch (dbError) {
      console.error("❌ SQL Execution Error:", dbError);
      // Handle duplicate entry or missing values errors specifically
      if (dbError.code === "ER_DUP_ENTRY") {
        return {
          question,
          response: `⚠️ An entry with these details already exists. Please try again with unique information.`,
          intentMessage: `📌 **Intent Detected:** ${intent}`,
          entityMessage: `🔍 **Entities Identified:** ${entities.length > 0 ? entities.join(", ") : "None"}`,
        };
      }
      if (dbError.code === "ER_BAD_NULL_ERROR") {
        return {
          question,
          response: `⚠️ Some required fields are missing. Please ensure that none of the required fields (e.g. ${intent === "add-employee" ? "name, email, phoneNum, dob" : "task_name, priority, taskAssignee, taskStatus, start, end"}) are null.`,
          intentMessage: `📌 **Intent Detected:** ${intent}`,
          entityMessage: `🔍 **Entities Identified:** ${entities.length > 0 ? entities.join(", ") : "None"}`,
        };
      }
      return {
        question,
        response: "I'm unable to process this request. Please check the question or try again later.",
        intentMessage: `📌 **Intent Detection Failed**`,
        entityMessage: `🔍 **Entity Detection Failed**`
      };
    }
    
    return {
      question,
      query,
      response,
      intentMessage: `📌 **Intent Detected:** ${intent}`,
      entityMessage: `🔍 **Entities Identified:** ${entities.length > 0 ? entities.join(", ") : "None"}`,
    };
  },
  finalResponsePrompt,
  llm,
  new StringOutputParser(),
]);

app.post("/process-sql", async (req, res) => {
  try {
    console.log("Received request:", req.body);

    // Extract question from possible locations
    const question = req.body.question || req.query.question || req.body.input?.text;
    console.log("📝 Processing:", question);

    const finalResponse = await finalChain.invoke({ question });
    const finalText = typeof finalResponse === "string"
      ? finalResponse
      : finalResponse.text || JSON.stringify(finalResponse);

    console.log("✅ Response:", finalText);
    res.json({ output: finalText });
  } catch (error) {
    console.error("❌ Error processing request:", error);
    res.status(500).json({ error: "Query Processing Error", message: "An unexpected error occurred. Please try again." });
  }
});  



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

