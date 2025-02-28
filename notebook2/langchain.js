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

const prompt = PromptTemplate.fromTemplate(`
  You are a SQL assistant. Convert the following natural language question into an SQL query.
  
  STRICT RULES:
  1️⃣ Use the **exact** table and column names from the provided schema:  
     {schema}
  2️⃣ **DO NOT** rename, interpret, or modify any table or column names.
  3️⃣ Do NOT format the output in markdown or code blocks.
  
  Question: {question}
  SQL Query:
`);

  

/**
 * ✅ Chain to Generate SQL Query from User's Question
 */
const sqlQueryChain = RunnableSequence.from([
  {
    schema: async () => db.getTableInfo(),
    question: (input) => input.question,
  },
  prompt,
  llm.bind({ stop: ["\nSQLResult:"] }),
  new StringOutputParser(),
]);

// const res = await sqlQueryChain.invoke({
//   question: "What is the dob of `Prithvi` in `assignees` ?",
// });
// console.log({ res }); // Should return SQL query like "SELECT COUNT(*) FROM employees;"

/**
 * ✅ Prompt to Convert SQL Response into Natural Language
 */
// const finalResponsePrompt = PromptTemplate.fromTemplate(`
// Based on the table schema below, question, SQL query, and SQL response, write a natural language response:
// ------------
// SCHEMA: {schema}
// ------------
// QUESTION: {question}
// ------------
// SQL QUERY: {query}
// ------------
// SQL RESPONSE: {response}
// ------------
// NATURAL LANGUAGE RESPONSE:

// . Make it clear and concise in a readable format. Do NOT use markdown or code blocks (e.g., do NOT wrap the query inside triple backticks like \`\`\`sql). Use the same table names and column names as in {schema} & {query}
// `);

const finalResponsePrompt = PromptTemplate.fromTemplate(`
  Based on the {question} entered, interpret the SQL query, and SQL response, and then give the natural language response with reference to the {schema} provided:
  ------------
  SCHEMA: {schema}
  ------------
  QUESTION: {question}
  ------------
  SQL QUERY: {query}
  ------------
  SQL RESPONSE: {response}
  ------------
  NATURAL LANGUAGE RESPONSE:
  
  . Make it clear and concise in a readable format. Do NOT use markdown or code blocks (e.g., do NOT wrap the query inside triple backticks like \`\`\`sql). Use the same table names and column names as in {schema} & {query}
  `);


/**
 * ✅ Execute SQL Query and Get Natural Language Response
 */
const finalChain = RunnableSequence.from([
  {
    question: (input) => input.question,
    query: sqlQueryChain,
  },
  {
    schema: async () => db.getTableInfo(),
    question: (input) => input.question,
    query: (input) => input.query,
    response: async (input) => db.run(input.query),
  },
  finalResponsePrompt,
  llm,
  new StringOutputParser(),
]);

// app.post("/generate-sql", async (req, res) => {
//   try {
//     const { question } = req.body;
//     const sqlQuery = await sqlQueryChain.invoke({ question });
//     console.log({ sqlQuery });
//     res.json({ sqlQuery });
//   } catch (error) {
//     console.error("Error generating SQL query:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
//   });

app.post("/generate-sql", async (req, res) => {
  try {
    const { question } = req.body;
    let sqlQuery = await sqlQueryChain.invoke({ question });

    // Clean the SQL query
    sqlQuery = cleanSqlQuery(sqlQuery);
     
    console.log({ sqlQuery });
    res.json({ sqlQuery });
  } catch (error) {
    console.error("Error generating SQL query:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


  app.post("/execute-query", async (req, res) => {
    try {
      const { question } = req.body;
      let finalResponse = await finalChain.invoke({ question });
      finalResponse = cleanSqlQuery(finalResponse);
      
      console.log("🔹 Cleaned SQL Query:", finalResponse); // Debug log
      res.json({ finalResponse });
    } catch (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

