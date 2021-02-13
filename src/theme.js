import { createMuiTheme } from "@material-ui/core/styles";


const lightTheme = createMuiTheme({
  palette: {
    type: "light",
    primary: {
      main: "#4197fe",
    },
    secondary: {
      main: "#68a0e5",
    },
    error: {
      main: "#d32f2f",
    },
    warning: {
      main: "#ff9800",
    },
    success: {
      main: "#4caf50",
    },
    background: {
      default: "#fafafa",
      paper: "#e8e8e8",
    },
    text: {
      primary: "#0f0f0f",
    },
    common: {
      main: "#000000",
    }
  },
});

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#4197fe",
    },
    secondary: {
      main: "#68a0e5",
    },
    error: {
      main: "#d32f2f",
    },
    warning: {
      main: "#ff9800",
    },
    success: {
      main: "#4caf50",
    },
    background: {
      default: "#111111",
      paper: "#1f1f1f",
    },
    common: {
      main: "#ffffff"
    }
  },
});

var theme;

if (localStorage.getItem("theme") === "light") {
  theme = lightTheme;
} else {
  theme = darkTheme;
}

export default theme;
