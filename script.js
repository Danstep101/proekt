document.addEventListener('DOMContentLoaded', function() {

    const sections = document.querySelectorAll('.content-section');
    const navLinks = document.querySelectorAll('.main-nav a');
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    const navHeight = document.querySelector('.main-nav').offsetHeight;
    const cards = document.querySelectorAll('.card');
    const searchInput = document.getElementById('search-input');
    const hero = document.querySelector('.hero');

    // --- Оптимизация параллакса ---
    let ticking = false;

    function updateParallax() {
        const scrollY = window.scrollY;
        hero.style.backgroundPositionY = `${scrollY * 0.5}px`;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });

    // Intersection Observer для анимации появления и активного меню
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.href.includes(id)) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Плавный скролл при клике на ссылки
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            window.scrollTo({
                top: targetSection.offsetTop - navHeight,
                behavior: 'smooth'
            });
        });
    });

    // Кнопка "Наверх"
    window.addEventListener("scroll", () => {
        if (window.scrollY > navHeight) {
            scrollToTopBtn.style.display = "block";
        } else {
            scrollToTopBtn.style.display = "none";
        }
    });

    scrollToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // Модальные окна для карточек
    cards.forEach((card) => {
        const modal = card.querySelector('.modal');
        const closeBtn = card.querySelector('.close');

        // Открываем модальное окно по клику на карточку
        card.addEventListener('click', (e) => {
            // Убедимся, что клик был не по кнопке закрытия
            if (!e.target.closest('.close')) {
                modal.style.display = 'block';
            }
        });

        // Закрываем модальное окно
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Предотвращаем "всплытие" клика до карточки
            modal.style.display = 'none';
        });

        // Закрытие по клику вне окна
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Поиск по произведениям
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            card.style.display = title.includes(query) ? 'flex' : 'none';
        });
    });

});