document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("toggle-mode");
    const body = document.body;

    // Check user preference in local storage
    const currentMode = localStorage.getItem("mode") || "dark";
    body.classList.add(currentMode);

    // Update button text based on mode
    toggleButton.textContent = currentMode === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";

    toggleButton.addEventListener("click", () => {
        if (body.classList.contains("dark")) {
            body.classList.replace("dark", "light");
            toggleButton.textContent = "🌙 Dark Mode";
            localStorage.setItem("mode", "light");
        } else {
            body.classList.replace("light", "dark");
            toggleButton.textContent = "☀️ Light Mode";
            localStorage.setItem("mode", "dark");
        }
    });
});
