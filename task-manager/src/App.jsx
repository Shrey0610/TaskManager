import { StrictMode, useState } from 'react';
import ReactDOM from "react-dom/client";
import { TasksProvider } from "./TasksContext";
import { EmployeeProvider } from "./EmployeeContext";
import AddTaskForm from "./AddTaskForm";
import TasksTable from "./TasksTable";
import './App.css';
// import './index.css';
import Modal from 'react-modal';
import Employees from "./Employees";
import TaskSearch from "./TaskSearch";
import Dashboard from "./Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { Button } from "@mui/material";

import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import SignInPage from "./SignInPage.jsx";

import {ThemeProviderWrapper}  from "./assets/ThemeContext"; 
import ColorModeSelect from './assets/ColorModeSelect';

import { ClerkProvider } from '@clerk/clerk-react';

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}


function App() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const customStyles = {
    content: {
      border: '2px solid #000', // Adjust the border style here
      borderRadius: '10px', // Optional: Add border radius
      width: '50%', // Optional: Adjust width
      height: '75%', // Optional: Adjust height
      margin: 'auto', // Center the modal
    },
  };

  return (
    <TasksProvider>
       <div style={{ marginTop: "20px", marginLeft: "270px", display: "flex", flexDirection: 'column', gap: "0px", alignItems: "center" }}>
      <div className="pop-up">
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal} // Function to call when the modal is requested to be closed (e.g., when clicking outside the modal or pressing the escape key).
          contentLabel="Assign Task"
          style={customStyles}
        >
          <AddTaskForm className='adding' />
          <button id='cross' onClick={closeModal}>❌</button>
        </Modal>
        <button onClick={openModal} style={{ borderColor: 'black'}}>Assign Task</button>
      </div>
      </div>
      <br />
      <TasksTable className='table' />
      {/* <CountDown /> */}
    </TasksProvider>
  );
}

export default App;

const root = ReactDOM.createRoot(document.getElementById('root'));

const AppWrapper = () => {
  // const [isEmployees, setIsEmployees] = useState(false);
  // const navigate = useNavigate();

  // const toggleUrl = () => {
  //   setIsEmployees(!isEmployees);
  //   navigate(isEmployees ? '/' : '/employees');
  // };

  // const toggleUrl2 = () => {
  //   setIsEmployees(!isEmployees);
  //   navigate(isEmployees ? '/search' : '/search');
  // };

  return (
    <StrictMode>
      <ThemeProviderWrapper>
<SignedOut>
         <header style={{ 
                  padding: "25px", 
                  backgroundColor: "rgba(167, 173, 117, 0.81)", 
                  color: "#fff", 
                  position: 'fixed',
                  zIndex: 1000,
                  width: '100%',
                  // borderBottom: "2px solid rgba(223, 239, 197, 0.61)", 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  }}>
                <h1 style={{ margin: 0, fontSize: "24px" }}>Sem 8 Project</h1>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <ColorModeSelect sx={{ position: 'relative', marginRight: '10px' }} />
                </div>

                {/* <Button 
              variant="contained" 
              style={{ backgroundColor: "#465d66", color: "#fff" }} 
            >
              About Us
            </Button> */}
                {/* Navigation buttons after signing in */}
      </header>
  <SignInPage path="/"  />
</SignedOut>

              <SignedIn>
                  <header style={{ 
                    padding: "25px", 
                    backgroundColor: "#9990bf", 
                    color: "#fff", 
                    borderBottom: "2px solid rgba(85, 140, 198, 0.81)", 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    position: 'fixed',
                    zIndex: 1000,
                    width: '100%',
                  }}>
                <h1 style={{ margin: 0, fontSize: "24px" }}>Task Manager</h1>
                {/* Navigation buttons after signing in */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <ColorModeSelect sx={{ position: 'relative', marginRight: '10px' }} />
            {/* <Button 
              variant="contained" 
              style={{ backgroundColor: "#8fa5a8", color: "#fff" }} 
              onClick={toggleUrl}
            >
              {isEmployees ? "Tasks" : "Employees"}
            </Button> */}
            {/* <Button 
              variant="contained" 
              style={{ backgroundColor: "#8fa5a8", color: "#fff" }} 
              onClick={toggleUrl2}
            >
              Search
            </Button> */}
            <UserButton />
          </div>
      </header>
        </SignedIn>

        <SignedIn style={{ minHeight: "calc(100vh - 80px)" }}>
  <Routes>
    {/* Wrap EmployeeProvider only around routes that need it */}
    <Route
  path="/employees"
  index
  element={
    <EmployeeProvider>
      <Employees />
    </EmployeeProvider>
  }
/>

<Route
  path="/search"
  element={
    <EmployeeProvider>
      <TaskSearch />
    </EmployeeProvider>
  }
/>

<Route
    path="/"
    element={

        <EmployeeProvider>
          <App />
        </EmployeeProvider>

    }
  />

<Route
  path="/dashboard"
  element={
    <TasksProvider>
      <EmployeeProvider>
        <Dashboard />
      </EmployeeProvider>
    </TasksProvider>
  }
/>


  </Routes>
</SignedIn>
        </ThemeProviderWrapper>
    </StrictMode>
  );
};


root.render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
  <BrowserRouter>
    <AppWrapper />
  </BrowserRouter>
  </ClerkProvider>
);