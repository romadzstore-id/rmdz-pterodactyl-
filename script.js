// Inisialisasi website
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi tema
    initTheme();
    
    // Inisialisasi bahasa
    initLanguage();
    
    // Inisialisasi logo
    initLogo();
    
    // Setup interaksi tombol
    setupButtons();
    
    // Tambahkan efek animasi pada elemen
    addAnimations();
});

// Fungsi untuk inisialisasi tema
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');
    
    // Set tema berdasarkan localStorage atau preferensi sistem
    if (savedTheme) {
        document.body.classList.toggle('dark-theme', savedTheme === CONFIG.theme.dark);
        themeToggle.checked = savedTheme === CONFIG.theme.dark;
    } else {
        // Cek preferensi sistem
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.classList.toggle('dark-theme', prefersDark);
        themeToggle.checked = prefersDark;
        localStorage.setItem('theme', prefersDark ? CONFIG.theme.dark : CONFIG.theme.light);
    }
    
    // Tambahkan event listener untuk toggle tema
    themeToggle.addEventListener('change', function() {
        const isDarkMode = this.checked;
        document.body.classList.toggle('dark-theme', isDarkMode);
        localStorage.setItem('theme', isDarkMode ? CONFIG.theme.dark : CONFIG.theme.light);
        
        // Animasi toggle
        document.body.style.transition = 'all 0.5s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 500);
    });
}

// Fungsi untuk inisialisasi bahasa
function initLanguage() {
    const langButtons = document.querySelectorAll('.language-btn');
    const savedLanguage = localStorage.getItem('language') || CONFIG.language.default;
    
    // Set bahasa awal
    CONFIG.language.current = savedLanguage;
    updateLanguage(savedLanguage);
    
    // Set tombol bahasa aktif
    langButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === savedLanguage);
        
        // Event listener untuk tombol bahasa
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            
            // Update bahasa
            updateLanguage(lang);
            CONFIG.language.current = lang;
            localStorage.setItem('language', lang);
            
            // Update tampilan tombol
            langButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Animasi perubahan bahasa
            document.querySelector('.main-content').style.opacity = '0.7';
            setTimeout(() => {
                document.querySelector('.main-content').style.opacity = '1';
                document.querySelector('.main-content').style.transition = 'opacity 0.3s ease';
            }, 10);
        });
    });
}

// Fungsi untuk memperbarui teks berdasarkan bahasa
function updateLanguage(lang) {
    const texts = CONFIG[lang];
    
    // Update semua elemen dengan id yang sesuai
    document.getElementById('site-title').textContent = texts.siteTitle;
    document.getElementById('site-subtitle').textContent = texts.siteSubtitle;
    document.getElementById('upload-text').textContent = texts.uploadText;
    document.getElementById('contact-title').textContent = texts.contactTitle;
    document.getElementById('whatsapp-title').textContent = texts.whatsappTitle;
    document.getElementById('whatsapp-subtitle').textContent = texts.whatsappSubtitle;
    document.getElementById('telegram-title').textContent = texts.telegramTitle;
    document.getElementById('telegram-subtitle').textContent = texts.telegramSubtitle;
    document.getElementById('marketplace-title').textContent = texts.marketplaceTitle;
    document.getElementById('marketplace-subtitle').textContent = texts.marketplaceSubtitle;
    document.getElementById('marketplace-1').textContent = texts.marketplace1;
    document.getElementById('marketplace-2').textContent = texts.marketplace2;
    document.getElementById('marketplace-3').textContent = texts.marketplace3;
    document.getElementById('marketplace-4').textContent = texts.marketplace4;
    document.getElementById('marketplace-5').textContent = texts.marketplace5;
    document.getElementById('stock-title').textContent = texts.stockTitle;
    document.getElementById('stock-group').textContent = texts.stockGroup;
    document.getElementById('stock-subtitle').textContent = texts.stockSubtitle;
    document.getElementById('channel-title').textContent = texts.channelTitle;
    document.getElementById('channel-name').textContent = texts.channelName;
    document.getElementById('channel-subtitle').textContent = texts.channelSubtitle;
    document.getElementById('copyright').textContent = texts.copyright;
    document.getElementById('footer-note').textContent = texts.footerNote;
}

