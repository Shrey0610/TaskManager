import PropTypes from 'prop-types';
import {Button} from "@mui/material";
const DashboardCard = ({ title, count, icon }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      minWidth: '220px'
    }}>
      <div>
        <div style={{ color: '#6B7280', fontWeight: '600' }}>{title}</div>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{count}</div>
      </div>
      <div style={{
        backgroundColor: '#6366F1',
        borderRadius: '9999px',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {icon}
      </div>
    </div>
  );
};

DashboardCard.propTypes = {
    title: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    icon: PropTypes.node.isRequired,
};

const Dashboard = () => {
    const contentStyles = {
      marginLeft: "250px", // Adjust this to account for the sidebar width
      padding: "40px",
      backgroundColor: "#F9FAFB",
      minHeight: "100vh",
      marginTop: "100px", // Adjust this to match the height of the navbar
    };
const sidebarStyles = {
    width: "250px",
    backgroundColor: "#e0e0e0",
    padding: "20px",
    borderRight: "1px solid #ccc",
    height: `calc(${contentStyles.minHeight} + 40px)`,
    position: "fixed",
    top: "100px", // Adjust this to match the height of the navbar
    left: 0,
    boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
};


  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Sidebar */}
      <div style={
               sidebarStyles
            }>
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
                </ul>
            </div>

      {/* Main Content */}
      <div style={contentStyles}>
        <h2 style={{ fontWeight: 'bold', marginBottom: '20px' }}>DASHBOARD</h2>
        <div style={{
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <DashboardCard
            title="Employees"
            count={8}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" style={{ width: '24px', height: '24px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            }
          />
          <DashboardCard
            title="Tasks"
            count={24}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" style={{ width: '24px', height: '24px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12.75l3 3 7.5-7.5M4.5 4.5h15a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75h-15a.75.75 0 01-.75-.75V5.25a.75.75 0 01.75-.75z" />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;