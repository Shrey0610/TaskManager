import { StrictMode, useState } from 'react';
import ReactDOM from "react-dom/client";
import { TasksProvider } from "./TasksContext";
import { EmployeeProvider } from "./EmployeeContext";
import AddTaskForm from "./AddTaskForm";
import TasksTable from "./TasksTable";
import './App.css';
import './index.css';
import Modal from 'react-modal';
import Employees from "./Employees";
import TaskSearch from "./TaskSearch";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";


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
        <button onClick={openModal} style={{ borderColor: 'black' }}>Assign Task</button>
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
  const [isEmployees, setIsEmployees] = useState(false);
  const navigate = useNavigate();

  const toggleUrl = () => {
    setIsEmployees(!isEmployees);
    navigate(isEmployees ? '/' : '/employees');
  };

  const toggleUrl2 = () => {
    setIsEmployees(!isEmployees);
    navigate(isEmployees ? '/search' : '/search');
  };

  return (
    <StrictMode>
      <header style={{ padding: "20px", backgroundColor: "#f9f9f9", borderBottom: "1px solid #ddd", display: 'flex', justifyContent: 'space-between' }}>
          <SignedOut>
            <SignInButton style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px" }} />
          </SignedOut>
          <Button
          variant="contained"
          color="primary"
          onClick={toggleUrl}
          >
          Switch
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={toggleUrl2}
          >
          Search
        </Button>
          <SignedIn>
            <UserButton />
          </SignedIn>
      </header>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
       

        {/* On clickling Sync, the state and data gets updated to latest. */}
      </div>
      <br />
      <br />
      {/* <TasksProvider> */}
        <EmployeeProvider>
          <Routes>
            <Route index element={<App />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/search" element={<TaskSearch />} />
          </Routes>
        </EmployeeProvider>
      {/* </TasksProvider> */}
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