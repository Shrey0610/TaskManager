import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";

export const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
    const [assignees, setAssignees] = useState([
        { id: 1, name: "Shrey", email: "ss@example.com", phoneNum: "12345678", dob: "2003-10-06" },
    ]);

    const [syncTrigger, setSyncTrigger] = useState(0);


    // Fetch assignees from MySQL on component mount
    const fetchAssignee = async() => {
        await fetch("http://localhost:5002", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then(response => response.json())
            .then(data => setAssignees(data))
            .catch(error => console.error("Error fetching assignees:", error));
    };

    useEffect(() => {
        fetchAssignee();
    }, [syncTrigger]);

    const handleSync = () => setSyncTrigger(prev => prev + 1);

    // Add Employee
    const addAssignee = (employee) => {
        fetch("http://localhost:5002", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(employee),
        })
            .then(() => fetchAssignee())  // Re-fetch assignees after addition
            .catch(error => console.error("Error adding employee:", error));
    };

    // Delete Employee
    const deleteAssignee = (id) => {
        fetch(`http://localhost:5002/${id}`, {
            method: "DELETE",
        })
            .then(() => fetchAssignee())  // Re-fetch assignees after deletion
            .catch(error => console.error("Error deleting employee:", error));
    };

    // Edit Employee
    const editAssignee = (id, updatedEmployee) => {
        fetch(`http://localhost:5002/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedEmployee),
        })
            .then(() => fetchAssignee())  // Re-fetch assignees after update
            .catch(error => console.error("Error updating employee:", error));
    };

    return (
        <>
        <Button variant="contained" color="secondary" onClick={handleSync} style={{marginTop: "125px", marginLeft: "270px"}}>
                Sync Employees
            </Button>
        <EmployeeContext.Provider value={{ assignees, addAssignee, deleteAssignee, editAssignee, fetchAssignee }}>
            {children}
        </EmployeeContext.Provider>
        </>
    );
};

// Prop type validation for 'children'
EmployeeProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
