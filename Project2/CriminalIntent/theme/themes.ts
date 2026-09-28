export type Theme = {
  key: string;
  name: string;
  isDark: boolean;
  background: string;   // screen background
  card: string;         // list item / input background
  text: string;         // primary text
  subtext: string;      // secondary text (dates)
  border: string;       // dividers, input outlines
  primary: string;      // header bg + buttons
  onPrimary: string;    // text/icons on primary
};

export const themes: Record<string, Theme> = {
  white: {
    key: "white",
    name: "White",
    isDark: false,
    background: "#FFFFFF",
    card: "#F5F5F5",
    text: "#111111",
    subtext: "#666666",
    border: "#DDDDDD",
    primary: "#512DA8",
    onPrimary: "#FFFFFF",
  },
  blue: {
    key: "blue",
    name: "Blue",
    isDark: false,
    background: "#EAF3FF",
    card: "#FFFFFF",
    text: "#0B2545",
    subtext: "#4A6FA5",
    border: "#BBD3F2",
    primary: "#1565C0",
    onPrimary: "#FFFFFF",
  },
  green: {
    key: "green",
    name: "Green",
    isDark: false,
    background: "#EAF7EC",
    card: "#FFFFFF",
    text: "#0B3D1E",
    subtext: "#3F7A52",
    border: "#BFE3C8",
    primary: "#2E7D32",
    onPrimary: "#FFFFFF",
  },
  black: {
    key: "black",
    name: "Black",
    isDark: true,
    background: "#000000",
    card: "#111111",
    text: "#FFFFFF",
    subtext: "#AAAAAA",
    border: "#2A2A2A",
    primary: "#000000",
    onPrimary: "#FFFFFF",
  },
  purple: {
    key: "purple",
    name: "Purple",
    isDark: true,
    background: "#1A0B2E",
    card: "#2A1442",
    text: "#FFFFFF",
    subtext: "#C9B8E8",
    border: "#3D2360",
    primary: "#6A1B9A",
    onPrimary: "#FFFFFF",
  },
  red: {
    key: "red",
    name: "Red",
    isDark: true,
    background: "#1A0A0A",
    card: "#2B1010",
    text: "#FFFFFF",
    subtext: "#E0A0A0",
    border: "#4A1E1E",
    primary: "#B71C1C",
    onPrimary: "#FFFFFF",
  },
};

export const DEFAULT_THEME_KEY = "purple";
