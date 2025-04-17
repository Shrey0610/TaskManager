import { createContext, useState, useEffect, } from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";

export const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
    const [tasks, setTasks] = useState([
        { id: 1, name: "Task 1", taskStatus: "Pending", taskAssignee: "Test1", priority: "High", description: "This is a test task", start: "", end:"" },
        { id: 2, name: "Task 2", taskStatus: "Completed", taskAssignee: "Test2", priority: "Medium", description: "This is a test task", start: "", end:"" }
    ]);
    
    const [syncTrigger, setSyncTrigger] = useState(0);

    // Fetch tasks from MySQL on component mount
    const fetchTasks = async (task) => {
       await fetch("http://localhost:5001", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then(setTasks([...tasks, { id: tasks.length + 1, ...task }]))
            .then(response => response.json())
            .then(data => setTasks(data))
            .catch(error => console.error("Error fetching tasks:", error));
    };

    useEffect(() => {
        fetchTasks();
    }, [syncTrigger]);

    const handleSync = () => setSyncTrigger(prev => prev + 1);

    // Add Task
    const addTask = (task) => {
        fetch("http://localhost:5001", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task),
        })
            .then(setTasks([...tasks, { id: tasks.length + 1, ...task }]))
            .then(() => fetchTasks())  // Re-fetch tasks after addition
            .catch(error => console.error("Error adding task:", error));
    };

    // Delete Task
    const deleteTask = (id) => {
        fetch(`http://localhost:5001/${id}`, {
            method: "DELETE",
        })
            .then(() => fetchTasks())  // Re-fetch tasks after deletion
            .catch(error => console.error("Error deleting task:", error));
        setTasks(tasks.filter(task => task.id !== id));
    };

    // Edit Task
    const editTask = (id, updatedTask) => {
        fetch(`http://localhost:5001/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTask),
        })
            .then(response => response.json())
            .then(() => fetchTasks())  // Re-fetch tasks after update
            .catch(error => console.error("Error updating task:", error));
        setTasks(tasks.map(task => (task.id === id ? { ...task, ...updatedTask } : task)));
    };


    return (
        <>
        <Button variant="contained" color="primary" onClick={handleSync}>
            Sync Tasks
        </Button>
        <TasksContext.Provider value={{ tasks, addTask, deleteTask, editTask, fetchTasks }}>
            {children}
        </TasksContext.Provider>
        </>
    );
};

// Prop type validation for 'children'
TasksProvider.propTypes = {
    children: PropTypes.node.isRequired,
};


// import { createContext } from "react";
// import { useState } from "react";
// import PropTypes from 'prop-types';

// export const TasksContext = createContext();

// export const TasksProvider = ({ children }) => {
//     const [tasks, setTasks] = useState([
//         { id: 1, name: "Task 1", taskStatus: "Pending", taskAssignee: "Test1", priority: "High" },
//         { id: 2, name: "Task 2", taskStatus: "Completed", taskAssignee: "Test2", priority: "Medium" }
//     ]);

//     const addTask = (task) => setTasks([...tasks, { id: tasks.length + 1, ...task }]);
//     const deleteTask = (id) => setTasks(tasks.filter(task => task.id !== id));
//     const editTask = (id, updatedTask) => {
//         setTasks(tasks.map(task => (task.id === id ? { ...task, ...updatedTask } : task)));
//     };

//     return (
//         <TasksContext.Provider value={{ tasks, addTask, deleteTask, editTask }}>
//             {children}
//         </TasksContext.Provider>
//     );
// };

// // Prop type validation for 'children'
// TasksProvider.propTypes = {
//     children: PropTypes.node.isRequired,
// };

