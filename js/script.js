   window.onload = function() {
            // --- Mobile Menu Logic ---
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const closeMenuButton = document.getElementById('close-menu-button');
            const mobileMenuContainer = document.getElementById('mobile-menu-container');
            const backdrop = document.getElementById('backdrop');

            if (mobileMenuButton) {
                mobileMenuButton.addEventListener('click', () => {
                    mobileMenuContainer.classList.add('open');
                    backdrop.classList.remove('hidden');
                });
            }

            if (closeMenuButton) {
                closeMenuButton.addEventListener('click', () => {
                    mobileMenuContainer.classList.remove('open');
                    backdrop.classList.add('hidden');
                });
            }

            if (backdrop) {
                backdrop.addEventListener('click', () => {
                    mobileMenuContainer.classList.remove('open');
                    backdrop.classList.add('hidden');
                });
            }
            
            // --- Theme Switcher Logic ---
            const body = document.body;
            const nav = document.querySelector('nav');
            const mobileMenu = document.getElementById('mobile-menu-container');
            const desktopThemeSwitcher = document.getElementById('theme-switcher-desktop');
            const mobileThemeSwitcher = document.getElementById('theme-switcher-mobile');
            const mobileMoonIcon = document.getElementById('moon-icon-mobile');
            const mobileSunIcon = document.getElementById('sun-icon-mobile');
            const desktopMoonIcon = document.getElementById('moon-icon');
            const desktopSunIcon = document.getElementById('sun-icon');
            const navTitle = document.querySelector('nav h2');
            
            function toggleTheme() {
                if (body.dataset.theme === 'light') {
                    // Switch to Dark Theme
                    body.dataset.theme = 'dark';
                    nav.style.backgroundColor = 'rgba(31, 35, 37, 0.5)';
                    navTitle.style.color = 'var(--color-text-primary-dark)';
                    mobileMenu.style.backgroundColor = 'var(--color-background-dark)';
                    desktopThemeSwitcher.style.backgroundColor = 'var(--color-text-primary-dark)';
                    desktopThemeSwitcher.style.color = 'var(--color-background-dark)';
                    mobileThemeSwitcher.style.backgroundColor = 'var(--color-text-primary-dark)';
                    mobileThemeSwitcher.style.color = 'var(--color-background-dark)';
                    
                    mobileMoonIcon.classList.remove('hidden');
                    mobileSunIcon.classList.add('hidden');
                    desktopMoonIcon.classList.remove('hidden');
                    desktopSunIcon.classList.add('hidden');
                    
                } else {
                    // Switch to Light Theme
                    body.dataset.theme = 'light';
                    nav.style.backgroundColor = 'rgba(248, 247, 244, 0.5)';
                    navTitle.style.color = 'var(--color-text-primary-light)';
                    mobileMenu.style.backgroundColor = 'var(--color-background-light)';
                    desktopThemeSwitcher.style.backgroundColor = 'var(--color-text-primary-light)';
                    desktopThemeSwitcher.style.color = 'var(--color-background-light)';
                    mobileThemeSwitcher.style.backgroundColor = 'var(--color-text-primary-light)';
                    mobileThemeSwitcher.style.color = 'var(--color-background-light)';

                    mobileMoonIcon.classList.add('hidden');
                    mobileSunIcon.classList.remove('hidden');
                    desktopMoonIcon.classList.add('hidden');
                    desktopSunIcon.classList.remove('hidden');
                }
            }

            desktopThemeSwitcher.addEventListener('click', toggleTheme);
            mobileThemeSwitcher.addEventListener('click', toggleTheme);

            // --- Gallery "Show More" Logic ---
            const showMoreBtn = document.getElementById('show-more-btn');
            const hiddenImages = document.querySelectorAll('.more-gallery-item');

            if (showMoreBtn) {
                showMoreBtn.addEventListener('click', () => {
                    hiddenImages.forEach(image => {
                        image.classList.remove('hidden');
                    });
                    showMoreBtn.classList.add('hidden');
                });
            }

            // --- Slideshow Logic ---
            const slideshowContainer = document.getElementById('slideshow-container');
            const dots = document.querySelectorAll('.dot');
            const navLinks = document.querySelectorAll('.nav-link');
            const sections = document.querySelectorAll('.slideshow-section');

            let currentSlideIndex = 0;
            let slideshowInterval;

            function updateSlideshow(index) {
                // Ensure the index is within the valid range (0, 1, 2)
                currentSlideIndex = (index + sections.length) % sections.length;
                const offset = currentSlideIndex * -100;
                slideshowContainer.style.transform = `translateX(${offset}vw)`;

                // Update dot highlights
                dots.forEach((dot, dotIndex) => {
                    dot.classList.remove('active');
                    if (dotIndex === currentSlideIndex) {
                        dot.classList.add('active');
                    }
                });

                // Update nav link glows
                navLinks.forEach((link, linkIndex) => {
                    link.classList.remove('nav-link-glow');
                    if (linkIndex === currentSlideIndex) {
                        link.classList.add('nav-link-glow');
                    }
                });
            }

            function startSlideshow() {
                clearInterval(slideshowInterval);
                slideshowInterval = setInterval(() => {
                    updateSlideshow(currentSlideIndex + 1);
                }, 6000);
            }

            // Add click listeners to dots
            dots.forEach(dot => {
                dot.addEventListener('click', (event) => {
                    const index = parseInt(event.target.dataset.index, 10);
                    updateSlideshow(index);
                    startSlideshow(); // Restart the timer after manual click
                });
            });

            // Add click listeners to nav links
            navLinks.forEach(link => {
                link.addEventListener('click', (event) => {
                    event.preventDefault(); // Prevent default anchor link behavior
                    const index = parseInt(event.target.dataset.index, 10);
                    if (index < 3) {
                       updateSlideshow(index);
                    }
                    startSlideshow(); // Restart the timer after manual click
                });
            });

            // Pause/Resume on hover
            slideshowContainer.addEventListener('mouseenter', () => {
                clearInterval(slideshowInterval);
            });
            slideshowContainer.addEventListener('mouseleave', () => {
                startSlideshow();
            });

            
            // Initial setup
            updateSlideshow(0);
            startSlideshow();
        };
