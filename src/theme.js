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
    },
  },
});

const draculaTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#6272a4",
    },
    secondary: {
      main: "#44475a",
    },
    error: {
      main: "#ffb86c",
    },
    warning: {
      main: "#ff5555",
    },
    success: {
      main: "#50fa7b",
    },
    background: {
      default: "#282a36",
      paper: "#242630",
    },
    text: {
      primary: "#f8f8f2",
    },
    common: {
      main: "#6272a4"
    },
  },
});

const nordDark = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#5E81AC",
    },
    secondary: {
      main: "#88C0D0",
    },
    error: {
      main: "#BF616A",
    },
    warning: {
      main: "#EBCB8B",
    },
    success: {
      main: "#A3BE8C",
    },
    background: {
      default: "#2E3440",
      paper: "#3B4252",
    },
    text: {
      primary: "#ECEFF4",
    },
    common: {
      main: "#81A1C1"
    },
  },
});

const nordLight = createMuiTheme({
  palette: {
    type: "light",
    primary: {
      main: "#5E81AC",
    },
    secondary: {
      main: "#88C0D0",
    },
    error: {
      main: "#BF616A",
    },
    warning: {
      main: "#EBCB8B",
    },
    success: {
      main: "#A3BE8C",
    },
    background: {
      default: "#E5E9F0",
      paper: "#D8DEE9",
    },
    text: {
      primary: "#2E3440",
    },
    common: {
      main: "#5E81AC"
    },
  },
});

var theme;

if (localStorage.getItem("theme") === "light" || sessionStorage.getItem("theme") === "light") {
  theme = lightTheme;
} else if (localStorage.getItem("theme") === "dark" || sessionStorage.getItem("theme") === "dark") {
  theme = darkTheme;
} else if (localStorage.getItem("theme") === "dracula" || sessionStorage.getItem("theme") === "dracula") {
  theme = draculaTheme;
} else if (localStorage.getItem("theme") === "nordDark" || sessionStorage.getItem("theme") === "nordDark") {
  theme = nordDark;
} else if (localStorage.getItem("theme") === "nordLight" || sessionStorage.getItem("theme") === "nordLight") {
  theme = nordLight;
} else {
  theme = darkTheme;
  localStorage.setItem("theme", "dark")
  sessionStorage.setItem("theme", "dark")
}

export default theme;
