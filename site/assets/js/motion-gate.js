const root = document.documentElement;
const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

function shouldReduceMotion() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const saveData = Boolean(connection && connection.saveData);
  const slowNetwork = Boolean(connection && ["slow-2g", "2g"].includes(connection.effectiveType));
  return reducedQuery.matches || saveData || slowNetwork;
}

function applyMotionPreference() {
  root.setAttribute("data-motion", shouldReduceMotion() ? "reduced" : "full");
}

applyMotionPreference();

if (typeof reducedQuery.addEventListener === "function") {
  reducedQuery.addEventListener("change", applyMotionPreference);
} else if (typeof reducedQuery.addListener === "function") {
  reducedQuery.addListener(applyMotionPreference);
}
