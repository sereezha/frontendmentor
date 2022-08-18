const THEMES = {
  dark: "dark",
  light: "light",
};

const THEME_STORAGE_KEY = "theme";

const getThemePreference = () => {
  const theme = localStorage.getItem(THEME_STORAGE_KEY);
  if (theme) return theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? THEMES.dark
    : THEMES.light;
};

const themeToggle = document.querySelector("#theme-toggle");
const rootElement = document.documentElement;

const setTheme = (theme) => {
  themeToggle.setAttribute("aria-label", theme);
  rootElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);
};

themeToggle.addEventListener("click", () => {
  const currentTheme = rootElement.getAttribute("data-theme");
  const newTheme = currentTheme === THEMES.dark ? THEMES.light : THEMES.dark;
  setTheme(newTheme);
});

const onLoad = () => {
  const themePreference = getThemePreference();

  setTheme(themePreference);
};

onLoad();
