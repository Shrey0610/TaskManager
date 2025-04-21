import { useForm, Controller } from "react-hook-form";
import { useContext, useEffect, useState } from "react";
import { TasksContext } from "./TasksContext";
import { EmployeeContext } from "./EmployeeContext";
import { TextField, Button, MenuItem, Typography, Container } from "@mui/material";
import Modal from 'react-modal';
import './App.css';


import dayjs from 'dayjs';
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


const EditTaskForm = () => {
    const { tasks, editTask } = useContext(TasksContext);
    const { assignees } = useContext(EmployeeContext);
    const [editId, setEditId] = useState(null);
    const [editField, setEditField] = useState(null);
    const [editData, setEditData] = useState({ name: "", taskStatus: "", taskAssignee: "", priority: "", description: "", start: "", end:""});
    
    const { control,register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            name: "",
            taskStatus: "",
            taskAssignee: "",
            description: "",
            priority: "",
            start: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            end: dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
        }
    });

    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const handleEdit = (task, field) => {
        setEditId(task.id);
        setEditField(field);
        setEditData({ name: task.name, taskStatus: task.taskStatus, taskAssignee: task.taskAssignee, priority: task.priority, description: task.description, start: task.start, end: task.end });
    };
    
    const handleSave = (id) => {
        editTask(id, editData);
        setEditId(null);
        setEditField(null);
        setIsAlertOpen(true);
    };
    const onSubmit = (data) => {
        editData(data);
        reset(); // Reset form after submission
    };
    
    useEffect(() => {
        if (isAlertOpen) {
            const timer = setTimeout(() => {
                setIsAlertOpen(false);
            }, 2000); // Show alert for 4 seconds

            return () => clearTimeout(timer);
        }
    }, [isAlertOpen]);



    return (
        <Container maxWidth="sm" className="form-container" style={{ marginTop: "40px" }} margin="normal">
            <Typography variant="h4" component="h3" gutterBottom style={{ textAlign: 'center', borderColor: 'black', padding: '20px', backgroundColor: "#f9f5f9" }}>
                Edit Task
            </Typography>
            <>
            {editId ? (
    // Find the selected task
    (() => {
        const task = tasks.find(emp => emp.id === editId);
        return (
            <form key={task.id} onSubmit={handleSubmit(onSubmit)}>
             <Typography variant="h6">{task.name}</Typography>
            <div>
                <TextField
                    label="Task Name *"
                    {...register("name", { required: "Task name is required" })}
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    fullWidth
                    margin="normal"
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ""}
                    // onBlur={() => handleSave(task.id)}
                />
            </div>

            <div>
            <TextField
                    select
                    label="Status *"
                    {...register("taskStatus", { required: "taskStatus is required" })}
                    fullWidth
                    value={editData.taskStatus}
                    margin="normal"
                    error={!!errors.taskStatus}
                    helperText={errors.taskStatus?.message}
                    onChange={(e) => setEditData({ ...editData, taskStatus: e.target.value })}
                    style={{ marginBottom: "11px" }}
                >
                    <MenuItem value="" disabled>Select Task Status</MenuItem>
                    <MenuItem value="Not Started" style={{ color: "red" }}>Not Started</MenuItem>
                    <MenuItem value="Start Delayed" style={{ color: "#FF00FF" }}>Start Delayed</MenuItem>
                    <MenuItem value="In Progress" style={{ color: "blue" }}>In Progress</MenuItem>
                    <MenuItem value="Completed" style={{ color: "green" }}>Completed</MenuItem>
                    <MenuItem value="Delayed" style={{ color: "#8B0000" }}>Delayed</MenuItem>
                </TextField>
            </div>

            <div>
            <TextField
                    select
                    label="Task Assignee *"
                    {...register("taskAssignee", { required: "Task assignee is required" })}
                    placeholder="Enter Task Assignee"
                    fullWidth
                    value={editData.taskAssignee}
                    margin="normal"
                    error={!!errors.taskAssignee}
                    onChange={(e) => setEditData({ ...editData, taskAssignee: e.target.value })}
                    helperText={errors.taskAssignee?.message}
                >
                    {assignees.map((task) => (
                <MenuItem key={task.id} value={task.name}>
                    {task.name}
                </MenuItem>
            ))}

                    </TextField>
            </div>

            <div>
                <TextField
                    label="Task Description *"
                    {...register("description", { required: "Task description is required" })}
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    fullWidth
                    margin="normal"
                    error={!!errors.description}
                    helperText={errors.description?.message}
                />
            </div>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div style={{ display: "flex", flexDirection: "row", gap: "10px", marginBottom: "5px" }}>
                    <Controller
                        name="start"
                        control={control}
                        render={() => (
                            <DateTimePicker
                                label="Start Time"
                                value={dayjs(editData.start)}
                                 format="YYYY-MM-DD HH:mm:ss"
                                onChange={(newValue) =>
                                    setEditData({ ...editData, start: newValue.format("YYYY-MM-DD HH:mm:ss") })
                                }
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        )}
                    />

                    <Controller
                        name="end"
                        control={control}
                        render={() => (
                            <DateTimePicker
                                label="End Time"
                                value={dayjs(editData.end)}
                                 format="YYYY-MM-DD HH:mm:ss"
                                onChange={(newValue) =>
                                    setEditData({ ...editData, end: newValue.format("YYYY-MM-DD HH:mm:ss") })
                                }
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        )}
                    />
                </div>
            </LocalizationProvider>

            <div>
                <TextField
                    select
                    label="Priority *"
                    {...register("priority", { required: "Priority is required" })}
                    value={editData.priority}
                    onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                    fullWidth
                    margin="normal"
                    error={!!errors.priority}
                    helperText={errors.priority?.message}
                >
                    <MenuItem value="" disabled>Select Priority</MenuItem>
                    <MenuItem value="High" style={{ color: 'red' }}>High</MenuItem>
                    <MenuItem value="Medium" style={{ color: 'blue' }}>Medium</MenuItem>
                    <MenuItem value="Low" style={{ color: 'green' }}>Low</MenuItem>
                </TextField>
            </div>

            <Button type="submit" variant="contained" color="primary" style={{ marginRight: '8px' }} onClick={() => handleSave(task.id)}>
                Save
            </Button>
            <Button type="button" variant="outlined" onClick={() => reset()}>
                Clear
            </Button>
            </form>
        );
    })()
) : (
    // Show employee list when no one is being edited
    tasks.map((task) => (
        <div
            key={task.id}
            onClick={() => handleEdit(task, "name")}
            style={{ cursor: "pointer", padding: "10px", borderBottom: "1px solid #ccc" }}
        >
            <Typography variant="h6">{task.name}</Typography>
            <Typography variant="body2">{task.description}</Typography>
        </div>
    ))
)}

            </>
            <Modal
               isOpen={isAlertOpen}
               onRequestClose={() => setIsAlertOpen(false)}
               contentLabel="Task Assigned Alert"
               style={{
                   overlay: {
                       backgroundColor: 'rgba(0, 0, 0, 0.5)',
                       zIndex: 1000
                   },
                   content: {
                       top: '50%',
                       left: '50%',
                       right: 'auto',
                       bottom: 'auto',
                       marginRight: '-50%',
                       transform: 'translate(-50%, -50%)',
                       width: '300px',
                       padding: '20px',
                       border: '1px solid #ccc',
                       borderRadius: '10px',
                       textAlign: 'center',
                       boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                   }
               }}
           >
               <h2>The Task has been Edited!</h2>
           </Modal>
        </Container>
    );
};

export default EditTaskForm;