// Fungsi untuk inisialisasi logo
function initLogo() {
    const logoImage = document.getElementById('logo-image');
    const logoUploadInput = document.getElementById('logo-upload');
    const logoInner = document.querySelector('.logo-inner');
    
    // Cek apakah ada logo yang disimpan di localStorage
    const savedLogo = localStorage.getItem('customLogo');
    
    if (savedLogo) {
        // Tampilkan logo yang disimpan
        logoImage.src = savedLogo;
        logoImage.classList.add('loaded');
        logoInner.classList.add('has-image');
        CONFIG.logo.uploaded = true;
        CONFIG.logo.defaultImage = savedLogo;
    }
    
    // Event listener untuk upload logo
    logoUploadInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            // Validasi tipe file
            if (!file.type.match('image.*')) {
                alert('Silakan pilih file gambar (JPG, PNG, GIF, dll).');
                return;
            }
            
            // Validasi ukuran file (maksimal 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('Ukuran file terlalu besar. Maksimal 2MB.');
                return;
            }
            
            const reader = new FileReader();
            
            reader.onload = function(event) {
                // Simpan logo ke localStorage
                const logoDataUrl = event.target.result;
                localStorage.setItem('customLogo', logoDataUrl);
                
                // Tampilkan logo
                logoImage.src = logoDataUrl;
                logoImage.classList.add('loaded');
                logoInner.classList.add('has-image');
                CONFIG.logo.uploaded = true;
                CONFIG.logo.defaultImage = logoDataUrl;
                
                // Animasi logo
                logoInner.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    logoInner.style.transform = 'scale(1)';
                    logoInner.style.transition = 'transform 0.3s ease';
                }, 300);
                
                // Tampilkan notifikasi sukses
                showNotification('Logo berhasil diunggah!', 'success');
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // Tambahkan event listener untuk menghapus logo dengan klik kanan
    logoImage.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        
        if (CONFIG.logo.uploaded) {
            if (confirm('Hapus logo custom?')) {
                // Hapus logo dari localStorage
                localStorage.removeItem('customLogo');
                
                // Reset logo ke default
                logoImage.src = '';
                logoImage.classList.remove('loaded');
                logoInner.classList.remove('has-image');
                CONFIG.logo.uploaded = false;
                CONFIG.logo.defaultImage = '';
                
                // Tampilkan notifikasi
                showNotification('Logo direset ke default', 'info');
            }
        }
    });
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message, type) {
    // Hapus notifikasi sebelumnya jika ada
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Buat elemen notifikasi
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 500;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Hapus notifikasi setelah 3 detik
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Animasi untuk notifikasi
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Fungsi untuk setup interaksi tombol
function setupButtons() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        // Efek ripple saat tombol diklik
        button.addEventListener('click', function(e) {
            // Cegah navigasi langsung untuk animasi
            e.preventDefault();
            
            // Buat efek ripple
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            // DIREVISI: Hapus animasi RGB, ganti dengan efek yang lebih elegan
            this.classList.add('active');
            
            // Animasi ikon yang lebih halus
            const icon = this.querySelector('.btn-icon i');
            icon.style.transform = 'scale(1.15)';
            setTimeout(() => {
                icon.style.transform = 'scale(1)';
                icon.style.transition = 'transform 0.3s ease';
            }, 300);
            
            // Hapus ripple setelah animasi selesai
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Hapus kelas active setelah animasi selesai
            setTimeout(() => {
                this.classList.remove('active');
                
                // Navigasi ke link setelah animasi selesai
                const href = this.getAttribute('href');
                setTimeout(() => {
                    window.open(href, '_blank');
                }, 200);
            }, 800);
        });
        
        // Efek hover pada ikon
        button.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.btn-icon i');
            icon.style.transform = 'rotate(5deg) scale(1.05)';
            icon.style.transition = 'transform 0.3s ease';
        });
        
        button.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.btn-icon i');
            icon.style.transform = 'rotate(0deg) scale(1)';
        });
    });
}

// Fungsi untuk menambahkan animasi elemen
function addAnimations() {
    // Animasi untuk elemen header
    const headerElements = document.querySelectorAll('.logo-avatar, .site-title, .site-subtitle, .logo-upload-container');
    
    headerElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100 + index * 200);
    });
    
    // Animasi untuk tombol secara berurutan
    const buttons = document.querySelectorAll('.btn');
    
    setTimeout(() => {
        buttons.forEach((btn, index) => {
            btn.style.opacity = '0';
            btn.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                btn.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                btn.style.opacity = '1';
                btn.style.transform = 'translateY(0)';
            }, 300 + index * 100);
        });
    }, 800);
    
    // Animasi untuk footer
    setTimeout(() => {
        const footer = document.querySelector('.footer');
        footer.style.opacity = '0';
        
        setTimeout(() => {
            footer.style.transition = 'opacity 0.8s ease';
            footer.style.opacity = '1';
        }, 1500);
    }, 1000);
}