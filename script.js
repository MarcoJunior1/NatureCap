// Menu Mobile Toggle
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show');
    });
}

if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show');
    });
}

// Fechar menu ao clicar em um link
const navLinks = document.querySelectorAll('.nav__link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show');
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Scroll suave para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animação de elementos ao scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observar elementos para animação
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.technology__item, .metric, .product__card, .blog__post');
    animateElements.forEach(el => {
        observer.observe(el);
    });
});


// Galeria com Dois Slides Visíveis
document.addEventListener('DOMContentLoaded', function() {
    class Gallery {
        constructor() {
            this.track = document.getElementById('gallery-track');
            this.dotsContainer = document.getElementById('gallery-dots');
            this.thumbnailsContainer = document.getElementById('gallery-thumbnails');
            this.prevBtn = document.getElementById('gallery-prev');
            this.nextBtn = document.getElementById('gallery-next');
            this.progressBar = document.getElementById('gallery-progress');
            
            this.slides = document.querySelectorAll('.gallery__slide');
            this.totalSlides = this.slides.length;
            this.slidesPerView = this.getSlidesPerView();
            this.currentGroup = 0;
            this.totalGroups = Math.ceil(this.totalSlides / this.slidesPerView);
            this.isTransitioning = false;
            this.autoSlideInterval = null;
            this.progressInterval = null;
            
            this.init();
        }
        
        getSlidesPerView() {
            return window.innerWidth <= 650 ? 1 : 2;
        }
        
        init() {
            this.updateSlidesLayout();
            this.createDots();
            this.createThumbnails();
            this.updateGallery();
            this.startAutoSlide();
            this.addEventListeners();
            this.preloadImages();
            
            // Redimensionamento da janela
            window.addEventListener('resize', () => {
                const newSlidesPerView = this.getSlidesPerView();
                if (newSlidesPerView !== this.slidesPerView) {
                    this.slidesPerView = newSlidesPerView;
                    this.totalGroups = Math.ceil(this.totalSlides / this.slidesPerView);
                    this.currentGroup = Math.min(this.currentGroup, this.totalGroups - 1);
                    this.updateSlidesLayout();
                    this.createDots();
                    this.updateGallery();
                }
            });
        }
        
        updateSlidesLayout() {
            // Ajustar o layout baseado no número de slides por view
            const gap = this.slidesPerView === 2 ? 20 : 0;
            const padding = this.slidesPerView === 2 ? 10 : 0;
            const slideWidth = this.slidesPerView === 2 ? 'calc(50% - 10px)' : '100%';
            
            this.track.style.gap = `${gap}px`;
            this.track.style.padding = `0 ${padding}px`;
            
            this.slides.forEach(slide => {
                slide.style.flex = `0 0 ${slideWidth}`;
            });
        }
        
        createDots() {
            this.dotsContainer.innerHTML = '';
            for (let i = 0; i < this.totalGroups; i++) {
                const dot = document.createElement('button');
                dot.classList.add('gallery__dot');
                dot.setAttribute('role', 'tab');
                dot.setAttribute('aria-label', `Ir para grupo ${i + 1}`);
                dot.addEventListener('click', () => this.goToGroup(i));
                this.dotsContainer.appendChild(dot);
            }
        }
        
        createThumbnails() {
            this.thumbnailsContainer.innerHTML = '';
            this.slides.forEach((slide, index) => {
                const img = slide.querySelector('.gallery__image');
                const thumbnail = document.createElement('img');
                thumbnail.src = img.src;
                thumbnail.alt = `Miniatura: ${img.alt}`;
                thumbnail.classList.add('gallery__thumbnail');
                thumbnail.addEventListener('click', () => {
                    const groupIndex = Math.floor(index / this.slidesPerView);
                    this.goToGroup(groupIndex);
                });
                this.thumbnailsContainer.appendChild(thumbnail);
            });
        }
        
        goToGroup(groupIndex) {
            if (this.isTransitioning || groupIndex === this.currentGroup) return;
            
            this.isTransitioning = true;
            this.currentGroup = groupIndex;
            
            requestAnimationFrame(() => {
                this.track.style.transform = `translateX(-${this.currentGroup * 100}%)`;
                
                setTimeout(() => {
                    this.isTransitioning = false;
                    this.updateGalleryState();
                }, 500);
            });
        }
        
        updateGalleryState() {
            // Atualizar dots
            document.querySelectorAll('.gallery__dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentGroup);
                dot.setAttribute('aria-selected', index === this.currentGroup);
            });
            
            // Atualizar miniaturas
            const startIndex = this.currentGroup * this.slidesPerView;
            const endIndex = startIndex + this.slidesPerView;
            
            document.querySelectorAll('.gallery__thumbnail').forEach((thumb, index) => {
                thumb.classList.toggle('active', index >= startIndex && index < endIndex);
            });
            
            // Atualizar slides ativos
            this.slides.forEach((slide, index) => {
                slide.classList.toggle('active', index >= startIndex && index < endIndex);
            });
            
            // Atualizar botões
            this.prevBtn.disabled = this.currentGroup === 0;
            this.nextBtn.disabled = this.currentGroup === this.totalGroups - 1;
            
            // Reiniciar progresso
            this.resetProgressBar();
        }
        
        updateGallery() {
            this.track.style.transform = `translateX(-${this.currentGroup * 100}%)`;
            this.updateGalleryState();
        }
        
        nextGroup() {
            const nextIndex = (this.currentGroup + 1) % this.totalGroups;
            this.goToGroup(nextIndex);
        }
        
        prevGroup() {
            const prevIndex = (this.currentGroup - 1 + this.totalGroups) % this.totalGroups;
            this.goToGroup(prevIndex);
        }
        
        startProgressBar() {
            this.progressBar.style.width = '0%';
            let width = 0;
            
            this.progressInterval = setInterval(() => {
                if (width >= 100) {
                    clearInterval(this.progressInterval);
                    if (!this.isTransitioning) {
                        this.nextGroup();
                    }
                } else {
                    width += 0.3;
                    this.progressBar.style.width = width + '%';
                }
            }, 50);
        }
        
        resetProgressBar() {
            clearInterval(this.progressInterval);
            this.startProgressBar();
        }
        
        startAutoSlide() {
            this.autoSlideInterval = setInterval(() => {
                if (!this.isTransitioning) {
                    this.nextGroup();
                }
            }, 6000);
        }
        
        stopAutoSlide() {
            clearInterval(this.autoSlideInterval);
            clearInterval(this.progressInterval);
        }
        
        preloadImages() {
            this.slides.forEach(slide => {
                const img = slide.querySelector('.gallery__image');
                if (img.complete) {
                    slide.classList.remove('loading');
                } else {
                    slide.classList.add('loading');
                    img.addEventListener('load', () => {
                        slide.classList.remove('loading');
                    });
                }
            });
        }
        
        addEventListeners() {
            // Controles de navegação
            this.prevBtn.addEventListener('click', () => {
                if (!this.isTransitioning) this.prevGroup();
            });
            
            this.nextBtn.addEventListener('click', () => {
                if (!this.isTransitioning) this.nextGroup();
            });
            
            
            // Swipe para mobile
            this.addSwipeSupport();
            
            // Teclado
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') this.prevGroup();
                if (e.key === 'ArrowRight') this.nextGroup();
            });
        }
        
        addSwipeSupport() {
            let startX = 0;
            let currentX = 0;
            let isSwiping = false;
            
            this.track.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                currentX = startX;
                isSwiping = true;
            });
            
            this.track.addEventListener('touchmove', (e) => {
                if (!isSwiping) return;
                currentX = e.touches[0].clientX;
                
                if (Math.abs(currentX - startX) > Math.abs(e.touches[0].clientY - startX)) {
                    e.preventDefault();
                }
            });
            
            this.track.addEventListener('touchend', () => {
                if (!isSwiping) return;
                
                const diff = startX - currentX;
                const swipeThreshold = 50;
                
                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0 && !this.nextBtn.disabled) {
                        this.nextGroup();
                    } else if (diff < 0 && !this.prevBtn.disabled) {
                        this.prevGroup();
                    }
                }
                
                isSwiping = false;
            });
        }
    }
    
    // Inicializar galeria
    new Gallery();
});