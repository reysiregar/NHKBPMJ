// Mobile menu toggle
document.getElementById('mobile-menu-button').addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    const btn = this;
    menu.classList.toggle('menu-open');
    btn.classList.toggle('open');
});
// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        // Close mobile menu if open
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
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});
// Update active nav link on scroll
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
// Lightbox functionality
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
// Close lightbox when clicking outside the image
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});
// Keyboard navigation for lightbox
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
// Intersection Observer for fade-in animations
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
// Modal for event details
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
        <button class="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-gray-100 transition w-full">${action}</button>
    `;
    if (modalInner) {
        modalInner.classList.remove('animate-modal-in');
        void modalInner.offsetWidth; // force reflow
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

// Back to top button functionality
const backToTopBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', function() {
    if (window.scrollY > 200) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});
backToTopBtn.addEventListener('click', function() {
    // Custom slow scroll to top (1 second duration)
    const duration = 1000;
    const start = window.scrollY;
    const startTime = performance.now();
    function scrollStep(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease in-out
        const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
        window.scrollTo(0, start * (1 - ease));
        if (progress < 1) {
            requestAnimationFrame(scrollStep);
        }
    }
    requestAnimationFrame(scrollStep);
});
// Preloader logic
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
    // Hard fallback: always hide preloader after 5 seconds
    setTimeout(function() {
        hardTimeoutPassed = true;
        tryHidePreloader();
    }, 5000);
})();
// Prayer Schedule Modal logic
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