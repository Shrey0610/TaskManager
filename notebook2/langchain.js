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
      if (!query || query.trim() === "") {
        throw new Error("Generated SQL query is empty.");
      }
      return query;
    }
  ]);
  

// Function to detect intents
function detectIntent(question) {
  if (!question || typeof question !== "string") {
    console.error("Invalid question input:", question);
    return "general-query";
  }
  const qLower = question.toLowerCase();

  if (qLower.includes("how many") && qLower.includes("employee")) return "count-employees";
  if (qLower.includes("how many") && qLower.includes("task")) return "count-tasks";
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

// const finalResponsePrompt = PromptTemplate.fromTemplate(`
//   You are a helpful database assistant. Provide a clear, accurate answer based ONLY on these SQL results.
  
//   GUIDELINES:
//   1. Answer the question directly and briefly
//   2. DO NOT mention SQL or queries
//   3. If the result is a count, give the number directly
//   4. Use natural, simple language
//   5. If intent or entities are detected, instruct the user, otherwise ignore them.
//   6. If there is any missing information in the {question} and the {response} then return it as the answer.

//   Question: {question}
//   SQL Result: {response}

//   {intentMessage}
//   {entityMessage}

//   Your answer:
//   `);

const finalResponsePrompt = PromptTemplate.fromTemplate(`
  You are a helpful database assistant. Provide a clear, accurate answer based ONLY on these SQL results.

  GUIDELINES:
  1. Answer the question directly and briefly
  2. DO NOT mention SQL or queries
  3. If the result is a count, give the number directly
  4. Use natural, simple language
  5. If intent or entities are detected, ask follow-up questions for any missing information
  *6. Only If the query is to add or update the details in any table and there are missing values, strictly request for them specifics like @assignee_name, @task_name, or @priority or anything ftom the query. If the user provides them only then convert it to the {response}*

  Question: {question}
  SQL Result: {response}

  {intentMessage}
  {entityMessage}

  Your answer:
  `);

 function generateFollowUp(question, entities) {
    if (!question || typeof question !== "string") {
        return null;
    }

    const qLower = question.toLowerCase();

    // Ensure `entities` is treated as an array (handles null/undefined cases)
    const validEntities = Array.isArray(entities) ? entities : [];

    if (qLower.includes("assignee") && !validEntities.includes("taskAssignee")) {
        return "Can you provide the assignee's name or contact details?";
    }

    if (
        qLower.includes("task") &&
        !validEntities.some(e => ["task_name", "priority", "taskStatus"].includes(e))
    ) {
        return "Could you specify the task name, priority, or status?";
    }

    return null;
}



const finalChain = RunnableSequence.from([
  {
    question: (input) => input.question,
    query: sqlQueryChain,
  },
  async (input) => {
    const query = input.query;

    try {
      if (!query || query.trim() === "") {
        throw new Error("SQL query is empty.");
      }

      const intent = detectIntent(input.question);
      const entities = detectEntities(input.question) || [];

      // ✅ Define required fields for each intent
      const requiredFields = {
        "add-task": ["task_name", "assignee", "priority"],
        "update-task": ["task_id", "status"],
        "add-employee": ["name", "email", "phoneNum", "dob"],
      };

      const missingFields = requiredFields[intent]?.filter(
        (field) => !entities.includes(field)
      ) || [];

      if (missingFields.length > 0) {
        return {
          question: input.question,
          response: `I need the following details to proceed: ${missingFields.join(", ")}.`,
          intentMessage: `📌 **Intent Detected:** ${intent}`,
          entityMessage: `🔍 **Entities Identified:** ${entities.join(", ")}`,
        };
      }

      // ✅ Handle Duplicate Entry Errors
      try {
        const response = await db.run(cleanSqlQuery(query));

        const intentMessage = intent !== "general-query"
          ? `📌 **Intent Detected:** ${intent}`
          : "📌 **Intent Detected:** None";

        const entityMessage = entities?.length
          ? `🔍 **Entities Identified:** ${entities.join(", ")}`
          : "🔍 **Entities Identified:** None";

        return {
          question: input.question,
          query,
          response,
          intentMessage,
          entityMessage,
        };
      } catch (dbError) {
        if (dbError.code === "ER_DUP_ENTRY") {
          return {
            question: input.question,
            response: `⚠️ The employee with this ID already exists. Please try again with a unique ID.`,
          };
        }

        throw dbError;
      }
    } catch (error) {
      console.error("❌ SQL Execution Error:", error);
      return {
        question: input.question,
        response: "I'm unable to process this request. Please check the question or try again later.",
        intentMessage: "📌 **Intent Detection Failed**",
        entityMessage: "🔍 **Entity Detection Failed**"
      };
    }
  },
  finalResponsePrompt,
  llm,
  new StringOutputParser(),
]);


  

app.post("/process-sql", async (req, res) => {
  try {
    console.log("Received request:", req.body); // Debugging

    // Extract question from multiple possible locations
    const question = req.body.question || req.query.question || req.body.input?.text;
    console.log("📝 Processing:", question);

    const finalResponse = await finalChain.invoke({ question });
    const finalText = typeof finalResponse === "string" ? finalResponse : finalResponse.text || JSON.stringify(finalResponse);


    console.log("✅ Response:", finalText);
    res.json({ output:  finalText } );
    console.log("📩 Received request:");
    console.log("Headers:", req.headers);
    console.log("Body:", JSON.stringify(req.body, null, 2)); // Pretty-printing for clarity
    console.log("Query Params:", req.query);


  } catch (error) {
    console.error("❌ Error processing request:", error);
    res.status(500).json({ error: "Query Processing Error", message: "An unexpected error occurred. Please try again." });
  }
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

