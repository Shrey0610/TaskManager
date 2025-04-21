import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useThemeContext } from "./ThemeContext"; // Import our custom theme context

export default function ColorModeSelect(props) {
  const { mode, toggleTheme } = useThemeContext(); // Get mode and toggle function

  return (
    <Select
      value={mode}
      onChange={toggleTheme}
      {...props}
      style={{borderBlockColor: "white"}}
    >
      <MenuItem value="light">Light</MenuItem>
      <MenuItem value="dark">Dark</MenuItem>
    </Select>
  );
}
