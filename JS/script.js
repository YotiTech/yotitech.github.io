
// Mobile navigation
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("show");
        menuToggle.textContent =
            navLinks.classList.contains("show") ? "✕" : "☰";
    });
}

// Light and dark theme
const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");

        const isLight = document.body.classList.contains("light-theme");
        themeToggle.textContent = isLight ? "☾" : "☀";

        localStorage.setItem("yotitech-theme", isLight ? "light" : "dark");
    });

    // Restore the previous theme
    const savedTheme = localStorage.getItem("yotitech-theme");

    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
        themeToggle.textContent = "☾";
    }
}

// Automatically update copyright year
const year = document.getElementById("year");

if (year) {
    year.textContent = new Date().getFullYear();
}

// Close mobile menu after choosing a link
if (navLinks) {
    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("show");

            if (menuToggle) {
                menuToggle.textContent = "☰";
            }
        });
    });
}
