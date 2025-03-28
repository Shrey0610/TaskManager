import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Content from './assets/Content';
import { useState } from "react";
import { useSignIn, SignUp } from "@clerk/clerk-react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

export default function SignInPage() {
    const [darkMode, ] = useState(false); // State for dark mode
    const styles = {
        container: {
            width: "450px",
            height: "500px",
            margin: "auto",
            padding: "20px",
            textAlign: "center",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            backgroundColor: darkMode ? "#333" : "#fff",
            color: darkMode ? "#fff" : "#000",
        },
        input: {
            width: "85%",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "4px",
            border: "1px solid #ccc",
            backgroundColor: darkMode ? "#555" : "#fff",
            color: darkMode ? "#fff" : "#000",
        },
        button: {
            width: "85%",
            padding: "10px",
            background: darkMode ? "#fff" : "#000",
            color: darkMode ? "#000" : "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
        },
        error: {
            color: "red",
        },
        modalBox: {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: darkMode ? "rgba(50, 50, 50, 0.85)" : "rgba(255, 255, 255, 0.85)",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
            width: "900px",
            height: "850px",
            color: darkMode ? "#fff" : "#000",
        },
    };

    const { signIn, setActive } = useSignIn();
    const [email, setEmail] = useState("");
    // const [firstName, setFirstName] = useState("");
    // const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [openSignUp, setOpenSignUp] = useState(false);

    const handleSignIn = async () => {
        try {
            const response = await signIn.create({ identifier: email, password, });

            if (response.status === "complete") {
                await setActive({ session: response.createdSessionId });
                console.log("response email", response.identifier);
                console.log(response);
            } else if (response.firstFactorVerification) {
                setPendingVerification(true);
            }
        } catch (err) {
            setError(err.errors ? err.errors[0].message : "Sign-in failed.");
        }
    };

    const handleVerify = async () => {
        try {
            const response = await signIn.attemptFirstFactor({
                strategy: "email_code",
                code,
            });

            if (response.status === "complete") {
                await setActive({ session: response.createdSessionId });
                console.log("User verified and signed in!");
            }
        } catch (err) {
            setError(err.errors ? err.errors[0].message : "Verification failed.");
        }
    };

    return (
        <>
            <CssBaseline enableColorScheme />
            <Stack
                direction="column"
                component="main"
                sx={{
                    justifyContent: "center",
                    height: "calc((1 - var(--template-frame-height, 0)) * 100%)",
                    marginTop: "max(90px - var(--template-frame-height, 0px), 0px)",
                    minHeight: "100%",
                    mt: "150px",
                }}
            >
                <Stack
                    direction={{ xs: "column-reverse", md: "row" }}
                    sx={{
                        justifyContent: "center",
                        gap: { xs: 6, sm: 12 },
                        p: 2,
                        mx: "auto",
                        marginTop: "max(100px - var(--template-frame-height, 0px), 0px)",
                    }}
                >
                    <Content />
                    <div style={styles.container}>
                        <h2>Sign In to TaskManager</h2>
                        <p style={{ marginTop: '-20px', marginBottom: '30px', color: 'rgba(0, 0, 0, 0.6)' }}>Welcome back! Please sign in to continue</p>

                        {error && <p style={styles.error}>{error}</p>}

                        {pendingVerification ? (
                            <>
                                <div style={{ textAlign: "left", width: "100%" }}>
                                    <label>OTP Code</label>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter OTP code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    style={styles.input}
                                />
                                <button onClick={handleVerify} style={styles.button}>
                                    Verify OTP
                                </button>
                            </>
                        ) : (
                            <>
                                {/* <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginLeft: "8%", marginRight: "8%" }}>
                                    <div style={{ flex: 1, marginRight: "10px" }}>
                                        <div style={{ textAlign: "left", width: "100%" }}>
                                            <label>First Name <span style={{ fontSize: "0.8em", color: "gray" }}>(Optional)</span></label>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="First Name"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            style={styles.input}
                                        />
                                    </div>
                                    <div style={{ flex: 1, marginLeft: "10px" }}>
                                        <div style={{ textAlign: "left", width: "100%" }}>
                                            <label>Last Name <span style={{ fontSize: "0.8em", color: "gray" }}>(Optional)</span></label>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Last Name"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            style={styles.input}
                                        />
                                    </div>
                                </div> */}
                                <div style={{ textAlign: "left", width: "50%", marginLeft: "8%" }}>
                                    <label>Email Address</label>
                                </div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={styles.input}
                                />
                                <div style={{ textAlign: "left", width: "50%", marginLeft: "8%" }}>
                                    <label>Password</label>
                                </div>
                                <div style={{ position: "relative" }}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={styles.input}
                                    />
                                    <span
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: "absolute",
                                            right: "40px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            cursor: "pointer",
                                            color: darkMode ? "#007bff" : "#007bff",
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        {showPassword ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                style={{ width: "24px", height: "24px" }}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                style={{ width: "24px", height: "24px" }}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                                />
                                            </svg>
                                        )}
                                    </span>
                                </div>
                                <button onClick={handleSignIn} style={styles.button}>
                                    Sign In
                                </button>
                                <p>
                                    <span
                                        onClick={() => setOpenSignUp(true)}
                                        style={{ color: "#007bff", cursor: "pointer" }}
                                    >
                                        Sign Up
                                    </span>
                                </p>
                            </>
                        )}
                    </div>
                </Stack>
            </Stack>

            {/* Sign-Up Modal */}
            <Modal open={openSignUp} onClose={() => setOpenSignUp(false)}>
                <Box
                    sx={{
                        ...styles.modalBox,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "20px",
                        textAlign: "center",
                    }}
                >
                    <h2 style={{ marginBottom: "20px" }}>Sign Up!</h2>
                    <SignUp path="/" routing="path" style={{ width: "100%", maxWidth: "400px" }} />
                </Box>
            </Modal>
        </>
    );
}
