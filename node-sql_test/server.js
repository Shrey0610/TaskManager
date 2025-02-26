import dotenv from "dotenv";
import express from "express";
import mysql from "mysql";
// import cors from "cors";

dotenv.config();

const app = express();
// app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", 
    database: "node-sql_test",
    port: 3307
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL database");
    }
});

// Fetch all tasks
app.get("/tasks", (req, res) => {
    db.query("SELECT * FROM tasks", (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.send(results);
    });
});

// Add a task
app.post("/tasks", (req, res) => {
    const { taskStatus, priority } = req.body;
    db.query("INSERT INTO tasks (taskStatus, priority) VALUES (?, ?)", 
        [taskStatus, priority], 
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: "Task added successfully", id: result.insertId });
        }
    );
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM tasks WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Task deleted successfully" });
    });
});

// Edit a task
app.put("/tasks/:id", (req, res) => {
    const { id } = req.params;
    const { taskStatus, priority } = req.body;
    db.query("UPDATE tasks SET taskStatus = ?, priority = ? WHERE id = ?", 
        [taskStatus, priority, id], 
        (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: "Task updated successfully" });
        }
    );
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
