
// Mobile menu
const menu = document.getElementById("menu");
const nav = document.getElementById("nav");

menu.addEventListener("click", function() {
    nav.classList.toggle("open");

    menu.textContent = nav.classList.contains("open")
        ? "✕"
        : "☰";
});

// Close menu after clicking a link
document.querySelectorAll("#nav a").forEach(function(link) {
    link.addEventListener("click", function() {
        nav.classList.remove("open");
        menu.textContent = "☰";
    });
});

// Current year
document.getElementById("year").textContent =
    new Date().getFullYear();
