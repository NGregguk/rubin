const THEME_KEY = "rubin-theme";
const root = document.documentElement;
const toggle = document.querySelector("[data-theme-toggle]");

function getSavedTheme() {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === "dark" || value === "light" ? value : null;
  } catch (error) {
    return null;
  }
}

function applyTheme(theme) {
  if (theme) {
    root.setAttribute("data-theme", theme);
  } else {
    root.removeAttribute("data-theme");
  }
}

function updateToggleLabel(theme) {
  if (!toggle) {
    return;
  }

  if (!theme) {
    toggle.textContent = "Theme: Auto";
    toggle.setAttribute("aria-label", "Use dark theme");
    return;
  }

  if (theme === "dark") {
    toggle.textContent = "Theme: Dark";
    toggle.setAttribute("aria-label", "Use light theme");
    return;
  }

  toggle.textContent = "Theme: Light";
  toggle.setAttribute("aria-label", "Use system theme");
}

function cycleTheme() {
  const current = getSavedTheme();
  const next = current === null ? "dark" : current === "dark" ? "light" : null;

  try {
    if (next) {
      localStorage.setItem(THEME_KEY, next);
    } else {
      localStorage.removeItem(THEME_KEY);
    }
  } catch (error) {
    // Ignore write failures and still apply in-memory choice.
  }

  applyTheme(next);
  updateToggleLabel(next);
}

const initialTheme = getSavedTheme();
applyTheme(initialTheme);
updateToggleLabel(initialTheme);

if (toggle) {
  toggle.addEventListener("click", cycleTheme);
}
