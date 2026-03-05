document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('hero-canvas');
    const context = canvas.getContext('2d');
    const preloadProgress = document.querySelector('.loader-progress');
    const preloader = document.getElementById('preloader');

    // Config
    const isMobile = window.innerWidth < 768;
    const frameCount = isMobile ? 240 : 41;
    const frames = [];
    const currentFrame = { index: 0 };

    // Load frames
    let loadedCount = 0;

    const preloadImages = () => {
        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            if (isMobile) {
                img.src = `assets/mobile-frames/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
            } else {
                img.src = `assets/frames/frame-${i.toString().padStart(2, '0')}.jpg`;
            }
            img.onload = () => {
                loadedCount++;
                const progress = (loadedCount / frameCount) * 100;
                preloadProgress.style.width = `${progress}%`;

                if (loadedCount === frameCount) {
                    setTimeout(() => {
                        preloader.classList.add('hidden');
                        render();
                        initInteractions();
                    }, 500);
                }
            };
            frames.push(img);
        }
    };

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        render();
    };

    const render = () => {
        const img = frames[currentFrame.index];
        if (!img) return;

        const canvasAspect = canvas.width / canvas.height;
        const imgAspect = img.width / img.height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasAspect > imgAspect) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgAspect;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        } else {
            drawHeight = canvas.height;
            drawWidth = canvas.height * imgAspect;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    const initInteractions = () => {
        // Autoplay on Mobile
        if (isMobile) {
            let lastTime = 0;
            const fps = 30; // Frames per second
            const interval = 1000 / fps;

            const animate = (time) => {
                const delta = time - lastTime;
                if (delta > interval) {
                    currentFrame.index = (currentFrame.index + 1) % frameCount;
                    render();
                    lastTime = time - (delta % interval);
                }
                requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }

        // Scroll Reveal
        const revealElements = document.querySelectorAll('.reveal-up, .reveal-up-stagger, .slide-in-right');

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => revealObserver.observe(el));

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Hero Interaction (Desktop only)
        if (!isMobile) {
            const heroSection = document.querySelector('.hero-section');
            const handleFrameUpdate = (clientX) => {
                const rect = heroSection.getBoundingClientRect();
                const x = clientX - rect.left;
                const percent = Math.max(0, Math.min(1, x / rect.width));

                const index = Math.min(
                    frameCount - 1,
                    Math.floor(percent * frameCount)
                );

                if (index !== currentFrame.index && index >= 0) {
                    currentFrame.index = index;
                    render();
                }
            };

            heroSection.addEventListener('mousemove', (e) => {
                handleFrameUpdate(e.clientX);
            });
        }

        // Mobile Menu Toggle
        const mobileToggle = document.querySelector('.mobile-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        const body = document.body;

        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Close menu on link click
        const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                body.style.overflow = 'auto';
            });
        });

        // Parallax depth effect for hero text
        window.addEventListener('scroll', () => {
            const parallaxText = document.querySelector('.parallax-text');
            const scrolled = window.scrollY;
            if (parallaxText) {
                // Slower parallax for mobile to avoid overlap
                const speed = window.innerWidth < 768 ? 0.15 : 0.3;
                parallaxText.style.transform = `translateY(${scrolled * speed}px)`;
                parallaxText.style.opacity = 1 - (scrolled / 500);
            }
        });
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    preloadImages();
});
