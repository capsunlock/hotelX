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
            const desktopThemeSwitcher = document.getElementById('theme-switcher-desktop');
            const mobileThemeSwitcher = document.getElementById('theme-switcher-mobile');
            const mobileMoonIcon = document.getElementById('moon-icon-mobile');
            const mobileSunIcon = document.getElementById('sun-icon-mobile');
            const desktopMoonIcon = document.getElementById('moon-icon');
            const desktopSunIcon = document.getElementById('sun-icon');
            const navTitle = document.querySelector('.nav-title');

            function toggleTheme() {
                if (body.dataset.theme === 'light') {
                    // Switch to Dark Theme
                    body.dataset.theme = 'dark';
                    nav.style.backgroundColor = 'rgba(31, 35, 37, 0.5)';
                    if(navTitle) navTitle.style.color = 'var(--color-text-primary-dark)';
                    mobileMenuContainer.style.backgroundColor = 'var(--color-background-dark)';
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
                    if(navTitle) navTitle.style.color = 'var(--color-text-primary-light)';
                    mobileMenuContainer.style.backgroundColor = 'var(--color-background-light)';
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
                    // Adjust container height after adding new content
                    setTimeout(adjustContainerHeight, 100); 
                });
            }

            // --- Slideshow Logic ---
            const slideshowContainer = document.getElementById('slideshow-container');
            const dots = document.querySelectorAll('.dot');
            const navLinks = document.querySelectorAll('.nav-link');
            const sections = document.querySelectorAll('.slideshow-section');
            const heroSection = document.querySelector('header');

            let currentSlideIndex = 0;
            let slideshowInterval;
            let isPaused = false;
            let resizeTimer; // Timer for debouncing the resize event
            
            function adjustContainerHeight() {
                if (sections[currentSlideIndex]) {
                    const activeSectionHeight = sections[currentSlideIndex].offsetHeight;
                    slideshowContainer.style.height = `${activeSectionHeight}px`;
                }
            }

            function updateSlideshow(index) {
                // Ensure the index is within the valid range (0, 1, 2)
                currentSlideIndex = (index + sections.length) % sections.length;
                const offset = currentSlideIndex * -100;
                slideshowContainer.style.transform = `translateX(${offset}vw)`;

                // Adjust the container's height to the new section's height
                adjustContainerHeight();

                // Update dot highlights
                dots.forEach((dot) => {
                    dot.classList.remove('active');
                    if (parseInt(dot.dataset.index, 10) === currentSlideIndex) {
                        dot.classList.add('active');
                    }
                });

                // Update nav link glows for both desktop and mobile
                navLinks.forEach((link) => {
                    link.classList.remove('nav-link-glow');
                    if (parseInt(link.dataset.index, 10) === currentSlideIndex) {
                        link.classList.add('nav-link-glow');
                    }
                });
            }

            function startSlideshow() {
                clearInterval(slideshowInterval);
                slideshowInterval = setInterval(() => {
                    if (!isPaused) {
                        updateSlideshow(currentSlideIndex + 1);
                    }
                }, 24000);
            }

            // Add click listeners to dots
            dots.forEach(dot => {
                dot.addEventListener('click', (event) => {
                    const index = parseInt(event.target.dataset.index, 10);
                    updateSlideshow(index);
                    startSlideshow(); // Restart the timer after manual click
                });
            });

            // Add a single click listener to ALL nav links (desktop and mobile)
            navLinks.forEach(link => {
                link.addEventListener('click', (event) => {
                    event.preventDefault(); // Prevent default anchor link behavior
                    const index = parseInt(event.target.dataset.index, 10);
                    if (index < 3) {
                        updateSlideshow(index);
                    }
                    startSlideshow(); // Restart the timer after manual click

                    // Check if the clicked link is in the mobile menu and close it
                    if (link.closest('#mobile-menu-container')) {
                        mobileMenuContainer.classList.remove('open');
                        backdrop.classList.add('hidden');
                    }
                });
            });
            
            // Hero section observer to start slideshow when visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        startSlideshow();
                    } else {
                        clearInterval(slideshowInterval);
                    }
                });
            }, { threshold: 0.5 });
            observer.observe(heroSection);

            // Pause/Resume on hover
            slideshowContainer.addEventListener('mouseenter', () => {
                isPaused = true;
                clearInterval(slideshowInterval);
            });
            slideshowContainer.addEventListener('mouseleave', () => {
                isPaused = false;
                startSlideshow();
            });

            // Adjust height on window resize with a debounce
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(adjustContainerHeight, 150); // Wait 150ms after resize stops
            });

            // Initial setup with a small delay to allow for mobile rendering
            setTimeout(() => {
                updateSlideshow(0);
            }, 200);
        };