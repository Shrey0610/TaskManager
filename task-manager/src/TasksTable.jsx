import { useContext, useState } from "react";
import { TasksContext } from "./TasksContext";
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
    Select,
    MenuItem,
    Typography,
} from "@mui/material";
import './App.css';


import EditTaskForm from "./EditTaskForm";
import Modal from 'react-modal';
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";


const TasksTable = () => {
    const { tasks, deleteTask, editTask } = useContext(TasksContext);
    const [editId, setEditId] = useState(null);
    const [editField, setEditField] = useState(null);
    const [, setStarted] = useState(false);
    const [editData, setEditData] = useState({ name: "", taskStatus: "", taskAssignee: "", priority: "", description: "", start: "", end:""});
    
    const handleEdit = (task, field) => {
        setEditId(task.id);
        setEditField(field);
        setEditData({ id: task.id,name: task.name, taskStatus: task.taskStatus, taskAssignee: task.taskAssignee, priority: task.priority, description: task.description, start: task.start, end: task.end });
    };
    
    const handleSave = (id) => {
        editTask(id, editData);
        setEditId(null);
        setEditField(null);
    };

    const handleStarting = (task) => {  
        if (task.taskStatus === "Not Started" && dayjs(task.start).isAfter(dayjs())) {
            const updatedTask = { ...task, taskStatus: 'In Progress' };
            editTask(task.id, updatedTask);
        }
        else if (task.taskStatus === "Not Started" && dayjs(task.start).isBefore(dayjs()) && dayjs(task.end).isAfter(dayjs()))
            {
                const updatedTask = { ...task, taskStatus: 'Start Delayed' };
                editTask(task.id, updatedTask);
                console.log('Started on:',dayjs().format("YYYY-MM-DD HH:mm:ss"));
            }
            else if (dayjs(task.start).isBefore(dayjs()) && dayjs(task.end).isAfter(dayjs())) {
                const updatedTask = { ...task, taskStatus: 'In Progress' };
                editTask(task.id, updatedTask);
            }
            
            else if (dayjs().isAfter(dayjs(task.end)) && (task.taskStatus === "Not Started")) {
                // const updatedTask = { ...task, taskStatus: 'Delayed' };
                // editTask(task.id, updatedTask);
                const updatedTask = { ...task, taskStatus: 'Delayed', start: dayjs().format("YYYY-MM-DD HH:mm:ss") };
                editTask(task.id, updatedTask);
            }

         // IF THE STATUS IS ALREADY START DELAYED, CHECK THE END DATE, IF IT CROSSES THEN CHANGE THE STATUS TO DELAYED:
        else if (task.taskStatus === "Start Delayed" && dayjs(task.end).isBefore(dayjs())) {
            const updatedTask = { ...task, taskStatus: 'Delayed' };
            editTask(task.id, updatedTask);
        }
            setStarted(true);
    };
    
    const handleKeyPress = (event, id) => {
        if (event.key === 'Enter') {
            handleSave(id);
        }
    };

    // const now = new Date();
    // const formattedDate = now.getFullYear() + "-" +
    // String(now.getMonth() + 1).padStart(2, '0') + "-" +
    // String(now.getDate()).padStart(2, '0') + " " +
    // String(now.getHours()).padStart(2, '0') + ":" +
    // String(now.getMinutes()).padStart(2, '0') + ":" +
    // String(now.getSeconds()).padStart(2, '0');

    const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const customStyles = {
    content: {
        border: '2px solid #000', 
        borderRadius: '10px', 
        width: '50%', 
        height: '75%', 
        margin: 'auto', 
        
    },
    overlay: {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        backdropFilter: 'blur(0.5px)', 
    }
};
  
    return (
        <div style={{ display: "flex", flexDirection: "column", padding: "20px", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
            <div style={{
                width: "250px",
                backgroundColor: "#e0e0e0",
                padding: "20px",
                borderRight: "1px solid #ccc",
                height: "100vh",
                position: "fixed",
                top: "100px",
                left: 0,
                boxShadow: "2px 0 5px rgba(0,0,0,0.1)"
            }}>
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
            <Button variant="contained" fullWidth style={{ backgroundColor: "#1976d2", color: "white", display: "flex", alignItems: "center", justifyContent: "center", gap: "2px"}}>
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
    <li style={{ marginBottom: "10px" }}>
        <a href="/analytics" style={{ textDecoration: "none" }}>
            <Button variant="contained" fullWidth style={{ backgroundColor: "#1976d2", color: "white", display: "flex", alignItems: "center", justifyContent: "center", gap: "2px"}}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6"  style={{ width: "20px", height: "20px" }}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
</svg>

                Analytics
            </Button>
        </a>
    </li>
                </ul>
            </div>
            <div style={{ marginLeft: "270px", padding: "20px" }}>
                <Typography variant="h4" gutterBottom style={{ fontWeight: "bold", color: "#444" }}>
                    Task List
                </Typography>
                <TableContainer component={Paper} style={{ boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
                    <Table>
                        <TableHead>
                            <TableRow style={{ backgroundColor: "#f0f0f0" }}>
                                <TableCell align="center" style={{ fontWeight: "bold", color: "#555" }}>ID</TableCell>
                                <TableCell align="center" style={{ fontWeight: "bold", color: "#555" }}>Task Name</TableCell>
                                <TableCell align="center" style={{ fontWeight: "bold", color: "#555" }}>Task Status</TableCell>
                                <TableCell align="center" style={{ fontWeight: "bold", color: "#555" }}>Task Assignee</TableCell>
                                <TableCell align="center" style={{ fontWeight: "bold", color: "#555" }}>Description</TableCell>
                                <TableCell align="center" style={{ fontWeight: "bold", color: "#555" }}>Deadline</TableCell>
                                <TableCell align="center" style={{ fontWeight: "bold", color: "#555" }}>Priority</TableCell>
                                <TableCell align="center" style={{ fontWeight: "bold", color: "#555" }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tasks.map((task, index) => (
                                <TableRow key={task.id} style={{ backgroundColor: task.taskStatus === 'Completed' ? '#d4edda' : index % 2 === 1 ? '#f9f9f9' : 'white' }}>
                                    <TableCell align="center">{task.id}</TableCell>
                                    <TableCell align="center">
                                        {editId === task.id && editField === "name" ? (
                                            <TextField
                                                value={editData.name}
                                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                                onKeyPress={(e) => handleKeyPress(e, task.id)}
                                                onBlur={() => handleSave(task.id)}
                                                autoFocus
                                                fullWidth
                                            />
                                        ) : (
                                            <span onDoubleClick={() => handleEdit(task, "name")} style={{ cursor: "pointer", color: "black" }}>{task.name}</span>
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        {editId === task.id && editField === "taskStatus" ? (
                                            <Select
                                                value={editData.taskStatus}
                                                onChange={(e) => setEditData({ ...editData, taskStatus: e.target.value })}
                                                onKeyPress={(e) => handleKeyPress(e, task.id)}
                                                onBlur={() => handleSave(task.id)}
                                                autoFocus
                                                style={{
                                                    color: editData.taskStatus === "Not Started" ? 'red' :
                                                        editData.taskStatus === "In Progress" ? 'blue' :
                                                            editData.taskStatus === "Completed" ? 'green' :
                                                                editData.taskStatus === "Start Delayed" ? '#FF00FF' : '#8B0000'
                                                }}
                                            >
                                                <MenuItem value="Not Started" style={{ color: 'red' }}>Not Started</MenuItem>
                                                <MenuItem value="Start Delayed" style={{ color: '#FF00FF' }}>Start Delayed</MenuItem>
                                                <MenuItem value="In Progress" style={{ color: 'blue' }}>In Progress</MenuItem>
                                                <MenuItem value="Completed" style={{ color: 'green' }}>Completed</MenuItem>
                                                <MenuItem value="Delayed" style={{ color: '#8B0000' }}>Delayed</MenuItem>
                                            </Select>
                                        ) : (
                                            <span
                                                onDoubleClick={() => handleEdit(task, "taskStatus")}
                                                style={{
                                                    color: task.taskStatus === "Not Started" ? 'red' :
                                                        task.taskStatus === "In Progress" ? 'blue' :
                                                            task.taskStatus === "Completed" ? 'green' :
                                                                task.taskStatus === "Start Delayed" ? '#FF00FF' : '#8B0000',
                                                    cursor: "pointer"
                                                }}
                                            >
                                                {task.taskStatus === "Completed"
                                                    ? "Completed"
                                                    : task.taskStatus}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        {editId === task.id && editField === "taskAssignee" ? (
                                            <TextField
                                                value={editData.taskAssignee}
                                                onChange={(e) => setEditData({ ...editData, taskAssignee: e.target.value })}
                                                onKeyPress={(e) => handleKeyPress(e, task.id)}
                                                onBlur={() => handleSave(task.id)}
                                                autoFocus
                                                fullWidth
                                            />
                                        ) : (
                                            <span onDoubleClick={() => handleEdit(task, "taskAssignee")} style={{ cursor: "pointer", color: "black" }}>{task.taskAssignee}</span>
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        {editId === task.id && editField === "description" ? (
                                            <TextField
                                                value={editData.description}
                                                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                                onBlur={() => handleSave(task.id)}
                                                onKeyPress={(e) => handleKeyPress(e, task.id)}
                                                autoFocus
                                                fullWidth
                                            />
                                        ) : (
                                            <TextField value={task.description} onClick={() => handleEdit(task, "description")} fullWidth style={{ cursor: "pointer" }}>{task.description}</TextField>
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
                                                {editId === task.id && editField === "start" ? (
                                                    <DateTimePicker
                                                        value={editData.start ? dayjs(editData.start) : null}
                                                        format="YYYY-MM-DD HH:mm:ss"
                                                        onChange={(newValue) => {
                                                            if (newValue) {
                                                                const formattedDate = newValue.format("YYYY-MM-DD HH:mm:ss");
                                                                setEditData((prev) => ({ ...prev, start: formattedDate }));
                                                            }
                                                        }}
                                                        slotProps={{ textField: { fullWidth: true } }}
                                                        onKeyPress={(e) => handleKeyPress(e, task.id)}
                                                        onClose={() => handleSave(task.id)}
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <div onClick={() => handleEdit(task, "start")} style={{ cursor: "pointer", color: "black" }}>
                                                        {task.start ? dayjs(task.start).format("YYYY-MM-DD HH:mm:ss") : "Select Date"}
                                                    </div>
                                                )}
                                                {editId === task.id && editField === "end" ? (
                                                    <DateTimePicker
                                                        value={editData.end ? dayjs(editData.end) : null}
                                                        format="YYYY-MM-DD HH:mm:ss"
                                                        onChange={(newValue) => {
                                                            if (newValue) {
                                                                const formattedDate = newValue.format("YYYY-MM-DD HH:mm:ss");
                                                                setEditData((prev) => ({ ...prev, end: formattedDate }));
                                                            }
                                                        }}
                                                        slotProps={{ textField: { fullWidth: true } }}
                                                        onKeyPress={(e) => handleKeyPress(e, task.id)}
                                                        onClose={() => handleSave(task.id)}
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <div onClick={() => handleEdit(task, "end")} style={{ cursor: "pointer", color: "black" }}>
                                                        {task.end ? dayjs(task.end).format("YYYY-MM-DD HH:mm:ss") : "Select Date"}
                                                    </div>
                                                )}
                                            </div>
                                        </LocalizationProvider>
                                    </TableCell>
                                    <TableCell align="center">
                                        {editId === task.id && editField === "priority" ? (
                                            <Select
                                                value={editData.priority}
                                                onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                                                onKeyPress={(e) => handleKeyPress(e, task.id)}
                                                autoFocus
                                                style={{ color: editData.priority === "High" ? 'red' : editData.priority === "Medium" ? 'blue' : 'green' }}
                                            >
                                                <MenuItem value="">Select Priority</MenuItem>
                                                <MenuItem style={{ color: 'red' }} value="High">High</MenuItem>
                                                <MenuItem value="Medium" style={{ color: 'blue' }}>Medium</MenuItem>
                                                <MenuItem style={{ color: 'green' }} value="Low">Low</MenuItem>
                                            </Select>
                                        ) : (
                                            <span onDoubleClick={() => handleEdit(task, "priority")}
                                                style={{ color: task.priority === "High" ? 'red' : task.priority === "Medium" ? 'blue' : 'green', cursor: "pointer" }}>
                                                {task.priority}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell align="center" style={{ minWidth: "120px", whiteSpace: "nowrap" }}>
                                        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                                            <Button variant="contained" color="secondary"
                                                id="started"
                                                onClick={() => {
                                                    handleStarting(task);
                                                }} style={{ marginLeft: '2px', backgroundColor: '#8099FF', color: 'white' }}>
                                                Started
                                            </Button>
                                            {editId === task.id ? (
                                                <Button variant="contained" color="primary" onClick={() => handleSave(task.id)} style={{ marginRight: '8px', display: 'flex' }}>
                                                    Save
                                                </Button>
                                            ) : (
                                                <div className="pop-up">
                                                    <Modal
                                                        isOpen={modalIsOpen}
                                                        onRequestClose={closeModal}
                                                        contentLabel="Edit"
                                                        style={customStyles}
                                                    >
                                                        <EditTaskForm className='adding' taskid={task.id} />
                                                        <button id='cross' onClick={closeModal}>❌</button>
                                                    </Modal>
                                                    <Button variant="contained" color="primary"
                                                        onClick={openModal}>EDIT</Button>
                                                </div>
                                            )}
                                            <Button variant="contained" color="secondary" onClick={() => deleteTask(task.id)}>
                                                Delete
                                            </Button>
                                            <Button variant="contained" color="secondary"
                                                id="completed"
                                                onClick={() => {
                                                    const updatedTask = { ...task, taskStatus: 'Completed' };

                                                    editTask(task.id, updatedTask);
                                                }} style={{ marginLeft: '2px', backgroundColor: 'green', color: 'white' }}>
                                                Completed
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

export default TasksTable;

// <div style={{border: '1px solid black', padding : '9px', borderRadius: '5px'}}> 
// {(() => {
//     const days = 2;
//     const hours = 24;
//     const minutes = 60;
//     const seconds = 60;
//     const duration = days * hours * minutes * seconds * 1000;
//     return <CountDown duration={duration} />;
// })()}
// {/* <Button onClick={() => handleStartCountdown(task)}>Start</Button> */}
// </div>