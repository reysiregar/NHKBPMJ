document.getElementById('mobile-menu-button').addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    const btn = this;
    menu.classList.toggle('menu-open');
    btn.classList.toggle('open');
});
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const menu = document.getElementById('mobile-menu');
        const btn = document.getElementById('mobile-menu-button');
        menu.classList.remove('menu-open');
        btn.classList.remove('open');
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});
window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const closeBtn = document.querySelector('.close');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let currentImageIndex = 0;
const images = Array.from(galleryItems).map(item => ({
    src: item.querySelector('img').src,
    caption: item.querySelector('p').textContent,
    description: item.getAttribute('data-description') || ''
}));
galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        currentImageIndex = index;
        updateLightbox();
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
});
closeBtn.addEventListener('click', () => {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
});
prevBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateLightbox();
});
nextBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateLightbox();
});
function updateLightbox() {
    lightboxImg.src = images[currentImageIndex].src;
    lightboxCaption.innerHTML = `<div>${images[currentImageIndex].caption}</div>`;
    if (images[currentImageIndex].description) {
        lightboxCaption.innerHTML += `<div class='mt-2 text-sm text-gray-200'>${images[currentImageIndex].description}</div>`;
    }
}
document.addEventListener('DOMContentLoaded', function() {
    ['about', 'gallery', 'events'].forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const images = section.querySelectorAll('img[data-skeleton]');
            images.forEach(img => {
                const skeleton = img.previousElementSibling;

                function hideSkeleton() {
                    if (skeleton && skeleton.classList.contains('skeleton')) {
                        skeleton.style.display = 'none';
                    }
                    img.classList.remove('skeleton-fade');
                    img.classList.add('skeleton-loaded');
                }

                if (img.complete && img.naturalWidth !== 0) {
                    hideSkeleton();
                } else {
                    img.addEventListener('load', hideSkeleton);
                    img.addEventListener('error', hideSkeleton);
                }
            });
        }
    });
});

(function() {
    try {
        const params = new URLSearchParams(window.location.search);
        if (params.get('skeleton') === '1') {
            document.body.classList.add('force-skeleton');
            setTimeout(() => {
                document.body.classList.remove('force-skeleton');
            }, 5000);
        }
        window.__toggleSkeleton = function(state = null) {
            if (state === null) document.body.classList.toggle('force-skeleton');
            else if (state) document.body.classList.add('force-skeleton');
            else document.body.classList.remove('force-skeleton');
        };
    } catch (e) {
    }
})();

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});
document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'flex') {
        if (e.key === 'Escape') {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        } else if (e.key === 'ArrowLeft') {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            updateLightbox();
        } else if (e.key === 'ArrowRight') {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            updateLightbox();
        }
    }
});
function initFadeInAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Unobserve after first animation
            }
        });
    }, {
        threshold: 0.1
    });
    fadeElements.forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        // Apply delay based on data-delay attribute or index
        const delay = el.getAttribute('style') && el.getAttribute('style').match(/animation-delay: (\d+\.?\d*)s/) ? 
            parseFloat(el.getAttribute('style').match(/animation-delay: (\d+\.?\d*)s/)[1]) * 1000 : 0;
        setTimeout(() => {
            observer.observe(el);
        }, delay);
    });
}
const modal = document.getElementById('event-modal');
const modalContent = document.getElementById('modal-content');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalInner = modal ? modal.querySelector('div.bg-white') : null;

function openEventModal(event) {
    const btn = event.currentTarget;
    const title = btn.getAttribute('data-title');
    const category = btn.getAttribute('data-category');
    const date = btn.getAttribute('data-date');
    const location = btn.getAttribute('data-location');
    const details = btn.getAttribute('data-details');
    const extra = btn.getAttribute('data-extra');
    const action = btn.getAttribute('data-action');
    
    modalContent.innerHTML = `
        <h3 class="text-2xl font-bold mb-2">${title}</h3>
        <div class="flex justify-between items-center mb-2">
            <span class="text-xs font-medium px-2.5 py-0.5 rounded bg-gray-100 text-gray-800">${category}</span>
            <span class="text-sm text-gray-500">${date}</span>
        </div>
        <div class="mb-2 text-gray-600"><i class="fas fa-map-marker-alt mr-2"></i>${location}</div>
        <p class="mb-4 text-gray-700">${details}</p>
        ${extra}
    `;
    if (modalInner) {
        modalInner.classList.remove('animate-modal-in');
        void modalInner.offsetWidth;
        modalInner.classList.add('animate-modal-in');
    }
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', openEventModal);
});

closeModalBtn.addEventListener('click', function() {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    if (modalInner) modalInner.classList.remove('animate-modal-in');
});

modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        if (modalInner) modalInner.classList.remove('animate-modal-in');
    }
});

const backToTopBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', function() {
    if (window.scrollY > 200) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});
