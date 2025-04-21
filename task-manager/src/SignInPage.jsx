import { CssBaseline, Stack } from "@mui/material";
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
            minHeight: "500px", // changed from fixed height
            margin: "auto",
            padding: "20px",
            textAlign: "center",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            backgroundColor: darkMode ? "#333" : "#fff",
            color: darkMode ? "#fff" : "#000",
            overflow: "auto", // ensures content won't overflow
            boxSizing: "border-box",
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
            marginTop: "10px",
            fontSize: "0.9em",
            marginBottom: "10px",
            textAlign: "center",
            backgroundColor: darkMode ? "#444" : "#f8d7da",
            padding: "10px",
            borderRadius: "4px",
            border: `1px solid ${darkMode ? "#f8d7da" : "#721c24"}`,
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

    const GoogleGIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 533.5 520.5">
          <path fill="#4285f4" d="M533.5 278.4c0-17.4-1.6-34.1-4.7-50.4H272v95.4h147.1c-6.4 34.1-25.7 63-54.8 82.2v68.3h88.4c51.7-47.6 80.8-117.8 80.8-195.5z"/>
          <path fill="#34a853" d="M272 544.3c73.7 0 135.5-24.4 180.7-66.4l-88.4-68.3c-24.6 16.5-56.1 26.3-92.3 26.3-70.9 0-131-47.9-152.4-112.1h-90.2v70.4c45.3 89.7 138.4 150.1 242.6 150.1z"/>
          <path fill="#fbbc04" d="M119.6 323.8c-10.5-31.1-10.5-64.9 0-96l-90.2-70.4C4.5 219.6-9.3 275.1 2.2 328.3l117.4-4.5z"/>
          <path fill="#ea4335" d="M272 107.7c39.9 0 75.6 13.7 103.8 40.6l77.8-77.8C405.5 25.4 345.7 0 272 0 167.8 0 74.7 60.4 29.4 150.1l90.2 70.4C141 155.6 201.1 107.7 272 107.7z"/>
        </svg>
      );

      const AppleIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="30" fill="black" viewBox="0 0 384 512">
          <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
        </svg>
      );

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

                        <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "20px" }}>
              <button style={styles.iconBtn} aria-label="Sign in with Google">
                <GoogleGIcon />
              </button>
              <button style={styles.iconBtn} aria-label="Sign in with GitHub">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
                  alt="GitHub"
                  style={{ height: "24px", width: "24px" }}
                />
              </button>
              <button style={styles.iconBtn} aria-label="Sign in with Apple">
                <AppleIcon />
              </button>
            </div>


            {error && (
    <div style={styles.error}>
        {error}
    </div>
)}


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
                                <div style={{ position: "relative" , marginBottom: '10px'}}>
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
