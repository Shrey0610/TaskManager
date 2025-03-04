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

// // app.post("/generate-sql", async (req, res) => {
// //   try {
// //     const { question } = req.body;
// //     const sqlQuery = await sqlQueryChain.invoke({ question });
// //     console.log({ sqlQuery });
// //     res.json({ sqlQuery });
// //   } catch (error) {
// //     console.error("Error generating SQL query:", error);
// //     res.status(500).json({ error: "Internal Server Error" });
// //   }
// //   });

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
  2. For questions about counts or quantities, always use COUNT() functions appropriately
  3. For "how many" questions about employees, use COUNT(DISTINCT employee_id) or the appropriate unique identifier
  4. Match the query structure to the intent of the question (counting, filtering, summarizing)
  5. Consider all possible tables needed to answer the question completely
  6. Structure complex queries with appropriate JOINs when needed
  
  User question: {question}
  
  SQL Query (no markdown, no explanations, query only):
  `);
  
  // Chain to generate SQL query
  const sqlQueryChain = RunnableSequence.from([
    {
      schema: async () => db.getTableInfo(),
      question: (input) => input.question,
    },
    prompt,
    llm.bind({ stop: ["\nSQLResult:"] }),
    new StringOutputParser(),
  ]);
  
  // Validation function to check if the query matches the question type
  const validateQueryMatch = (query, question) => {
    // Basic validation rules
    const isCountQuestion = question.toLowerCase().includes("how many");
    const hasCountFunction = query.toLowerCase().includes("count(");
    
    if (isCountQuestion && !hasCountFunction) {
      console.warn("⚠️ Query validation failed: Count question but no COUNT function");
      return false;
    }
    
    return true;
  };
  
  // Improved response template with clear instructions for different question types
  const finalResponsePrompt = PromptTemplate.fromTemplate(`
  You are a helpful database assistant. Provide a clear, accurate answer based ONLY on these SQL results.
  
  GUIDELINES:
  1. Answer the question directly and precisely
  2. For count questions, provide the exact number without extra text
  3. DO NOT mention SQL or queries in your response
  4. Use natural, conversational language
  5. If the result doesn't answer the question, say so clearly
  
  Original question: {question}
  SQL Query executed: {query}
  SQL Result: {response}
  
  Your concise answer:
  `);
  
  const finalChain = RunnableSequence.from([
    {
      question: (input) => input.question,
      query: sqlQueryChain,
    },
    async (input) => {
      const query = input.query;
      
      // Validate query matches question type
      if (!validateQueryMatch(query, input.question)) {
        // Generate a corrected query if validation fails
        console.log("🔄 Regenerating query with more specific instructions");
        const correctedQuery = await llm.invoke(
          `The question "${input.question}" requires a SQL query that specifically counts or filters correctly. The original query doesn't match the question type. Generate a corrected SQL query using this schema: ${await db.getTableInfo()}`
        );
        input.query = correctedQuery;
      }
      
      return {
        schema: await db.getTableInfo(),
        question: input.question,
        query: input.query,
        response: await db.run(input.query),
      };
    },
    finalResponsePrompt,
    llm,
    new StringOutputParser(),
  ]);
  
  // API endpoint with improved error handling
  app.post("/process-sql", async (req, res) => {
    try {
      const { question } = req.body;
      console.log("📝 Processing question:", question);
      
      // Detect intent from question to help guide processing
      const intent = await detectIntent(question);
      console.log("🎯 Detected intent:", intent);
      
      let finalResponse = await finalChain.invoke({ 
        question,
        intent // Pass the intent to the chain
      });
      
      console.log("✅ Final response:", finalResponse);
      res.json({ finalResponse });
    } catch (error) {
      console.error("❌ Error processing SQL query:", error);
      
      // More informative error handling
      const errorMessage = error.message || "Unknown error occurred";
      const errorResponse = `I'm unable to process this database question correctly. The specific issue is: ${errorMessage}. Please try rephrasing your question.`;
      
      res.status(500).json({ 
        error: "Query Processing Error",
        message: errorResponse
      });
    }
  });
  
  // Intent detection function
  async function detectIntent(question) {
    // Simple intent detection based on keywords
    const questionLower = question.toLowerCase();
    
    if (questionLower.includes("how many") && 
        (questionLower.includes("employee") || questionLower.includes("assignee"))) {
      return "count-employees";
    } else if (questionLower.includes("how many") && questionLower.includes("task")) {
      return "count-tasks";
    } else if (questionLower.includes("who") || questionLower.includes("which")) {
      return "entity-identification";
    } else if (questionLower.includes("list") || questionLower.includes("show me")) {
      return "list-entities";
    }
    
    return "general-query";
  }

  


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

