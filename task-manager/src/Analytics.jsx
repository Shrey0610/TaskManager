import { useContext } from "react";
import { EmployeeContext } from "./EmployeeContext";
import { TasksContext } from "./TasksContext";
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { Paper, Typography, Grid, Button } from "@mui/material";

const Analytics = () => {
    const { assignees } = useContext(EmployeeContext);
    const { tasks } = useContext(TasksContext);

    const getTaskStats = (employeeName) => {
        const assignedTasks = tasks.filter(task => task.taskAssignee === employeeName);
        const completed = assignedTasks.filter(task => task.taskStatus === "Completed").length;
        const inProgress = assignedTasks.filter(task => task.taskStatus === "In Progress").length;
        const notStarted = assignedTasks.filter(task => task.taskStatus === "Not Started").length;
        const delayed = assignedTasks.filter(task => task.taskStatus === "Delayed").length;
        const startDelayed = assignedTasks.filter(task => task.taskStatus === "Start Delayed").length;

        return {
            total: assignedTasks.length,
            completed,
            inProgress,
            notStarted,
            delayed,
            startDelayed,
        };
    };

    // New function to get task counts by priority for each employee
    const getTaskPriorityStats = (employeeName) => {
        const assignedTasks = tasks.filter(task => task.taskAssignee === employeeName);
        const highPriority = assignedTasks.filter(task => task.priority === "High").length;
        const mediumPriority = assignedTasks.filter(task => task.priority === "Medium").length;
        const lowPriority = assignedTasks.filter(task => task.priority === "Low").length;

        return {
            high: highPriority,
            medium: mediumPriority,
            low: lowPriority
        };
    };

    const taskStats = assignees.map(employee => ({
        name: employee.name,
        ...getTaskStats(employee.name),
    }));

    // Generate task priority stats for all employees
    const taskPriorityStats = assignees.map(employee => ({
        name: employee.name,
        ...getTaskPriorityStats(employee.name),
    }));

    const employeeNames = taskStats.map(e => e.name);

    const sidebarStyles = {
        width: "250px",
        backgroundColor: "#e0e0e0",
        padding: "20px",
        borderRight: "1px solid #ccc",
        height: "100vh",
        position: "fixed",
        top: "100px", // Adjust this to match the height of the navbar
        left: 0,
        boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
    };

    const contentStyles = {
        marginLeft: "250px", // Adjust this to account for the sidebar width
        padding: "40px",
        backgroundColor: "#F9FAFB",
        minHeight: "100vh",
        marginTop: "100px",
        width: "calc(100% - 250px)", // Adjust this to account for the sidebar width
    };

    const getStatusCounts = () => {
        const statusMap = {
            "Not Started": 0,
            "In Progress": 0,
            "Completed": 0,
            "Delayed": 0,
            "Start Delayed": 0,
        };

        tasks.forEach(task => {
            if (statusMap[task.taskStatus] !== undefined) {
                statusMap[task.taskStatus]++;
            }
        });

        return statusMap;
    };

    const statusCounts = getStatusCounts();

    const pieData = Object.entries(statusCounts).map(([label, value], index) => ({
        id: index,
        value,
        label,
    }));

    return (
        <div style={{ display: "flex", flexDirection: "row" }}>
            {/* Sidebar */}
            <div style={sidebarStyles}>
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

            {/* Main Content */}
            <div style={contentStyles}>
                <Typography variant="h4" gutterBottom style={{margin: "20px", fontWeight: "bold", color: "#444"}}>
                    Analytics Dashboard
                </Typography>

                <Grid container spacing={4}>
                    {/* Total Tasks */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} style={{ padding: "1rem" }}>
                            <Typography variant="h6">Task Priority Distribution by Employee</Typography>
                            <BarChart
                                xAxis={[{ scaleType: 'band', data: employeeNames }]}
                                series={[
                                    {
                                        data: taskPriorityStats.map(e => e.high),
                                        label: 'High Priority',
                                        color: '#d32f2f', // Red for high priority
                                        stack: 'priority',
                                    },
                                    {
                                        data: taskPriorityStats.map(e => e.medium),
                                        label: 'Medium Priority',
                                        color: '#ff9800', // Orange for medium priority
                                        stack: 'priority',
                                    },
                                    {
                                        data: taskPriorityStats.map(e => e.low),
                                        label: 'Low Priority',
                                        color: '#4caf50', // Green for low priority
                                        stack: 'priority',
                                    },
                                ]}
                                width={600} // Increased width
                                height={400}
                                legend={{ 
                                    position: 'bottom',
                                    direction: 'row'
                                }}
                            />
                        </Paper>
                    </Grid>

                    {/* Pie Chart for Task Status */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} style={{ padding: "1rem" }}>
                            <Typography variant="h6">Task Status Overview</Typography>
                            <PieChart
                                series={[{
                                    data: pieData,
                                    innerRadius: 30,
                                    outerRadius: 120, // Increased outer radius
                                    paddingAngle: 5,
                                    cornerRadius: 5,
                                }]}
                                height={400}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default Analytics;