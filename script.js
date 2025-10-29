document.addEventListener('DOMContentLoaded', function() {

    const sections = document.querySelectorAll('.content-section');
    const navLinks = document.querySelectorAll('.main-nav .nav-btn');
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    const nav = document.querySelector('.main-nav');
    let navHeight = nav.offsetHeight;

    window.addEventListener('resize', () => {
        navHeight = nav.offsetHeight;
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -150px 0px',
        threshold: 0
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.id;
            const correspondingLink = document.querySelector(`.nav-btn[data-target="#${id}"]`);
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const targetPosition = targetSection.offsetTop - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // === MODIFIED FOR SMOOTHER ANIMATION ===
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add("visible");
        } else {
            scrollToTopBtn.classList.remove("visible");
        }
    });
    // =======================================

    scrollToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // === КОД ДЛЯ ГОРИЗОНТАЛЬНОЙ ГАЛЕРЕИ ПРОИЗВЕДЕНИЙ (БЕЗ КНОПОК) ===
    const gallery = document.querySelector('.gallery');
    if (gallery) {
        const originalItems = Array.from(gallery.children);
        originalItems.forEach(item => {
            const clone = item.cloneNode(true);
            gallery.appendChild(clone);
        });
    }

    // === КОД ДЛЯ ВЕРТИКАЛЬНОЙ АНИМАЦИИ ЦИТАТ ===
    const quoteColumns = document.querySelectorAll('.quote-column');
    quoteColumns.forEach(column => {
        const originalQuotes = Array.from(column.children);
        originalQuotes.forEach(item => {
            const clone = item.cloneNode(true);
            column.appendChild(clone);
        });
    });


    // === КОД ДЛЯ ПРЕЗЕНТАЦИИ (остается без изменений) ===
    const presentationLaunchPad = document.getElementById('presentation-launch-pad');
    if (presentationLaunchPad) {
        const startPresBtn = document.getElementById('start-pres-btn');
        const presentationLayout = presentationLaunchPad.querySelector('.presentation-layout-container');
        const presentation = presentationLaunchPad.querySelector('.presentation-container');
        const slideAnnouncer = document.getElementById('slide-announcer');

        const fullscreenBtn = document.getElementById('fullscreen-btn');
        const fullscreenHint = document.getElementById('fullscreen-hint');
        const closeHintBtn = document.getElementById('close-hint-btn');
        let hintAppearanceTimeout;
        let hintDisappearanceTimeout;

        startPresBtn.addEventListener('click', () => {
            presentationLaunchPad.classList.add('started');

            if (fullscreenHint && closeHintBtn) {
                hintAppearanceTimeout = setTimeout(() => {
                    fullscreenHint.classList.add('visible');
                    hintDisappearanceTimeout = setTimeout(() => {
                        fullscreenHint.classList.remove('visible');
                    }, 5000);
                }, 2000);

                closeHintBtn.addEventListener('click', () => {
                    fullscreenHint.classList.remove('visible');
                    clearTimeout(hintAppearanceTimeout);
                    clearTimeout(hintDisappearanceTimeout);
                }, { once: true });
            }
        });

        const slides = Array.from(presentation.querySelectorAll('.slide'));
        const nextBtn = presentationLayout.querySelector('.next');
        const prevBtn = presentationLayout.querySelector('.prev');
        const counter = presentation.querySelector('.slide-counter');
        const background = presentation.querySelector('.presentation-background');
        const infoDrum = presentationLayout.querySelector('.info-drum');
        let currentSlide = 0;
        let isAnimating = false;
        const totalSlides = slides.length;
        const animationDuration = 700;

        function updatePresentation(direction = '') {
            if (isAnimating) return;
            isAnimating = true;
            const prevSlide = slides.find(slide => slide.classList.contains('active'));
            const nextSlide = slides[currentSlide];

            nextBtn.disabled = currentSlide === totalSlides - 1;
            prevBtn.disabled = currentSlide === 0;

            if (counter) {
                counter.textContent = `${currentSlide + 1} / ${totalSlides}`;
            }

            background.style.opacity = currentSlide > 0 ? '1' : '0';

            if (infoDrum) {
                const rotationAngle = (360 / (totalSlides - 1)) * currentSlide;
                infoDrum.style.transform = `rotate(${rotationAngle}deg)`;
            }

            if (direction && prevSlide) {
                const outClass = direction === 'next' ? 'anim-out-left' : 'anim-out-right';
                const inClass = direction === 'next' ? 'anim-in-right' : 'anim-in-left';
                prevSlide.classList.add(outClass);
                nextSlide.classList.add(inClass, 'active');
                setTimeout(() => {
                    prevSlide.classList.remove('active', outClass);
                    nextSlide.classList.remove(inClass);

                    // Accessibility improvements
                    nextSlide.focus();
                    const slideTitle = nextSlide.querySelector('.slide-title, .pres-title');
                    if (slideAnnouncer && slideTitle) {
                        slideAnnouncer.textContent = `Слайд ${currentSlide + 1}: ${slideTitle.textContent}`;
                    }

                    isAnimating = false;
                }, animationDuration);
            } else {
                nextSlide.classList.add('active');
                isAnimating = false;
            }
        }

        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentSlide < totalSlides - 1) {
                currentSlide++;
                updatePresentation('next');
            }
        });

        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentSlide > 0) {
                currentSlide--;
                updatePresentation('prev');
            }
        });

        document.addEventListener('keydown', (e) => {
            const presentationRect = presentation.getBoundingClientRect();
            const isInView = presentationRect.top < window.innerHeight && presentationRect.bottom >= 0;
            if (isInView && presentationLaunchPad.classList.contains('started')) {
                if (e.key === 'ArrowRight') nextBtn.click();
                else if (e.key === 'ArrowLeft') prevBtn.click();
            }
        });

        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                presentationLayout.requestFullscreen().catch(err => {
                    alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                });
            } else {
                document.exitFullscreen();
            }
        });

        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                fullscreenBtn.classList.add('fullscreen-active');
            } else {
                fullscreenBtn.classList.remove('fullscreen-active');
            }
        });

        updatePresentation();
    }
});