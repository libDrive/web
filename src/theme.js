import { createTheme  } from "@material-ui/core/styles";

const lightTheme = createTheme ({
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
    },
  },
});

const darkTheme = createTheme ({
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
      default: "#131516",
      paper: "#171819",
    },
    text: {
      primary: "#e8e6e3",
    },
    common: {
      main: "#ffffff",
    },
  },
});

const draculaTheme = createTheme ({
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
      main: "#6272a4",
    },
  },
});

const nordTheme = createTheme ({
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
      main: "#81A1C1",
    },
  },
});

const ui_config = JSON.parse(
  window.localStorage.getItem("ui_config") ||
    window.sessionStorage.getItem("ui_config") ||
    "{}"
);
let customTheme;
if (ui_config.theme) {
  customTheme = createTheme (ui_config.theme);
}

var theme;

if (
  localStorage.getItem("theme") === "light" ||
  sessionStorage.getItem("theme") === "light"
) {
  theme = lightTheme;
} else if (
  localStorage.getItem("theme") === "dark" ||
  sessionStorage.getItem("theme") === "dark"
) {
  theme = darkTheme;
} else if (
  localStorage.getItem("theme") === "dracula" ||
  sessionStorage.getItem("theme") === "dracula"
) {
  theme = draculaTheme;
} else if (
  localStorage.getItem("theme") === "nord" ||
  sessionStorage.getItem("theme") === "nord"
) {
  theme = nordTheme;
} else if (
  localStorage.getItem("theme") === "custom" ||
  sessionStorage.getItem("theme") === "custom"
) {
  theme = customTheme;
} else {
  theme = darkTheme;
  localStorage.setItem("theme", "dark");
  sessionStorage.setItem("theme", "dark");
}

export default theme;
