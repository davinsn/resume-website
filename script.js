document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const nav = document.querySelector(".nav");
    const toggleButton = document.getElementById("toggle-mode");
    const themeIcon = toggleButton?.querySelector(".icon-theme use");
    const heroBackdrop = document.querySelector(".hero-backdrop");
    const yearEl = document.getElementById("year");

    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const savedMode = localStorage.getItem("mode");
    const initialMode = savedMode || "dark";
    body.classList.remove("dark", "light");
    body.classList.add(initialMode);
    updateThemeButton(initialMode);

    toggleButton?.addEventListener("click", () => {
        const next = body.classList.contains("dark") ? "light" : "dark";
        body.classList.replace(body.classList.contains("dark") ? "dark" : "light", next);
        localStorage.setItem("mode", next);
        updateThemeButton(next);
    });

    function updateThemeButton(mode) {
        if (!themeIcon) return;
        themeIcon.setAttribute("href", mode === "dark" ? "#icon-sun" : "#icon-moon");
        toggleButton.setAttribute(
            "aria-label",
            mode === "dark" ? "Switch to light appearance" : "Switch to dark appearance"
        );
    }

    const onScrollNav = () => {
        nav?.classList.toggle("scrolled", window.scrollY > 24);
    };
    window.addEventListener("scroll", onScrollNav, { passive: true });
    onScrollNav();

    const revealEls = document.querySelectorAll(".reveal, .reveal-group");

    const setDelay = (el) => {
        const delay = el.getAttribute("data-delay");
        if (delay !== null) {
            el.style.setProperty("--delay", delay);
        }
    };

    revealEls.forEach((el) => {
        if (el.classList.contains("reveal-group")) {
            el.querySelectorAll(".reveal").forEach(setDelay);
        } else {
            setDelay(el);
        }
    });

    if (prefersReducedMotion) {
        revealEls.forEach((el) => el.classList.add("is-visible"));
    } else {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
        );
        revealEls.forEach((el) => observer.observe(el));
    }

    const hero = document.querySelector(".hero");

    if (heroBackdrop && !prefersReducedMotion) {
        let ticking = false;
        const updateParallax = () => {
            const y = window.scrollY;
            const offset = Math.min(y * 0.35, 180);
            document.documentElement.style.setProperty("--parallax-y", `${offset * 0.5}px`);
            document.documentElement.style.setProperty(
                "--hero-bg-opacity",
                String(Math.max(0.35, 1 - y / 900))
            );

            document.documentElement.style.setProperty("--orb1-scroll-x", `${y * 0.06}px`);
            document.documentElement.style.setProperty("--orb1-scroll-y", `${y * 0.18}px`);
            document.documentElement.style.setProperty("--orb2-scroll-x", `${-y * 0.1}px`);
            document.documentElement.style.setProperty("--orb2-scroll-y", `${y * 0.32}px`);

            ticking = false;
        };
        window.addEventListener(
            "scroll",
            () => {
                if (!ticking) {
                    requestAnimationFrame(updateParallax);
                    ticking = true;
                }
            },
            { passive: true }
        );
        updateParallax();

        if (hero) {
            const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
            const ease = 0.075;

            hero.addEventListener(
                "mousemove",
                (event) => {
                    const rect = hero.getBoundingClientRect();
                    pointer.targetX = (event.clientX - rect.left) / rect.width - 0.5;
                    pointer.targetY = (event.clientY - rect.top) / rect.height - 0.5;
                },
                { passive: true }
            );

            hero.addEventListener("mouseleave", () => {
                pointer.targetX = 0;
                pointer.targetY = 0;
            });

            const animatePointerParallax = () => {
                pointer.x += (pointer.targetX - pointer.x) * ease;
                pointer.y += (pointer.targetY - pointer.y) * ease;

                document.documentElement.style.setProperty(
                    "--orb1-pointer-x",
                    `${pointer.x * 32}px`
                );
                document.documentElement.style.setProperty(
                    "--orb1-pointer-y",
                    `${pointer.y * 24}px`
                );
                document.documentElement.style.setProperty(
                    "--orb2-pointer-x",
                    `${-pointer.x * 40}px`
                );
                document.documentElement.style.setProperty(
                    "--orb2-pointer-y",
                    `${-pointer.y * 30}px`
                );

                requestAnimationFrame(animatePointerParallax);
            };
            animatePointerParallax();
        }
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
            const id = anchor.getAttribute("href");
            if (!id || id === "#") return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - 72;
            window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
        });
    });
});
