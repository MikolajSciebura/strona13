document.addEventListener('DOMContentLoaded', () => {
    // Optimization: Cache common selectors
    const body = document.body;
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    const overlay = document.querySelector('.overlay');
    const menuToggle = document.querySelector('.menu-toggle');

    // Mobile Menu Toggle
    if (menuToggle && nav && overlay) {
        const toggleMenu = () => {
            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
            overlay.classList.toggle('active');
            if (header) header.classList.toggle('menu-open');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : 'auto';
        };

        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
        overlay.addEventListener('click', toggleMenu);

        // Close menu on link click
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
    }

// 📌 Wycena auta
const valuationForm = document.getElementById('valuation-form');
const fileInput = document.getElementById('car-photos');
const previewContainer = document.getElementById('file-preview-container');

if (valuationForm) {
    // 📸 Podgląd zdjęć
    fileInput.addEventListener('change', () => {
        previewContainer.innerHTML = '';
        Array.from(fileInput.files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.style.width = "100px";
                    img.style.borderRadius = "5px";
                    previewContainer.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        });
    });

    // 🖼️ Kompresja zdjęć
    async function compressImage(file) {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const maxWidth = 1200;
                    let width = img.width;
                    let height = img.height;
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.7);
                };
            };
            reader.readAsDataURL(file);
        });
    }

    // 🚀 Submit wyceny
    valuationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = valuationForm.querySelector('.btn-submit');
        const msgDiv = valuationForm.querySelector('#form-message');

        btn.disabled = true;
        btn.textContent = 'Wysyłanie...';
        msgDiv.textContent = '';
        msgDiv.className = 'form-message';

        const formData = new FormData();
        formData.append('form-type', 'valuation');
        formData.append('brand-model', valuationForm['brand-model'].value);
        formData.append('year', valuationForm['year'].value);
        formData.append('mileage', valuationForm['mileage'].value);
        formData.append('engine', valuationForm['engine'].value);
        formData.append('fuel', valuationForm['fuel'].value);
        formData.append('gearbox', valuationForm['gearbox'].value);
        formData.append('damaged', valuationForm['damaged'].checked ? 'Tak' : 'Nie');
        formData.append('description', valuationForm['description'].value);
        formData.append('phone', valuationForm['phone'].value);
        formData.append('website', valuationForm['website'].value);

        const files = fileInput.files;
        for (let file of files) {
            const compressed = await compressImage(file);
            formData.append('photos[]', compressed, file.name);
        }

        try {
            const res = await fetch('send.php', { method: 'POST', body: formData });
            const text = await res.text();
            if (text === "OK") {
                msgDiv.textContent = '✅ Wysłano pomyślnie!';
                msgDiv.classList.add('success');
                valuationForm.reset();
                previewContainer.innerHTML = '';
            } else {
                msgDiv.textContent = '❌ ' + text;
                msgDiv.classList.add('error');
            }
        } catch {
            msgDiv.textContent = '❌ Błąd połączenia';
            msgDiv.classList.add('error');
        }

        btn.disabled = false;
        btn.textContent = 'WYŚLIJ WYCENĘ';
    });
}

// 📌 Formularz kontaktowy
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('.btn-submit');
        const msgDiv = contactForm.querySelector('#form-message');

        btn.disabled = true;
        btn.textContent = 'Wysyłanie...';
        msgDiv.textContent = '';
        msgDiv.className = 'form-message';

        const formData = new FormData(contactForm);

        try {
            const res = await fetch('send.php', { method: 'POST', body: formData });
            const text = await res.text();
            if (text === "OK") {
                msgDiv.textContent = '✅ Wiadomość wysłana!';
                msgDiv.classList.add('success');
                contactForm.reset();
            } else {
                msgDiv.textContent = '❌ ' + text;
                msgDiv.classList.add('error');
            }
        } catch {
            msgDiv.textContent = '❌ Błąd połączenia';
            msgDiv.classList.add('error');
        }

        btn.disabled = false;
        btn.textContent = 'WYŚLIJ WIADOMOŚĆ';
    });
}


    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (nav && nav.classList.contains('active')) {
                    menuToggle.click();
                }
            }
        });
    });

    // Add scroll effect to header using IntersectionObserver to avoid scroll listener overhead
    if (header) {
        // Create a sentinel element to track scroll position
        const sentinel = document.createElement('div');
        sentinel.style.position = 'absolute';
        sentinel.style.top = '50px';
        sentinel.style.left = '0';
        sentinel.style.width = '1px';
        sentinel.style.height = '1px';
        sentinel.style.pointerEvents = 'none';
        sentinel.style.visibility = 'hidden';
        document.body.prepend(sentinel);

        const headerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        }, {
            root: null,
            threshold: 0
        });

        headerObserver.observe(sentinel);
    }

    // Initialize Swiper for Recent Buys
    if (document.querySelector('.buys-swiper')) {
        new Swiper('.buys-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
                1200: {
                    slidesPerView: 4,
                }
            },
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
        });
    }

    // Initialize Swiper for Testimonials
    if (document.querySelector('.testimonials-swiper')) {
        new Swiper('.testimonials-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            },
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
        });
    }

    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 20,
            disable: false,
            startEvent: 'DOMContentLoaded'
        });

        // Optimization: Use IntersectionObserver instead of scroll-based manual check
        const aosObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                    aosObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px 0px 100px 0px'
        });

        document.querySelectorAll('[data-aos]').forEach(el => {
            aosObserver.observe(el);
        });
    }
});