backToTopBtn.addEventListener('click', function() {
    if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        const duration = 1000;
        const start = window.scrollY;
        const startTime = performance.now();
        function scrollStep(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
            window.scrollTo(0, start * (1 - ease));
            if (progress < 1) {
                requestAnimationFrame(scrollStep);
            }
        }
        requestAnimationFrame(scrollStep);
    }
});
(function() {
    const preloader = document.getElementById('preloader');
    let loaded = false;
    let minTimePassed = false;
    let hardTimeoutPassed = false;
    let preloaderHidden = false;
    function tryHidePreloader() {
        if (preloaderHidden) return;
        if ((loaded && minTimePassed) || hardTimeoutPassed) {
            if (preloader) {
                preloaderHidden = true;
                preloader.classList.add('hide');
                // Initialize fade-in animations as soon as preloader starts fading out
                initFadeInAnimations();
                const homeTitle = document.getElementById('home-title');
                if (homeTitle) {
                    homeTitle.classList.add('fade-in-initial');
                }
                setTimeout(() => {
                    preloader.remove();
                }, 900); // match the CSS transition duration
            }
        }
    }
    function markLoaded() {
        loaded = true;
        tryHidePreloader();
    }
    window.addEventListener('load', markLoaded);
    document.addEventListener('DOMContentLoaded', markLoaded);
    setTimeout(function() {
        minTimePassed = true;
        tryHidePreloader();
    }, 1500);
    setTimeout(function() {
        hardTimeoutPassed = true;
        tryHidePreloader();
    }, 5000);
})();
(function() {
    const root = document.documentElement;
    const toggleDesktop = document.getElementById('theme-toggle');
    const toggleMobile = document.getElementById('theme-toggle-mobile');
    const iconDesktop = document.getElementById('theme-toggle-icon');
    const iconMobile = document.getElementById('theme-toggle-icon-mobile');
    const STORAGE_KEY = 'theme-preference';

    function currentPreference() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applyTheme(theme) {
        if (theme === 'dark') {
            root.classList.add('dark');
            updateIcons('dark');
        } else {
            root.classList.remove('dark');
            updateIcons('light');
        }
        if (toggleDesktop) toggleDesktop.setAttribute('aria-pressed', theme === 'dark');
        if (toggleMobile) toggleMobile.setAttribute('aria-pressed', theme === 'dark');
    }

    function updateIcons(theme) {
        const toMoon = theme !== 'dark';
        if (iconDesktop) iconDesktop.className = 'theme-toggle-icon fas ' + (toMoon ? 'fa-moon' : 'fa-sun');
        if (iconMobile) iconMobile.className = 'theme-toggle-icon fas ' + (toMoon ? 'fa-moon' : 'fa-sun');
    }

    function toggleTheme() {
        const newTheme = root.classList.contains('dark') ? 'light' : 'dark';
        localStorage.setItem(STORAGE_KEY, newTheme);
        applyTheme(newTheme);
    }

    // Initialize
    applyTheme(currentPreference());
    if (toggleDesktop) toggleDesktop.addEventListener('click', toggleTheme);
    if (toggleMobile) toggleMobile.addEventListener('click', toggleTheme);

    // Sync across tabs
    window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY && e.newValue) {
            applyTheme(e.newValue);
        }
    });
})();
const prayerBtn = document.getElementById('prayer-schedule-btn');
const prayerModal = document.getElementById('prayer-schedule-modal');
const closePrayerModal = document.getElementById('close-prayer-schedule-modal');
if (prayerBtn && prayerModal && closePrayerModal) {
    prayerBtn.addEventListener('click', function() {
        prayerModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });
    closePrayerModal.addEventListener('click', function() {
        prayerModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    });
    prayerModal.addEventListener('click', function(e) {
        if (e.target === prayerModal) {
            prayerModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });
}
(function() {
    const gallerySection = document.getElementById('gallery');
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    const loadMoreBtn = document.getElementById('load-more-gallery');
    if (!galleryItems.length || !loadMoreBtn) return;

    function isMobile() {
        return window.innerWidth < 768;
    }
    function getBatchSize() {
        return 4;
    }
    let shownCount = 0;

    function showGalleryBatch(reset = false) {
        const batchSize = getBatchSize();
        if (reset) {
            shownCount = 0;
            galleryItems.forEach(item => item.style.display = 'none');
        }
        let toShow = shownCount === 0 ? batchSize : shownCount + batchSize;
        for (let i = 0; i < toShow && i < galleryItems.length; i++) {
            galleryItems[i].style.display = '';
        }
        shownCount = Math.min(toShow, galleryItems.length);
        if (shownCount >= galleryItems.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = '';
        }
    }
    showGalleryBatch(true);
    loadMoreBtn.addEventListener('click', function() {
        showGalleryBatch();
    });
})();

// Snowfall effect - Pure JavaScript implementation
(function() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Style the canvas
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    
    document.body.appendChild(canvas);
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Snowflake array
    const snowflakes = [];
    const maxSnowflakes = 100;
    
    // Snowflake class
    class Snowflake {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height;
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -10;
            this.radius = Math.random() * 3 + 2;
            this.speed = Math.random() * 1 + 0.5;
            this.wind = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.5;
        }
        
        update() {
            this.y += this.speed;
            this.x += this.wind;
            
            // Reset snowflake when it goes off screen
            if (this.y > canvas.height) {
                this.reset();
            }
            if (this.x > canvas.width) {
                this.x = 0;
            } else if (this.x < 0) {
                this.x = canvas.width;
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
            ctx.closePath();
        }
    }
    
    // Create snowflakes
    for (let i = 0; i < maxSnowflakes; i++) {
        snowflakes.push(new Snowflake());
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        snowflakes.forEach(snowflake => {
            snowflake.update();
            snowflake.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
})();