document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. INISIALISASI VARIABEL ---
    const profileImg = document.getElementById('profile-img');
    const profileName = document.getElementById('profile-name');
    const profileBio = document.getElementById('profile-bio');
    const linksContainer = document.getElementById('links-container');
    const footerText = document.getElementById('footer-text');
    
    const themeToggle = document.getElementById('theme-toggle');
    const langToggle = document.getElementById('lang-toggle');
    const langText = langToggle.querySelector('.lang-text');
    
    // Default State
    let currentLang = localStorage.getItem('romadz_lang') || 'id';
    let currentTheme = localStorage.getItem('romadz_theme') || 'light';

    // --- 2. FUNGSI RENDER UTAMA ---
    function renderContent() {
        // Render Profil
        profileImg.src = CONFIG.profile.image;
        profileName.textContent = CONFIG.profile.name;
        profileBio.textContent = CONFIG.texts[currentLang].subtitle;
        footerText.textContent = CONFIG.texts[currentLang].footer;

        // Render Button Bahasa
        langText.textContent = currentLang === 'id' ? 'ID' : 'EN';

        // Render Links
        linksContainer.innerHTML = ''; // Reset container
        
        let lastCategory = '';
        
        CONFIG.links.forEach((link, index) => {
            // Cek jika kategori berubah untuk menambah label
            if (link.category !== lastCategory) {
                const label = document.createElement('div');
                label.className = 'section-label';
                // Mengambil label kategori dari config
                const catKey = link.category; 
                label.textContent = CONFIG.texts[currentLang].sections[catKey] || catKey;
                linksContainer.appendChild(label);
                lastCategory = link.category;
            }

            // Buat Tombol Link
            const a = document.createElement('a');
            a.href = link.url;
            a.className = 'card-link';
            a.target = "_blank"; // Buka di tab baru
            a.rel = "noopener noreferrer";
            
            // Animasi Delay (Staggered effect saat load)
            a.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1}s`;
            a.style.opacity = '0'; // Awal transparan

            // Teks berdasarkan bahasa
            const linkTitle = currentLang === 'id' ? link.title_id : link.title_en;

            // HTML dalam tombol
            a.innerHTML = `
                <div class="card-icon" style="color: ${link.color}">
                    <i class="${link.icon}"></i>
                </div>
                <span class="card-text">${linkTitle}</span>
                <i class="fa-solid fa-chevron-right card-arrow"></i>
            `;

            // Event Listener: Animasi Klik
            a.addEventListener('click', function(e) {
                // Jangan preventDefault sepenuhnya agar link tetap jalan, 
                // tapi kita delay sedikit untuk lihat animasi jika perlu, 
                // atau biarkan berjalan bersamaan.
                
                // Tambahkan class animasi
                this.classList.add('active-click');

                // Efek Ripple manual (opsional, untuk mempercantik)
                createRipple(e, this);

                // Hapus class setelah animasi selesai (opsional)
                setTimeout(() => {
                    this.classList.remove('active-click');
                }, 2000);
            });

            linksContainer.appendChild(a);
        });
    }

    // --- 3. LOGIKA TEMA ---
    function applyTheme() {
        document.body.setAttribute('data-theme', currentTheme);
        const icon = themeToggle.querySelector('i');
        if (currentTheme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    themeToggle.addEventListener('click', () => {
        // Efek transisi seluruh halaman
        document.body.style.transition = 'background 0.5s ease, color 0.5s ease';
        
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('romadz_theme', currentTheme);
        applyTheme();
    });

    // --- 4. LOGIKA BAHASA ---
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'id' ? 'en' : 'id';
        localStorage.setItem('romadz_lang', currentLang);
        
        // Animasi fade out sebelum ganti teks
        linksContainer.style.opacity = '0';
        profileBio.style.opacity = '0';
        
        setTimeout(() => {
            renderContent();
            // Fade in kembali
            linksContainer.style.opacity = '1';
            profileBio.style.opacity = '1';
        }, 200);
    });

    // --- 5. ANIMASI TAMBAHAN ---
    // Keyframe untuk stagger animation link
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.4);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        @keyframes ripple {
            to { transform: scale(4); opacity: 0; }
        }
    `;
    document.head.appendChild(styleSheet);

    function createRipple(event, element) {
        const circle = document.createElement("span");
        const diameter = Math.max(element.clientWidth, element.clientHeight);
        const radius = diameter / 2;

        const rect = element.getBoundingClientRect();
        
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - rect.left - radius}px`;
        circle.style.top = `${event.clientY - rect.top - radius}px`;
        circle.classList.add("ripple");

        const ripple = element.getElementsByClassName("ripple")[0];
        if (ripple) {
            ripple.remove();
        }

        element.appendChild(circle);
    }

    // --- 6. RUN INIT ---
    applyTheme();
    renderContent();
});