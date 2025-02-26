import { useForm, Controller } from "react-hook-form";
import { useContext, useState, useEffect } from "react";
import { EmployeeContext } from "./EmployeeContext";
import { TextField, Button, Typography, Container } from "@mui/material";
import Modal from "react-modal";
import "./App.css";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const AddEmployeeForm = () => {
    const { addAssignee } = useContext(EmployeeContext);
    const { control, register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
        defaultValues: {
            name: "",
            email: "",
            phoneNum: "",
            dob: dayjs().format("YYYY-MM-DD"),
        }
    });

    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const onSubmit = (data) => {
        addAssignee(data);
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
            <Typography variant="h4" component="h3" gutterBottom textAlign="center" style={{ borderColor: "black", padding: "10px", backgroundColor: "#f9f5f9" }}>
                Add Employee
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
                <TextField
                    label="Employee Name *"
                    {...register("name", { required: "Task name is required" })}
                    placeholder="Enter Name"
                    fullWidth
                    margin="normal"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                />
                <TextField
                    label="Email *"
                    {...register("email", { required: "Email is required" })}
                    placeholder="Enter Email"
                    fullWidth
                    margin="normal"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />
                <TextField
                    label="Phone Number *"
                    {...register("phoneNum", { required: "Number is required" })}
                    placeholder="Enter Phone Number"
                    fullWidth
                    margin="normal"
                    error={!!errors.phoneNum}
                    helperText={errors.phoneNum?.message}
                />

                {/* Date-Time Pickers */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Controller
                        name="dob"
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                label="DOB"
                                value={field.value ? dayjs(field.value) : null}
                                format="YYYY-MM-DD"
                                onChange={(newValue) => {
                                    if (newValue) {
                                        const formattedDate = newValue.format("YYYY-MM-DD");
                                        setValue("dob", formattedDate);
                                    }
                                }}
                                slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
                            />
                        )}
                    />
                </LocalizationProvider>

                <Button type="submit" variant="contained" color="primary" style={{ marginRight: "8px" }}>
                    Save
                </Button>
                <Button type="button" variant="contained" color="secondary" style={{ marginRight: '5px' }} onClick={() => { handleSubmit(onSubmit); reset(); }}>
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

export default AddEmployeeForm;
