import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Content from './assets/Content';
import { useState } from "react";
import { useSignIn, SignUp } from "@clerk/clerk-react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

export default function SignInPage() {
  const styles = {
    container: {
      maxWidth: "400px",
      margin: "auto",
      padding: "20px",
      textAlign: "center",
      border: "1px solid #ddd",
      borderRadius: "8px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#fff",
    },
    input: {
      width: "100%",
      padding: "10px",
      margin: "10px 0",
      borderRadius: "4px",
      border: "1px solid #ccc",
    },
    button: {
      width: "100%",
      padding: "10px",
      background: "#000",
      color: "#fff",
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
      bgcolor: "background.paper",
      boxShadow: 24,
      p: 4,
      borderRadius: "8px",
    },
  };

  const { signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [openSignUp, setOpenSignUp] = useState(false); // Sign-Up modal state

  const handleSignIn = async () => {
    try {
      const response = await signIn.create({ identifier: email, password });

      if (response.status === "complete") {
        await setActive({ session: response.createdSessionId });
        console.log("response email", response.identifier);
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
          }}
        >
          <Content />
          <div style={styles.container}>
            <h2>Sign In to TaskManager</h2>
            <p>Welcome back! Please sign in to continue</p>

            {error && <p style={styles.error}>{error}</p>}

            {pendingVerification ? (
              <>
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
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                />
                <button onClick={handleSignIn} style={styles.button}>
                  Sign In
                </button>
                <p>
                  {/* Don't have an account?{" "} */}
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
        <Box sx={styles.modalBox}>
          <SignUp path="/" routing="path" />
        </Box>
      </Modal>
    </>
  );
}
