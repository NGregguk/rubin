const toggleButton = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("#site-nav");

if (toggleButton && nav) {
  toggleButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggleButton.setAttribute("aria-expanded", String(isOpen));
  });

  const closeIfDesktop = () => {
    if (window.innerWidth > 768) {
      nav.classList.remove("is-open");
      toggleButton.setAttribute("aria-expanded", "false");
    }
  };

  window.addEventListener("resize", closeIfDesktop, { passive: true });
}
