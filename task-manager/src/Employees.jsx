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
        boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
        height: "100vh",
        position: "fixed",
        top: "100px", // Adjust this to match the height of the navbar
        left: 0,
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
                <a href="/dashboard" style={{ textDecoration: "none" }}>
    <Button
        variant="contained"
        fullWidth
        style={{
            backgroundColor: "#1976d2",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px"
        }}
    >
        <svg xmlns="http://www.w3.org/2000/svg"
             fill="none"
             viewBox="0 0 24 24"
             strokeWidth="1.5"
             stroke="currentColor"
             style={{ width: "20px", height: "20px" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z" />
        </svg>
        Dashboard
    </Button>
    </a>
</li>
                    <li style={{ marginBottom: "10px" }}>
        <a href="/" style={{ textDecoration: "none" }}>
            <Button variant="contained" fullWidth style={{ backgroundColor: "#1976d2", color: "white", display: "flex", alignItems: "center", justifyContent: "center", gap: "2px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={{ width: "20px", height: "20px" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                </svg>
                Tasks
            </Button>
        </a>
    </li>
    <li style={{ marginBottom: "10px" }}>
    <a href="/employees" style={{ textDecoration: "none" }}>
        <Button variant="contained" fullWidth style={{ backgroundColor: "#1976d2", color: "white", display: "flex", alignItems: "center", justifyContent: "center", gap: "3px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={{ width: "20px", height: "20px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
            </svg>
            Employees
        </Button>
        </a>
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

            <Typography variant="h4" gutterBottom style={{fontWeight: "bold", color: "#444"}}>
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
