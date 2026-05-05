(function () {
    const doc = document;
    const root = doc.documentElement;

    function byId(id) {
        return doc.getElementById(id);
    }

    function qsa(selector, scope) {
        return Array.from((scope || doc).querySelectorAll(selector));
    }

    function closeMenu() {
        const menu = byId("mobile-menu");
        const button = byId("mobile-menu-button");
        const icon = button ? button.querySelector(".menu-icon") : null;
        if (!menu || !button) return;
        menu.classList.remove("menu-open");
        button.setAttribute("aria-expanded", "false");
        if (icon) icon.textContent = "menu";
    }

    function initMobileMenu() {
        const menu = byId("mobile-menu");
        const button = byId("mobile-menu-button");
        const icon = button ? button.querySelector(".menu-icon") : null;
        if (!menu || !button) return;

        button.addEventListener("click", function () {
            const isOpen = menu.classList.toggle("menu-open");
            button.setAttribute("aria-expanded", String(isOpen));
            if (icon) icon.textContent = isOpen ? "close" : "menu";
        });
    }

    function initSmoothScrollAndActiveLinks() {
        const navLinks = qsa('.nav-link[href^="#"]');
        const sections = qsa("main section[id]");

        navLinks.forEach(function (anchor) {
            anchor.addEventListener("click", function (event) {
                const targetId = anchor.getAttribute("href");
                const target = targetId ? doc.querySelector(targetId) : null;
                if (!target) return;
                event.preventDefault();
                closeMenu();
                const topOffset = target.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top: topOffset, behavior: "smooth" });
            });
        });

        function setActive(sectionId) {
            navLinks.forEach(function (link) {
                const isActive = link.getAttribute("href") === "#" + sectionId;
                link.classList.toggle("active", isActive);
            });
        }

        function onScroll() {
            const scrollPos = window.scrollY + 130;
            let currentId = sections.length ? sections[0].id : "";
            sections.forEach(function (section) {
                if (scrollPos >= section.offsetTop) {
                    currentId = section.id;
                }
            });
            if (currentId) setActive(currentId);
        }

        window.addEventListener("scroll", onScroll);
        onScroll();
    }

    function initFadeInAnimations() {
        const fadeItems = qsa(".fade-in");
        if (!fadeItems.length) return;

        const observer = new IntersectionObserver(
            function (entries, ob) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                    entry.target.style.transition = "opacity 560ms cubic-bezier(0.2,0,0,1), transform 560ms cubic-bezier(0.2,0,0,1)";
                    ob.unobserve(entry.target);
                });
            },
            { threshold: 0.15 }
        );

        fadeItems.forEach(function (item) {
            observer.observe(item);
        });
    }

    function initSkeletonLoaders() {
        const images = qsa("img[data-skeleton]");
        images.forEach(function (img) {
            const skeleton = img.previousElementSibling;

            function hideSkeleton() {
                img.classList.add("skeleton-loaded");
                if (skeleton && skeleton.classList.contains("skeleton")) {
                    skeleton.style.display = "none";
                }
            }

            if (img.complete && img.naturalWidth > 0) {
                hideSkeleton();
            } else {
                img.addEventListener("load", hideSkeleton, { once: true });
                img.addEventListener("error", hideSkeleton, { once: true });
            }
        });
    }

    function initEventModal() {
        const modal = byId("event-modal");
        const modalContent = byId("modal-content");
        const closeButton = byId("close-modal-btn");
        if (!modal || !modalContent || !closeButton) return;

        function closeModal() {
            modal.classList.add("hidden");
            doc.body.style.overflow = "auto";
        }

        function openModal(button) {
            const title = button.getAttribute("data-title") || "";
            const category = button.getAttribute("data-category") || "";
            const date = button.getAttribute("data-date") || "";
            const location = button.getAttribute("data-location") || "";
            const details = button.getAttribute("data-details") || "";
            const extra = button.getAttribute("data-extra") || "";

            modalContent.innerHTML =
                "<h3>" + title + "</h3>" +
                "<div class='modal-meta-row'>" +
                "<span class='modal-category'>" + category + "</span>" +
                "<span class='modal-date'>" + date + "</span>" +
                "</div>" +
                "<div class='modal-location'><span class='material-symbols-outlined'>location_on</span><span>" + location + "</span></div>" +
                "<p class='modal-details'>" + details + "</p>" +
                extra;

            modal.classList.remove("hidden");
            doc.body.style.overflow = "hidden";
        }

        qsa(".open-modal-btn").forEach(function (button) {
            button.addEventListener("click", function () {
                openModal(button);
            });
        });

        closeButton.addEventListener("click", closeModal);
        modal.addEventListener("click", function (event) {
            if (event.target === modal) closeModal();
        });

        doc.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && !modal.classList.contains("hidden")) {
                closeModal();
            }
        });
    }

    function initPrayerModal() {
        const openBtn = byId("prayer-schedule-btn");
        const modal = byId("prayer-schedule-modal");
        const closeBtn = byId("close-prayer-schedule-modal");
        if (!openBtn || !modal || !closeBtn) return;

        function closeModal() {
            modal.classList.add("hidden");
            doc.body.style.overflow = "auto";
        }

        openBtn.addEventListener("click", function () {
            modal.classList.remove("hidden");
            doc.body.style.overflow = "hidden";
        });

        closeBtn.addEventListener("click", closeModal);
        modal.addEventListener("click", function (event) {
            if (event.target === modal) closeModal();
        });

        doc.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && !modal.classList.contains("hidden")) {
                closeModal();
            }
        });
    }

    function initLightbox() {
        const items = qsa(".gallery-item");
        const lightbox = byId("lightbox");
        const image = byId("lightbox-img");
        const caption = byId("lightbox-caption");
        const closeBtn = lightbox ? lightbox.querySelector(".close") : null;
        const prevBtn = lightbox ? lightbox.querySelector(".prev") : null;
        const nextBtn = lightbox ? lightbox.querySelector(".next") : null;
        if (!items.length || !lightbox || !image || !caption || !closeBtn || !prevBtn || !nextBtn) return;

        const images = items.map(function (item) {
            const img = item.querySelector("img");
            const text = item.querySelector("p");
            return {
                src: img ? img.src : "",
                caption: text ? text.textContent : "",
                description: item.getAttribute("data-description") || ""
            };
        });

        let currentIndex = 0;

        function render() {
            const current = images[currentIndex];
            image.src = current.src;
            caption.innerHTML = "<div>" + current.caption + "</div>";
            if (current.description) {
                caption.innerHTML += "<div style='margin-top:.35rem;opacity:.86;font-size:.88rem;'>" + current.description + "</div>";
            }
        }

        function open(index) {
            currentIndex = index;
            render();
            lightbox.style.display = "flex";
            doc.body.style.overflow = "hidden";
        }

        function close() {
            lightbox.style.display = "none";
            doc.body.style.overflow = "auto";
        }

        function prev() {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            render();
        }

        function next() {
            currentIndex = (currentIndex + 1) % images.length;
            render();
        }

        items.forEach(function (item, index) {
            item.addEventListener("click", function () {
                open(index);
            });
        });

        closeBtn.addEventListener("click", close);
        prevBtn.addEventListener("click", prev);
        nextBtn.addEventListener("click", next);

        lightbox.addEventListener("click", function (event) {
            if (event.target === lightbox) close();
        });

        doc.addEventListener("keydown", function (event) {
            if (lightbox.style.display !== "flex") return;
            if (event.key === "Escape") close();
            if (event.key === "ArrowLeft") prev();
            if (event.key === "ArrowRight") next();
        });
    }

    function initBackToTop() {
        const button = byId("back-to-top");
        if (!button) return;

        function syncVisibility() {
            if (window.scrollY > 220) {
                button.classList.add("visible");
            } else {
                button.classList.remove("visible");
            }
        }

        window.addEventListener("scroll", syncVisibility);
        syncVisibility();

        button.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    function initTheme() {
        const toggleDesktop = byId("theme-toggle");
        const toggleMobile = byId("theme-toggle-mobile");
        const iconDesktop = byId("theme-toggle-icon");
        const iconMobile = byId("theme-toggle-icon-mobile");
        const key = "theme-preference";
        const media = window.matchMedia("(prefers-color-scheme: dark)");

        function systemTheme() {
            return media.matches ? "dark" : "light";
        }

        function iconName(theme) {
            return theme === "dark" ? "light_mode" : "dark_mode";
        }

        function apply(theme) {
            root.classList.toggle("dark", theme === "dark");
            if (iconDesktop) iconDesktop.textContent = iconName(theme);
            if (iconMobile) iconMobile.textContent = iconName(theme);
            if (toggleDesktop) toggleDesktop.setAttribute("aria-pressed", String(theme === "dark"));
            if (toggleMobile) toggleMobile.setAttribute("aria-pressed", String(theme === "dark"));
        }

        function current() {
            return localStorage.getItem(key) || systemTheme();
        }

        function toggle() {
            const next = root.classList.contains("dark") ? "light" : "dark";
            localStorage.setItem(key, next);
            apply(next);
        }

        apply(current());

        if (toggleDesktop) toggleDesktop.addEventListener("click", toggle);
        if (toggleMobile) toggleMobile.addEventListener("click", toggle);

        media.addEventListener("change", function () {
            if (!localStorage.getItem(key)) {
                apply(systemTheme());
            }
        });

        window.addEventListener("storage", function (event) {
            if (event.key === key) {
                apply(event.newValue || systemTheme());
            }
        });
    }

    function initLoadMoreGallery() {
        const items = qsa(".gallery-item");
        const button = byId("load-more-gallery");
        if (!items.length || !button) return;

        const batch = 4;
        let shown = 0;

        function render(reset) {
            if (reset) {
                shown = 0;
                items.forEach(function (item) {
                    item.style.display = "none";
                });
            }
            const next = Math.min(shown + batch, items.length);
            for (let i = shown; i < next; i += 1) {
                items[i].style.display = "";
            }
            shown = next;
            button.style.display = shown >= items.length ? "none" : "";
        }

        render(true);
        button.addEventListener("click", function () {
            render(false);
        });
    }

    function initPreloader() {
        const preloader = byId("preloader");
        if (!preloader) return;

        let loaded = false;
        let minTime = false;
        let timeout = false;
        let hidden = false;

        function revealContent() {
            const title = byId("home-title");
            if (title) title.classList.add("fade-in-initial");
            initFadeInAnimations();
        }

        function hidePreloader() {
            if (hidden) return;
            if ((loaded && minTime) || timeout) {
                hidden = true;
                preloader.classList.add("hide");
                revealContent();
                setTimeout(function () {
                    preloader.remove();
                }, 820);
            }
        }

        function markLoaded() {
            loaded = true;
            hidePreloader();
        }

        window.addEventListener("load", markLoaded);
        doc.addEventListener("DOMContentLoaded", markLoaded);

        setTimeout(function () {
            minTime = true;
            hidePreloader();
        }, 1400);

        setTimeout(function () {
            timeout = true;
            hidePreloader();
        }, 5000);
    }

    doc.addEventListener("DOMContentLoaded", function () {
        initMobileMenu();
        initSmoothScrollAndActiveLinks();
        initSkeletonLoaders();
        initEventModal();
        initPrayerModal();
        initLightbox();
        initBackToTop();
        initTheme();
        initLoadMoreGallery();
        initPreloader();
    });
})();
