// Mobile menu toggle
document.getElementById('mobile-menu-button').addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('menu-open');
});
// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        // Close mobile menu if open
        document.getElementById('mobile-menu').classList.remove('menu-open');
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
    caption: item.querySelector('p').textContent
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
    lightboxCaption.textContent = images[currentImageIndex].caption;
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
// Modal for event details
const modal = document.getElementById('event-modal');
const modalContent = document.getElementById('modal-content');
const closeModalBtn = document.getElementById('close-modal-btn');

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
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', openEventModal);
});

closeModalBtn.addEventListener('click', function() {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
});

modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
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
    function tryHidePreloader() {
        if (loaded && minTimePassed && preloader) {
            preloader.classList.add('hide');
            setTimeout(() => {
                preloader.remove();
            }, 900); // match the CSS transition duration
        }
    }
    window.addEventListener('load', function() {
        loaded = true;
        tryHidePreloader();
    });
    setTimeout(function() {
        minTimePassed = true;
        tryHidePreloader();
    }, 3000);
})(); 