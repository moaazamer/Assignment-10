const root = document.documentElement;
const header = document.getElementById("header");
const navLinks = document.querySelectorAll(".nav-link");
const navMenu = document.getElementById("nav-links");
const menuButton = document.getElementById("menu-button");
const sections = document.querySelectorAll(".tracked-section");
const themeButton = document.getElementById("theme-button");
const themeIcon = document.getElementById("theme-icon");
const backToTop = document.getElementById("back-to-top");
const settingsButton = document.getElementById("settings-button");
const settingsDialog = document.getElementById("settings-dialog");
const closeSettings = document.getElementById("close-settings");
const fontButtons = document.querySelectorAll(".font-option");
const colorButtons = document.querySelectorAll(".color-option");
const resetSettings = document.getElementById("reset-settings");
const filterButtons = document.querySelectorAll(".filter-button");
const projectsGrid = document.getElementById("projects-grid");
const projectsStatus = document.getElementById("projects-status");
const carousel = document.getElementById("carousel");
const carouselTrack = document.getElementById("carousel-track");
const slides = document.querySelectorAll(".testimonial");
const carouselDots = document.getElementById("carousel-dots");
const carouselStatus = document.getElementById("carousel-status");
const previousSlide = document.getElementById("previous-slide");
const nextSlide = document.getElementById("next-slide");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

const storageKey = "mosaab-portfolio-settings";

const palettes = {
    purple: ["#7c3aed", "#4f46e5"],
    pink: ["#be185d", "#c2410c"],
    green: ["#047857", "#0f766e"],
    blue: ["#1d4ed8", "#0e7490"],
    red: ["#b91c1c", "#be123c"],
    orange: ["#c2410c", "#a16207"]
};

const defaultSettings = {
    theme: "light",
    font: "Tajawal",
    color: "purple"
};

let settings = { ...defaultSettings };

function loadSettings() {
    try {
        const savedSettings = JSON.parse(localStorage.getItem(storageKey));

        if (!savedSettings || typeof savedSettings !== "object") {
            return;
        }

        if (["light", "dark"].includes(savedSettings.theme)) {
            settings.theme = savedSettings.theme;
        }

        if (["Tajawal", "Cairo", "Alexandria"].includes(savedSettings.font)) {
            settings.font = savedSettings.font;
        }

        if (Object.hasOwn(palettes, savedSettings.color)) {
            settings.color = savedSettings.color;
        }
    } catch {
        settings = { ...defaultSettings };
    }
}

function saveSettings() {
    try {
        localStorage.setItem(storageKey, JSON.stringify(settings));
    } catch {
        return;
    }
}

function applySettings() {
    const isDark = settings.theme === "dark";
    const selectedPalette = palettes[settings.color];

    root.classList.toggle("dark", isDark);
    root.style.setProperty("--primary", selectedPalette[0]);
    root.style.setProperty("--secondary", selectedPalette[1]);
    root.style.setProperty("--font", `"${settings.font}", sans-serif`);

    themeIcon.innerHTML = isDark
        ? `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/>
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`
        : `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M20.9 13.3A9 9 0 0 1 10.7 3.1 9 9 0 1 0 20.9 13.3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    themeButton.setAttribute("aria-pressed", String(isDark));
    themeButton.setAttribute(
        "aria-label",
        isDark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"
    );

    fontButtons.forEach(function (button) {
        const isActive = button.dataset.font === settings.font;

        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });

    colorButtons.forEach(function (button) {
        const isActive = button.dataset.color === settings.color;

        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
}

themeButton.addEventListener("click", function () {
    settings.theme = settings.theme === "dark" ? "light" : "dark";
    applySettings();
    saveSettings();
});

fontButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        settings.font = button.dataset.font;
        applySettings();
        saveSettings();
    });
});

colorButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        settings.color = button.dataset.color;
        applySettings();
        saveSettings();
    });
});

resetSettings.addEventListener("click", function () {
    settings = { ...defaultSettings };
    applySettings();
    saveSettings();
});

settingsButton.addEventListener("click", function () {
    settingsDialog.showModal();
    document.body.classList.add("modal-open");
    settingsButton.setAttribute("aria-expanded", "true");
    closeSettings.focus();
});

closeSettings.addEventListener("click", function () {
    settingsDialog.close();
});

settingsDialog.addEventListener("click", function (event) {
    const rectangle = settingsDialog.getBoundingClientRect();

    const clickedOutside =
        event.clientX < rectangle.left ||
        event.clientX > rectangle.right ||
        event.clientY < rectangle.top ||
        event.clientY > rectangle.bottom;

    if (event.target === settingsDialog && clickedOutside) {
        settingsDialog.close();
    }
});

settingsDialog.addEventListener("close", function () {
    document.body.classList.remove("modal-open");
    settingsButton.setAttribute("aria-expanded", "false");
    settingsButton.focus();
});

function setMenuState(isOpen) {
    navMenu.classList.toggle("open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
        "aria-label",
        isOpen ? "إغلاق القائمة" : "فتح القائمة"
    );
    menuButton.textContent = isOpen ? "×" : "☰";
}

menuButton.addEventListener("click", function () {
    setMenuState(!navMenu.classList.contains("open"));
});

navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        setMenuState(false);
    });
});

document.addEventListener("click", function (event) {
    if (!header.contains(event.target)) {
        setMenuState(false);
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && navMenu.classList.contains("open")) {
        setMenuState(false);
        menuButton.focus();
    }
});

function updateScrollState() {
    const offset = header.offsetHeight + 120;
    let activeSection = sections[0].id;

    sections.forEach(function (section) {
        if (section.getBoundingClientRect().top <= offset) {
            activeSection = section.id;
        }
    });

    const reachedBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 5;

    if (reachedBottom) {
        activeSection = sections[sections.length - 1].id;
    }

    navLinks.forEach(function (link) {
        const isActive = link.getAttribute("href") === `#${activeSection}`;

        link.classList.toggle("active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "location");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    header.classList.toggle("scrolled", window.scrollY > 20);
    backToTop.hidden = window.scrollY < 450;
}

let scrollScheduled = false;

window.addEventListener("scroll", function () {
    if (scrollScheduled) {
        return;
    }

    scrollScheduled = true;

    requestAnimationFrame(function () {
        updateScrollState();
        scrollScheduled = false;
    });
}, { passive: true });

backToTop.addEventListener("click", function () {
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "instant" : "smooth"
    });
});

