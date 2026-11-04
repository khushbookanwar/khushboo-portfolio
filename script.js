// Mobile Menu
const menu = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav-links");

menu?.addEventListener("click", () => {
    nav.classList.toggle("active");
});

// Smooth Scrolling
document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        document.querySelector(link.getAttribute("href"))
            ?.scrollIntoView({ behavior: "smooth" });

        nav.classList.remove("active");
    });
});

// Scroll Reveal
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
});

document.querySelectorAll(".reveal").forEach(el => {
    observer.observe(el);
});

// 3D Card Effect
document.querySelectorAll(".project-card, .skill-card")
.forEach(card => {
    card.addEventListener("mousemove", e => {
        const x = e.offsetX / card.offsetWidth;
        const y = e.offsetY / card.offsetHeight;

        card.style.transform =
            `perspective(500px) rotateY(${(x - .5) * 10}deg) rotateX(${(.5 - y) * 10}deg)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "rotateY(0) rotateX(0)";
    });
});

// Current Year
document.querySelector(".year").textContent =
    new Date().getFullYear();