import { useContext, useState } from "react";
import { EmployeeContext } from "./EmployeeContext";
import AddEmployeeForm from "./AddEmployeeForm";
import Modal from "react-modal";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
    Typography,
} from "@mui/material";
import "./App.css";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import EditEmployeeForm from "./EditEmployeeForm";

const Employees = () => {
    const { assignees, deleteAssignee, editAssignee } = useContext(EmployeeContext);
    const [editId, setEditId] = useState(null);
    const [editField, setEditField] = useState(null);
    const [editData, setEditData] = useState({ id: "", name: "", email: "", phoneNum: "", dob: "" });

    const handleEdit = (employee, field) => {
        setEditId(employee.id);
        setEditField(field);
        setEditData({ id: employee.id, name: employee.name, email: employee.email, phoneNum: employee.phoneNum, dob: employee.dob });
    };

    const handleSave = (id) => {
        editAssignee(id, editData);
        setEditId(null);
        setEditField(null);
    };

    const handleKeyPress = (event, id) => {
        if (event.key === "Enter") {
            handleSave(id);
        }
    };

    const [addModalIsOpen, setAddModalIsOpen] = useState(false);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const openAddModal = () => setAddModalIsOpen(true);
    const closeAddModal = () => setAddModalIsOpen(false);

    const openEditModal = (employee) => {
        setSelectedEmployee(employee);
        setEditModalIsOpen(true);
    };

    const closeEditModal = () => {
        setSelectedEmployee(null);
        setEditModalIsOpen(false);
    };

    const customStyles = {
        content: {
            border: "2px solid #000",
            borderRadius: "10px",
            width: "50%",
            height: "75%",
            margin: "auto",
        },
        overlay: {
            backgroundColor: "rgba(255, 255, 255, 0)",
            backdropFilter: "blur(0.5px)",
        },
    };

    const sidebarStyles = {
        width: "250px",
        backgroundColor: "#e0e0e0",
        padding: "20px",
        borderRight: "1px solid #ccc",
        height: "100vh",
        position: "fixed",
        top: "90px", // Adjust this to match the height of the navbar
        left: 0,
        boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
    };

    const contentStyles = {
        marginLeft: "270px", // Adjust this to account for the sidebar width
        padding: "20px",
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
            {/* Sidebar */}
            <div style={sidebarStyles}>
                {/* <Typography variant="h6" gutterBottom style={{ fontWeight: "bold", color: "#333" }}>
                    Sidebar
                </Typography> */}
                <ul style={{ listStyleType: "none", padding: 0 }}>
                    <li style={{ marginBottom: "10px" }}>
                        <Button variant="contained" fullWidth style={{ backgroundColor: "#1976d2", color: "white" }}>
                            Dashboard
                        </Button>
                    </li>
                    <li style={{ marginBottom: "10px" }}>
                        <Button variant="contained" fullWidth style={{ backgroundColor: "#1976d2", color: "white" }}>
                            Tasks
                        </Button>
                    </li>
                    <li style={{ marginBottom: "10px" }}>
                        <Button variant="contained" fullWidth style={{ backgroundColor: "#1976d2", color: "white" }}>
                            Employees
                        </Button>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div style={contentStyles}>


                    {/* Add Employee Button */}
                    <div className="pop-up">
            <Modal
    isOpen={addModalIsOpen}
    onRequestClose={closeAddModal}
    contentLabel="Add Employee"
    style={customStyles}
>
    <AddEmployeeForm />
    <button id='cross' onClick={closeAddModal}>❌</button>
</Modal>
<div style={{ display: "flex", flexDirection: 'column', gap: "0px", alignItems: "center" }}>
<button onClick={openAddModal} style={{ borderColor: 'black' }}>
    Add Employee
</button>
</div>
</div>


            <br />

            <Typography variant="h4" gutterBottom>
                Employees
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow style={{ backgroundColor: '#c2c2c2' }}>
                            <TableCell align="center">ID</TableCell>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">Phone Number</TableCell>
                            <TableCell align="center">Date of Birth</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {assignees.map((employee, index) => (
                            <TableRow key={employee.id} style={{ backgroundColor: index % 2 === 1 ? '#f5f5f5' : 'inherit' }}>
                                <TableCell align="center">{employee.id}</TableCell>
                                <TableCell align="center">
                                    {editId === employee.id && editField === "name" ? (
                                        <TextField
                                            value={editData.name}
                                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                            onKeyPress={(e) => handleKeyPress(e, employee.id)}
                                            onBlur={() => handleSave(employee.id)}
                                            autoFocus
                                        />
                                    ) : (
                                        <span onDoubleClick={() => handleEdit(employee, "name")}>{employee.name}</span>
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    {editId === employee.id && editField === "email" ? (
                                        <TextField
                                            value={editData.email}
                                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                            onKeyPress={(e) => handleKeyPress(e, employee.id)}
                                            onBlur={() => handleSave(employee.id)}
                                            autoFocus
                                        />
                                    ) : (
                                        <span onDoubleClick={() => handleEdit(employee, "email")}>{employee.email}</span>
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    {editId === employee.id && editField === "phoneNum" ? (
                                        <TextField
                                            value={editData.phoneNum}
                                            onChange={(e) => setEditData({ ...editData, phoneNum: e.target.value })}
                                            onKeyPress={(e) => handleKeyPress(e, employee.id)}
                                            onBlur={() => handleSave(employee.id)}
                                            autoFocus
                                        />
                                    ) : (
                                        <span onDoubleClick={() => handleEdit(employee, "phoneNum")}>{employee.phoneNum}</span>
                                    )}
                                </TableCell>
                                <TableCell align="center">
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    {editId === employee.id && editField === "dob" ? (
      <DatePicker
        value={editData.dob ? dayjs(editData.dob) : null}
        format="YYYY-MM-DD"
        onChange={(newValue) => {
          if (newValue) {
            const formattedDate = newValue.format("YYYY-MM-DD");
            setEditData((prev) => ({ ...prev, dob: formattedDate }));
          }
        }}
        slotProps={{ textField: { fullWidth: true } }}
        onKeyPress={(e) => handleKeyPress(e, employee.id)}
        onClose={() => handleSave(employee.id)}
        autoFocus
      />
    ) : (
      <div onClick={() => handleEdit(employee, "dob")}>
        {employee.dob ? dayjs(employee.dob).format("YYYY-MM-DD") : "Select Date"}
      </div>
    )}
  </LocalizationProvider>
</TableCell>
<TableCell align="center" style={{ minWidth: "120px", whiteSpace: "nowrap" }}>
                                <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                                    {editId === employee.id ? (
                                        <Button variant="contained" color="primary" onClick={() => handleSave(employee.id)} style={{ marginRight: '8px',  display: 'flex' }}>
                                            Save
                                        </Button>
                                    ) : (

                                           <div className="pop-up">
                                           <Modal
                                            isOpen={editModalIsOpen}
                                            onRequestClose={closeEditModal}
                                            contentLabel="Edit Employee"
                                            style={customStyles}
                                        >
                                            {selectedEmployee && <EditEmployeeForm taskid={selectedEmployee.id} />}
                                            <button id='cross' onClick={closeEditModal}>❌</button>
                                        </Modal>
                                        <Button variant="contained" color="primary" onClick={() => openEditModal(employee)}>
                                            EDIT
                                        </Button>

                                            </div>

                                    )}
                                    <Button variant="contained" color="secondary" onClick={() => deleteAssignee(employee.id)}>
                                        Delete
                                    </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
        </div>
    );
};

export default Employees;
