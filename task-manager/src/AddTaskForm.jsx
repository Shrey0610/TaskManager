import { useForm, Controller } from "react-hook-form";
import { useContext, useState, useEffect } from "react";
import { TasksContext } from "./TasksContext";
import { EmployeeContext } from "./EmployeeContext";
import { TextField, Button, MenuItem, Typography, Container } from "@mui/material";
import Modal from "react-modal";
import "./App.css";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const AddTaskForm = () => {
    const { addTask } = useContext(TasksContext);
    const { assignees } = useContext(EmployeeContext); 
    const { control, register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
        defaultValues: {
            name: "",
            taskStatus: "",
            taskAssignee: "",
            description: "",
            priority: "",
            start: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            end: dayjs().add(1, "day").format("YYYY-MM-DD HH:mm:ss"),
        }
    });

    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const onSubmit = (data) => {
        addTask(data);
        reset();
        setIsAlertOpen(true);
    };

    useEffect(() => {
        if (isAlertOpen) {
            const timer = setTimeout(() => {
                setIsAlertOpen(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [isAlertOpen]);

    return (
        <Container maxWidth="sm" className="form-container" style={{ marginTop: "40px" }} margin="normal">
            <Typography variant="h4" component="h3" gutterBottom textAlign="center" style={{ borderColor: "black", padding: "7px", backgroundColor: "#f9f5f9" }}>
                Assign Task
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
                <TextField
                    label="Task Name *"
                    {...register("name", { required: "Task name is required" })}
                    placeholder="Enter Task Name"
                    fullWidth
                    margin="normal"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                />
                <TextField
                    select
                    label="Status *"
                    {...register("taskStatus", { required: "taskStatus is required" })}
                    fullWidth
                    margin="normal"
                    error={!!errors.taskStatus}
                    helperText={errors.taskStatus?.message}
                    style={{ marginBottom: "11px" }}
                >
                    <MenuItem value="">Select Task Status</MenuItem>
                    <MenuItem value="Not Started" style={{ color: "red" }}>Not Started</MenuItem>
                    <MenuItem value="In Progress" style={{ color: "blue" }}>In Progress</MenuItem>
                    <MenuItem value="Completed" style={{ color: "green" }}>Completed</MenuItem>
                    <MenuItem value="Delayed" style={{ color: "#8B0000" }}>Delayed</MenuItem>
                </TextField>
                <TextField
                    select
                    label="Task Assignee *"
                    {...register("taskAssignee", { required: "Task assignee is required" })}
                    placeholder="Enter Task Assignee"
                    fullWidth
                    margin="normal"
                    error={!!errors.taskAssignee}
                    helperText={errors.taskAssignee?.message}
                >
                    {assignees.map((employee) => (
                <MenuItem key={employee.id} value={employee.name}>
                    {employee.name}
                </MenuItem>
            ))}

                    </TextField>
                <TextField
                    label="Task Description *"
                    {...register("description", { required: "Task description is required" })}
                    placeholder="Enter Task Description"
                    fullWidth
                    margin="normal"
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    style={{marginBottom: "20px" }}
                />

                {/* Date-Time Pickers */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
  <div style={{ display: "flex", flexDirection: "row", gap: "10px", marginBottom: "5px" }}>
    <Controller
      name="start"
      control={control}
      render={({ field }) => (
        <DateTimePicker
          label="Start Time"
          value={field.value ? dayjs(field.value) : null}
          format="YYYY-MM-DD HH:mm:ss"
          onChange={(newValue) => {
            if (newValue) {
              const formattedDate = newValue.format("YYYY-MM-DD HH:mm:ss");
              setValue("start", formattedDate);
            }
          }}
          slotProps={{ textField: { fullWidth: true } }}
        />
      )}
    />

    <Controller
      name="end"
      control={control}
      render={({ field }) => (
        <DateTimePicker
          label="End Time"
          value={field.value ? dayjs(field.value) : null}
          format="YYYY-MM-DD HH:mm:ss"
          onChange={(newValue) => {
            if (newValue) {
              const formattedDate = newValue.format("YYYY-MM-DD HH:mm:ss");
              setValue("end", formattedDate);
            }
          }}
          slotProps={{ textField: { fullWidth: true } }}
        />
      )}
    />
  </div>
</LocalizationProvider>


                <TextField
                    select
                    label="Priority *"
                    {...register("priority", { required: "Priority is required" })}
                    fullWidth
                    margin="normal"
                    error={!!errors.priority}
                    helperText={errors.priority?.message}
                    style={{ marginBottom: "11px" }}
                >
                    <MenuItem>Select Priority</MenuItem>
                    <MenuItem value="High" style={{ color: "red" }}>High</MenuItem>
                    <MenuItem value="Medium" style={{ color: "blue" }}>Medium</MenuItem>
                    <MenuItem value="Low" style={{ color: "green" }}>Low</MenuItem>
                </TextField>

                <Button type="submit" variant="contained" color="primary" style={{ marginRight: "8px" }}>
                    Save
                </Button>
                <Button type="button" variant="contained" color="secondary" style={{marginRight: '5px'}} onClick={() => { handleSubmit(onSubmit); reset(); }}>
                    Save & Add New
                </Button>
                <Button type="button" variant="outlined" onClick={() => reset()}>
                    Clear
                </Button>
            </form>

            <Modal
                isOpen={isAlertOpen}
                onRequestClose={() => setIsAlertOpen(false)}
                contentLabel="Task Assigned Alert"
                style={{
                    content: {
                        top: "10px",
                        right: "10px",
                        bottom: "auto",
                        left: "auto",
                        transform: "none",
                        width: "300px",
                        height: "50px",
                        padding: "20px",
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                    }
                }}
            >
                <h2>The Task is Assigned!</h2>
            </Modal>
        </Container>
    );
};

export default AddTaskForm;
