/* =========================
   PAGE LOADER
========================= */

window.addEventListener("load", () => {
    const loader = document.getElementById("loader");

    setTimeout(() => {
        loader.classList.add("loaded");
    }, 500);
});


/* =========================
   MOBILE NAVIGATION
========================= */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navItems = document.querySelectorAll(".nav-link");

menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    navLinks.classList.toggle("open", !isOpen);
});

navItems.forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");

        navItems.forEach((item) => {
            item.classList.remove("active");
        });

        link.classList.add("active");
    });
});


/* =========================
   SCROLL REVEAL
========================= */

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12
    }
);

revealElements.forEach((element) => {
    revealObserver.observe(element);
});


/* =========================
   ACTIVE NAV LINK
========================= */

const sections = document.querySelectorAll("main section[id]");

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            navItems.forEach((link) => {
                link.classList.toggle(
                    "active",
                    link.getAttribute("href") === "#" + entry.target.id
                );
            });
        });
    },
    {
        rootMargin: "-30% 0px -55% 0px"
    }
);

sections.forEach((section) => {
    sectionObserver.observe(section);
});


/* =========================
   3D TILT EFFECT
========================= */

const tiltCards = document.querySelectorAll("[data-tilt]");

const canHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
).matches;

if (canHover) {
    tiltCards.forEach((card) => {
        card.addEventListener("mousemove", (event) => {
            const rect = card.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;

            card.style.transform =
                `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });
}


/* =========================
   THREE.JS 3D PARTICLES
========================= */

(function initThreeJS() {
    const canvas = document.getElementById("webgl");

    if (!canvas || typeof THREE === "undefined") {
        console.warn(
            "Three.js could not load. CSS animations will remain active."
        );
        return;
    }

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
        return;
    }

    let scene;
    let camera;
    let renderer;
    let particles;
    let particleMaterial;
    let animationFrame;
    let resizeTimer;

    const pointer = {
        x: 0,
        y: 0
    };

    try {
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        camera.position.z = 35;

        renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: window.devicePixelRatio < 2
        });

        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio || 1, 1.5)
        );

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        /* Create particle positions */

        const particleCount = window.innerWidth < 600 ? 500 : 1000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const colorPurple = new THREE.Color("#a78bfa");
        const colorPink = new THREE.Color("#ed72d7");
        const colorCyan = new THREE.Color("#75e6ff");

        for (let i = 0; i < particleCount; i++) {
            const index = i * 3;

            positions[index] = (Math.random() - 0.5) * 90;
            positions[index + 1] = (Math.random() - 0.5) * 65;
            positions[index + 2] = (Math.random() - 0.5) * 45;

            const random = Math.random();

            let color;

            if (random < 0.55) {
                color = colorPurple;
            } else if (random < 0.85) {
                color = colorPink;
            } else {
                color = colorCyan;
            }

            colors[index] = color.r;
            colors[index + 1] = color.g;
            colors[index + 2] = color.b;
        }

        const geometry = new THREE.BufferGeometry();

        geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3)
        );

        geometry.setAttribute(
            "color",
            new THREE.BufferAttribute(colors, 3)
        );

        particleMaterial = new THREE.PointsMaterial({
            size: 0.095,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        particles = new THREE.Points(
            geometry,
            particleMaterial
        );

        scene.add(particles);

        /* Mouse movement */

        window.addEventListener("pointermove", (event) => {
            pointer.x = (event.clientX / window.innerWidth) * 2 - 1;

            pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        }, { passive: true });

        /* Animate */

        const clock = new THREE.Clock();

        function animate() {
            animationFrame = requestAnimationFrame(animate);

            const elapsed = clock.getElapsedTime();

            particles.rotation.y = elapsed * 0.025 + pointer.x * 0.08;
            particles.rotation.x = elapsed * 0.012 + pointer.y * 0.06;

            renderer.render(scene, camera);
        }

        animate();

        /* Resize */

        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);

            resizeTimer = setTimeout(() => {
                camera.aspect =
                    window.innerWidth / window.innerHeight;

                camera.updateProjectionMatrix();

                renderer.setSize(
                    window.innerWidth,
                    window.innerHeight
                );

                renderer.setPixelRatio(
                    Math.min(window.devicePixelRatio || 1, 1.5)
                );
            }, 150);
        });

        /* Pause animation when tab is hidden */

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                cancelAnimationFrame(animationFrame);
            } else {
                cancelAnimationFrame(animationFrame);
                animate();
            }
        });

    } catch (error) {
        console.error("3D background initialization failed:", error);

        if (renderer) {
            renderer.dispose();
        }

        canvas.style.display = "none";
    }
})();