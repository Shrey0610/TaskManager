import { useState, createContext } from "react";
import PropTypes from "prop-types";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userEmail, setUserEmail] = useState(null); // Store the signed-in user's email
    const ADMIN_EMAILS = ["shrey9435@gmail.com", "aakash@example.com"]; // Define the admin emails

    const isAdmin = ADMIN_EMAILS.includes(userEmail); // Check if the signed-in user is an admin

    return (
        <UserContext.Provider value={{ userEmail, setUserEmail, isAdmin }}>
            {children}
        </UserContext.Provider>
    );
};

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};