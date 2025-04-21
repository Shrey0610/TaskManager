import { useForm, Controller } from "react-hook-form";
import { useContext, useEffect, useState } from "react";
import { EmployeeContext } from "./EmployeeContext";
import { TextField, Button, Typography, Container } from "@mui/material";
import Modal from 'react-modal';
import './App.css';


import dayjs from 'dayjs';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


const EditEmployeeForm = () => {
    const { assignees, editAssignee } = useContext(EmployeeContext);
    const [editId, setEditId] = useState(null);
    const [editField, setEditField] = useState(null);
    const [editData, setEditData] = useState({ name: "",  email: "",
                phoneNum: "",
                dob: "",});
    
    const { control,register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            name: "",
            email: "",
            phoneNum: "",
            dob: "",
        }
    });

    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const handleEdit = (employee, field) => {
        setEditId(employee.id);
        setEditField(field);
        setEditData({ name: employee.name,  email: employee.email,
                    phoneNum: employee.phoneNum,
                    dob: employee.dob, });
    };
    
    const handleSave = (id) => {
        editAssignee(id, editData);
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
            <Typography variant="h4" component="h3" gutterBottom style={{ textAlign: 'center', borderColor: 'black', padding: '20px' , backgroundColor: "#f9f5f9" }}>
                Edit Employee Details
            </Typography>
            <>
            {editId ? (
    (() => {
        const employee = assignees.find(emp => emp.id === editId);
        return (
            <form key={employee.id} onSubmit={handleSubmit(onSubmit)}>
                <Typography variant="h6" style={{color: 'red'}}>{employee.name}</Typography>
                <div>
                    <TextField
                        label="Employee Name *"
                        {...register("name", { required: "Employee name is required" })}
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        fullWidth
                        margin="normal"
                        error={!!errors.name}
                        helperText={errors.name ? errors.name.message : ""}
                    />
                </div>

                <div>
                    <TextField
                        label="Email *"
                        {...register("email", { required: "Email is required" })}
                        fullWidth
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        margin="normal"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        style={{ marginBottom: "11px" }}
                    />
                </div>

                <div style={{ marginBottom: "7px" }}>
                    <TextField
                        label="Phone Number *"
                        {...register("phoneNum", { required: "Phone Number is required" })}
                        value={editData.phoneNum}
                        onChange={(e) => setEditData({ ...editData, phoneNum: e.target.value })}
                        fullWidth
                        margin="normal"
                        error={!!errors.phoneNum}
                        helperText={errors.phoneNum ? errors.phoneNum.message : ""}
                    />
                </div>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div style={{ marginBottom: "11px" }}>
                        <Controller
                            name="dob"
                            control={control}
                            render={() => (
                                <DatePicker
                                    label="DOB"
                                    value={dayjs(editData.dob)}
                                    format="YYYY-MM-DD"
                                    onChange={(newValue) =>
                                        setEditData({ ...editData, dob: newValue.format("YYYY-MM-DD") })
                                    }
                                    slotProps={{ textField: { fullWidth: true } }}
                                />
                            )}
                        />
                    </div>
                </LocalizationProvider>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    style={{ marginRight: '8px' }}
                    onClick={() => handleSave(employee.id)}
                >
                    Save
                </Button>
                <Button type="button" variant="outlined" onClick={() => reset()}>
                    Clear
                </Button>
            </form>
        );
    })()
) : (
    assignees.map((employee) => (
        <div
            key={employee.id}
            onClick={() => handleEdit(employee, "name")}
            style={{ cursor: "pointer", padding: "10px", borderBottom: "1px solid #ccc" }}
        >
            <Typography variant="h6">{employee.name}</Typography>
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
               <h2>Edited Employee Detail Succesfully!</h2>
           </Modal>
        </Container>
    );
};

export default EditEmployeeForm;