const imageBase = "https://portfolio-route.vercel.app/assets/";

const projects = [
    {
        title: "متجر إلكتروني متكامل",
        description: "نموذج واجهة متجر لعرض المنتجات وتنظيم تجربة التسوق.",
        category: "store",
        label: "تجارة إلكترونية",
        image: "portfolio-1-BBJ9HaD5.png",
        tags: ["HTML", "CSS", "JavaScript"]
    },
    {
        title: "تطبيق إدارة المهام",
        description: "نموذج تطبيق لتنظيم المهام ومتابعة الأعمال اليومية.",
        category: "app",
        label: "تطبيق",
        image: "portfolio-2-F8b-iTfx.png",
        tags: ["DOM", "Events", "LocalStorage"]
    },
    {
        title: "موقع شخصي إبداعي",
        description: "تصميم واجهة شخصية لعرض المهارات والمشاريع.",
        category: "design",
        label: "تصميم",
        image: "portfolio-3-CorL6bc5.png",
        tags: ["UI", "Layout", "Responsive"]
    },
    {
        title: "موقع شركة استشارية",
        description: "نموذج موقع تعريفي يعرض الخدمات ومعلومات الشركة.",
        category: "web",
        label: "موقع ويب",
        image: "portfolio-4-TS862Pxr.png",
        tags: ["HTML", "CSS", "Grid"]
    },
    {
        title: "لوحة تحليلات اجتماعية",
        description: "تصميم لوحة تحكم لعرض البيانات والمؤشرات.",
        category: "app",
        label: "تطبيق",
        image: "portfolio-5-CA5zqLPi.png",
        tags: ["Dashboard", "JavaScript", "Data"]
    },
    {
        title: "متجر أزياء",
        description: "واجهة تسوق لعرض مجموعات الملابس والمنتجات.",
        category: "store",
        label: "تجارة إلكترونية",
        image: "portfolio-6-BG34qIjS.png",
        tags: ["HTML", "CSS", "JavaScript"]
    },
    {
        title: "موقع مطعم",
        description: "واجهة لعرض قائمة الطعام والتعريف بخدمات المطعم.",
        category: "web",
        label: "موقع ويب",
        image: "portfolio-7-D_mGnQLw.png",
        tags: ["Responsive", "CSS", "DOM"]
    },
    {
        title: "تطبيق لياقة بدنية",
        description: "نموذج لتتبع الأنشطة وعرض التقدم في التمارين.",
        category: "app",
        label: "تطبيق",
        image: "portfolio-8-DmiljHRz.png",
        tags: ["JavaScript", "UI", "Data"]
    },
    {
        title: "تصميم تطبيق جوال",
        description: "نموذج واجهات متناسقة لتطبيق مناسب للشاشات الصغيرة.",
        category: "design",
        label: "تصميم",
        image: "portfolio-9-BwS52lpH.png",
        tags: ["UI", "UX", "Mobile"]
    }
];

function renderProjects() {
    projectsGrid.innerHTML = projects.map(function (project) {
        const tags = project.tags.map(function (tag) {
            return `<span>${tag}</span>`;
        }).join("");

        return `
      <article class="project-card" data-category="${project.category}">
        <div class="project-image">
          <img
            src="${imageBase}${project.image}"
            alt="${project.title}"
            loading="lazy"
            width="640"
            height="400"
          >
        </div>
        <div class="project-content">
          <span class="project-category">${project.label}</span>
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="tags">${tags}</div>
        </div>
      </article>
    `;
    }).join("");

    projectsStatus.textContent = `عدد المشاريع المعروضة: ${projects.length}`;
}

