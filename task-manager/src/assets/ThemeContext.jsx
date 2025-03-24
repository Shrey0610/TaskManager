import { createContext, useState, useMemo, useContext } from "react";
import PropTypes from "prop-types";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const ThemeContext = createContext();

export function ThemeProviderWrapper({ children }) {
    const storedMode = localStorage.getItem("themeMode") || "light";
    const [mode, setMode] = useState(storedMode);

    const toggleTheme = () => {
        const newMode = mode === "light" ? "dark" : "light";
        setMode(newMode);
        localStorage.setItem("themeMode", newMode);
    };

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    ...(mode === "dark" && {
                        background: {
                            default: "#2E2B26", // Dark creamish color
                            paper: "#3C3A35", // Slightly lighter creamish color for paper
                        },
                    }),
                },
            }),
        [mode]
    );

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}

ThemeProviderWrapper.propTypes = {
    children: PropTypes.node.isRequired,
};

export function useThemeContext() {
    return useContext(ThemeContext);
}