function filterProjects(category) {
    const cards = document.querySelectorAll(".project-card");
    let visibleCount = 0;

    cards.forEach(function (card) {
        const shouldShow =
            category === "all" || card.dataset.category === category;

        card.hidden = !shouldShow;

        if (shouldShow) {
            visibleCount++;
        }
    });

    filterButtons.forEach(function (button) {
        const isActive = button.dataset.filter === category;

        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });

    projectsStatus.textContent = `عدد المشاريع المعروضة: ${visibleCount}`;
    requestAnimationFrame(updateScrollState);
}

filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        filterProjects(button.dataset.filter);
    });
});

let currentSlide = 0;
let visibleSlides = 3;

function getMaximumSlide() {
    return Math.max(0, slides.length - visibleSlides);
}

function updateCarousel() {
    const maximumSlide = getMaximumSlide();

    currentSlide = Math.max(0, Math.min(currentSlide, maximumSlide));

    const distance = currentSlide * (100 / visibleSlides);

    carouselTrack.style.transform = `translateX(${distance}%)`;

    const dots = carouselDots.querySelectorAll(".carousel-dot");

    dots.forEach(function (dot, index) {
        const isActive = index === currentSlide;

        dot.classList.toggle("active", isActive);
        dot.setAttribute("aria-pressed", String(isActive));
    });

    slides.forEach(function (slide, index) {
        const isVisible =
            index >= currentSlide && index < currentSlide + visibleSlides;

        slide.setAttribute("aria-hidden", String(!isVisible));
    });

    carouselStatus.textContent =
        `عرض التوصيات من ${currentSlide + 1} إلى ` +
        `${Math.min(currentSlide + visibleSlides, slides.length)} ` +
        `من أصل ${slides.length}`;
}

function buildCarouselDots() {
    carouselDots.innerHTML = "";

    for (let index = 0; index <= getMaximumSlide(); index++) {
        const dot = document.createElement("button");

        dot.type = "button";
        dot.className = "carousel-dot";
        dot.setAttribute("aria-label", `عرض التوصيات بدءاً من ${index + 1}`);

        dot.addEventListener("click", function () {
            currentSlide = index;
            updateCarousel();
        });

        carouselDots.appendChild(dot);
    }
}

function resizeCarousel() {
    visibleSlides = Number(
        getComputedStyle(carousel).getPropertyValue("--visible-slides")
    );

    currentSlide = Math.min(currentSlide, getMaximumSlide());

    buildCarouselDots();
    updateCarousel();
}

function moveCarousel(direction) {
    const totalPositions = getMaximumSlide() + 1;

    currentSlide =
        (currentSlide + direction + totalPositions) % totalPositions;

    updateCarousel();
}

nextSlide.addEventListener("click", function () {
    moveCarousel(1);
});

previousSlide.addEventListener("click", function () {
    moveCarousel(-1);
});

carousel.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveCarousel(1);
    }

    if (event.key === "ArrowRight") {
        event.preventDefault();
        moveCarousel(-1);
    }
});

let touchStartX = 0;
let touchStartY = 0;

carousel.addEventListener("touchstart", function (event) {
    touchStartX = event.changedTouches[0].clientX;
    touchStartY = event.changedTouches[0].clientY;
}, { passive: true });

carousel.addEventListener("touchend", function (event) {
    const distanceX = event.changedTouches[0].clientX - touchStartX;
    const distanceY = event.changedTouches[0].clientY - touchStartY;

    if (Math.abs(distanceX) > 50 && Math.abs(distanceX) > Math.abs(distanceY)) {
        moveCarousel(distanceX > 0 ? 1 : -1);
    }
}, { passive: true });

window.addEventListener("resize", function () {
    resizeCarousel();
    updateScrollState();

    if (window.innerWidth > 800) {
        setMenuState(false);
    }
});

contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nameInput = document.getElementById("full-name");
    const messageInput = document.getElementById("message");

    nameInput.setCustomValidity(
        nameInput.value.trim().length < 2
            ? "اكتب اسماً مكوناً من حرفين على الأقل."
            : ""
    );

    messageInput.setCustomValidity(
        messageInput.value.trim().length < 10
            ? "اكتب تفاصيل من 10 أحرف على الأقل."
            : ""
    );

    if (!contactForm.reportValidity()) {
        return;
    }

    formStatus.textContent =
        "البيانات صحيحة. هذا نموذج تجريبي، ولم يتم إرسال أي رسالة.";
});

contactForm.addEventListener("input", function (event) {
    if (typeof event.target.setCustomValidity === "function") {
        event.target.setCustomValidity("");
    }

    formStatus.textContent = "";
});

document.getElementById("year").textContent = new Date().getFullYear();

loadSettings();
applySettings();
renderProjects();
resizeCarousel();
updateScrollState();

window.addEventListener("load", updateScrollState);