document.addEventListener('DOMContentLoaded', function () {
  // --- Mobile Menu Toggle (Adapted for Flowbite-like structure) ---
  // Menggunakan selector yang lebih spesifik untuk hamburger di navbar utama
  const hamburger = document.querySelector(
    'nav.navbar .hamburger[data-collapse-toggle="navbar-default"]'
  );
  const mobileMenu = document.getElementById('navbar-default');
  // Dapatkan elemen nav-links desktop
  const desktopNavLinks = document.getElementById('navbar-desktop-links');

  if (hamburger && mobileMenu && desktopNavLinks) {
    hamburger.addEventListener('click', function () {
      const isMenuOpen = mobileMenu.classList.contains('active');

      if (isMenuOpen) {
        // Jika menu terbuka, hapus kelas 'active' untuk memulai transisi slide-out
        mobileMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        // Ubah ikon SVG menjadi bars (hamburger)
        hamburger.innerHTML = `
                    <span class="sr-only">Open main menu</span>
                    <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
                    </svg>
                `;
        document.body.style.overflow = 'auto'; // Kembalikan scrolling
      } else {
        // Jika menu tertutup, atur display menjadi flex terlebih dahulu, lalu tambahkan 'active'
        mobileMenu.style.display = 'flex'; // Jadikan terlihat untuk transisi
        // Paksa reflow untuk memastikan perubahan display berlaku sebelum transisi
        mobileMenu.offsetHeight;
        mobileMenu.classList.add('active'); // Tambahkan kelas 'active' untuk slide-in
        hamburger.setAttribute('aria-expanded', 'true');
        // Ubah ikon SVG menjadi times (tutup)
        hamburger.innerHTML = `
                    <span class="sr-only">Close main menu</span>
                    <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                `;
        document.body.style.overflow = 'hidden'; // Cegah scrolling saat menu terbuka
      }
    });

    // Tambahkan event listener untuk tombol hamburger di dalam mobile menu itu sendiri
    const mobileMenuHamburger = mobileMenu.querySelector('.hamburger');
    if (mobileMenuHamburger) {
      mobileMenuHamburger.addEventListener('click', function () {
        mobileMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.innerHTML = `
                <span class="sr-only">Open main menu</span>
                <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
                </svg>
            `; // Reset ikon hamburger utama
        document.body.style.overflow = 'auto'; // Kembalikan scrolling
      });
    }

    // Dengarkan akhir transisi untuk menyembunyikan elemen sepenuhnya
    mobileMenu.addEventListener('transitionend', (event) => {
      // Pastikan transisi adalah untuk properti 'transform' dan menu tidak aktif
      if (
        event.propertyName === 'transform' &&
        !mobileMenu.classList.contains('active')
      ) {
        mobileMenu.style.display = 'none'; // Sembunyikan sepenuhnya setelah transisi
      }
    });

    // Tutup menu mobile saat tautan diklik
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.innerHTML = `
                    <span class="sr-only">Open main menu</span>
                    <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
                    </svg>
                `; // Reset ikon hamburger
        document.body.style.overflow = 'auto'; // Kembalikan scrolling
      });
    });
  }

  // --- Initialize AOS animations ---
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100,
    });
  }

  // --- Enhanced Image Slider Functionality ---
  const initSlider = () => {
    const slider = document.querySelector('.slider');
    if (!slider) return;

    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.slider-dots'); // Pastikan elemen ini ada di HTML
    let currentIndex = 0;
    const slideCount = slides.length;
    let slideInterval;
    let isHovering = false;

    // Buat titik-titik untuk navigasi slider
    if (dotsContainer && slideCount > 1) {
      for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
          stopSlider();
          goToSlide(i);
          startSlider();
        });
        dotsContainer.appendChild(dot);
      }
    }

    // Perbarui posisi slider dan titik aktif
    const updateSlider = () => {
      slider.style.transform = `translateX(-${currentIndex * 100}%)`;

      // Perbarui titik aktif
      const dots = document.querySelectorAll('.slider-dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };

    // Pergi ke slide tertentu
    const goToSlide = (index) => {
      currentIndex = (index + slideCount) % slideCount;
      updateSlider();
    };

    // Slide berikutnya
    const nextSlide = () => {
      goToSlide(currentIndex + 1);
    };

    // Slide sebelumnya
    const prevSlide = () => {
      goToSlide(currentIndex - 1);
    };

    // Mulai geser otomatis
    const startSlider = () => {
      if (!isHovering && slideCount > 1) {
        stopSlider();
        slideInterval = setInterval(nextSlide, 5000);
      }
    };

    // Hentikan geser otomatis
    const stopSlider = () => {
      clearInterval(slideInterval);
    };

    // Inisialisasi slider
    if (slideCount > 0) {
      // Atur posisi awal
      updateSlider();

      // Mulai geser otomatis
      startSlider();

      // Jeda saat hover
      const sliderContainer = document.querySelector('.slider-container');
      if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => {
          isHovering = true;
          stopSlider();
        });

        sliderContainer.addEventListener('mouseleave', () => {
          isHovering = false;
          startSlider();
        });
      }

      // Kontrol tombol
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          stopSlider();
          nextSlide();
          startSlider();
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          stopSlider();
          prevSlide();
          startSlider();
        });
      }

      // Tangani navigasi keyboard
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
          stopSlider();
          nextSlide();
          startSlider();
        } else if (e.key === 'ArrowLeft') {
          stopSlider();
          prevSlide();
          startSlider();
        }
      });

      // Tangani geser untuk perangkat sentuh
      let touchStartX = 0;
      let touchEndX = 0;

      if (sliderContainer) {
        // Pastikan sliderContainer ada sebelum menambahkan listener
        sliderContainer.addEventListener(
          'touchstart',
          (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopSlider();
          },
          { passive: true }
        );

        sliderContainer.addEventListener(
          'touchend',
          (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startSlider();
          },
          { passive: true }
        );
      }

      const handleSwipe = () => {
        const threshold = 50;
        if (touchEndX < touchStartX - threshold) {
          nextSlide();
        } else if (touchEndX > touchStartX + threshold) {
          prevSlide();
        }
      };
    }
  };

  // Inisialisasi slider
  initSlider();

  // --- Fungsi tab untuk layanan game ---
  const gameTabBtns = document.querySelectorAll('.game-tabs .tab-btn');
  const gameTabContents = document.querySelectorAll(
    '.game-services .tab-content'
  ); // Dapatkan semua konten tab

  gameTabBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      const tabId = this.getAttribute('data-tab');

      // Hapus kelas aktif dari semua tombol
      gameTabBtns.forEach((b) => b.classList.remove('active'));
      // Tambahkan kelas aktif ke tombol yang diklik
      this.classList.add('active');

      // Sembunyikan semua konten tab dengan efek fade-out
      gameTabContents.forEach((tab) => {
        if (tab.style.display === 'block' || tab.classList.contains('active')) {
          // Hanya sembunyikan jika terlihat atau aktif
          tab.style.opacity = '0'; // Mulai fade-out
          // Setelah transisi, atur display ke none
          setTimeout(() => {
            tab.style.display = 'none';
            tab.classList.remove('active'); // Hapus kelas active setelah menyembunyikan
          }, 500); // Sesuaikan dengan durasi transisi CSS (0.5s)
        }
      });

      // Tampilkan konten tab yang dipilih dengan efek fade-in
      const contentToShow = document.getElementById(tabId);
      if (contentToShow) {
        contentToShow.style.display = 'block'; // Jadikan terlihat
        // Paksa reflow untuk memastikan display:block diterapkan sebelum transisi opacity
        contentToShow.offsetHeight;
        contentToShow.style.opacity = '1'; // Mulai fade-in
        contentToShow.classList.add('active'); // Tambahkan kelas active
      }

      // Picu AOS refresh untuk konten baru
      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }
    });
  });

  // Inisialisasi konten tab game pertama agar terlihat dan aktif saat dimuat
  const initialActiveGameTabContent = document.querySelector(
    '.game-services .tab-content.active'
  );
  if (initialActiveGameTabContent) {
    initialActiveGameTabContent.style.display = 'block';
    initialActiveGameTabContent.classList.add('active');
    initialActiveGameTabContent.style.opacity = '1'; // Pastikan opacity 1 saat inisialisasi
  }

  // --- Fungsi tab untuk portofolio ---
  const portfolioTabBtns = document.querySelectorAll(
    '.portfolio-tabs .tab-btn'
  );
  if (portfolioTabBtns.length > 0) {
    // Atur tab aktif default
    const defaultTab = document.querySelector(
      '.portfolio-tabs .tab-btn[data-tab="all"]'
    );
    if (defaultTab) defaultTab.classList.add('active');

    portfolioTabBtns.forEach((btn) => {
      btn.addEventListener('click', function () {
        const filter = this.getAttribute('data-tab');

        // Hapus kelas aktif dari semua tombol
        portfolioTabBtns.forEach((btn) => btn.classList.remove('active'));
        // Tambahkan kelas aktif ke tombol yang diklik
        this.classList.add('active');

        const portfolioItems = document.querySelectorAll('.portfolio-item');
        portfolioItems.forEach((item) => {
          if (
            filter === 'all' ||
            item.getAttribute('data-category') === filter
          ) {
            item.style.display = 'block';
            item.setAttribute('data-aos', 'fade-up');
          } else {
            item.style.display = 'none';
            item.removeAttribute('data-aos');
          }
        });

        // Refresh AOS setelah memfilter
        if (typeof AOS !== 'undefined') {
          AOS.refresh();
        }
      });
    });
  }

  // --- Smooth scrolling untuk tautan anchor ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      // Logika ini hanya berlaku untuk tautan internal (misalnya, <a href="#section-id">)
      console.log('Internal anchor clicked:', this.href); // Log untuk debugging
      e.preventDefault();

      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Tutup menu mobile jika terbuka
        const mobileMenu = document.getElementById('navbar-default'); // Target ID menu mobile baru
        const mainHamburger = document.querySelector(
          'nav.navbar .hamburger[data-collapse-toggle="navbar-default"]'
        ); // Hamburger utama

        if (mobileMenu && mobileMenu.classList.contains('active')) {
          mobileMenu.classList.remove('active');
          if (mainHamburger) {
            mainHamburger.setAttribute('aria-expanded', 'false');
            mainHamburger.innerHTML = `
                        <span class="sr-only">Open main menu</span>
                        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
                        </svg>
                    `;
          }
          document.body.style.overflow = 'auto';
        }

        window.scrollTo({
          top: targetElement.offsetTop - 80, // Sesuaikan untuk tinggi navbar tetap
          behavior: 'smooth',
        });

        // Perbarui URL tanpa me-refresh
        if (history.pushState) {
          history.pushState(null, null, targetId);
        } else {
          location.hash = targetId;
        }
      }
    });
  });

  // --- Logika untuk semua klik tautan untuk debugging ---
  document.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', function (e) {
      console.log('Link clicked:', this.href);
      // Jika tautan adalah ke halaman lain dengan hash (misal: pricing.html#hsr),
      // biarkan browser menangani navigasi secara default.
      // e.preventDefault() hanya dipanggil untuk tautan internal di atas.
    });
  });

  // --- Navbar lengket saat scroll ---
  window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('sticky');
        // Bayangan kotak ditangani oleh CSS kustom sekarang
      } else {
        navbar.classList.remove('sticky');
        // Bayangan kotak ditangani oleh CSS kustom sekarang
      }
    }
  });

  // --- Penanganan formulir untuk halaman pesanan ---
  const orderForm = document.getElementById('boostingOrderForm');
  if (orderForm) {
    // Tampilkan/sembunyikan layanan berdasarkan pilihan game
    const gameSelect = document.getElementById('game');
    const genshinServices = document.getElementById('genshin-services');
    const hsrServices = document.getElementById('hsr-services');

    // Sembunyikan semua grup layanan pada awalnya
    if (genshinServices && hsrServices) {
      genshinServices.style.display = 'none';
      hsrServices.style.display = 'none';

      gameSelect.addEventListener('change', function () {
        // Sembunyikan semua grup layanan
        genshinServices.style.display = 'none';
        hsrServices.style.display = 'none';

        // Tampilkan layanan game yang dipilih
        if (this.value === 'genshin') {
          genshinServices.style.display = 'block';
        } else if (this.value === 'hsr') {
          hsrServices.style.display = 'block';
        }

        // Reset pilihan layanan
        document.getElementById('service').value = '';
      });

      // Periksa parameter URL untuk pra-pemilihan
      const urlParams = new URLSearchParams(window.location.search);
      const gameParam = urlParams.get('game');
      const serviceParam = urlParams.get('service');

      if (gameParam) {
        gameSelect.value = gameParam;
        gameSelect.dispatchEvent(new Event('change'));

        if (serviceParam) {
          document.getElementById('service').value = serviceParam;
        }
      }
    }

    // Pengiriman Pesanan WhatsApp
    const whatsappBtn = document.getElementById('whatsappSubmit');
    if (whatsappBtn) {
      whatsappBtn.addEventListener('click', function (e) {
        e.preventDefault();

        // Validasi formulir
        if (!orderForm.checkValidity()) {
          orderForm.reportValidity();
          return;
        }

        // Dapatkan nilai formulir
        const formData = {
          name: document.getElementById('name').value.trim(),
          game: document.getElementById('game').value,
          service: document.getElementById('service').value,
          uid: document.getElementById('uid').value.trim(),
          server: document.getElementById('server').value,
          whatsapp: document.getElementById('whatsapp').value.trim(),
          notes:
            document.getElementById('notes').value.trim() ||
            'Tidak ada catatan',
        };

        // Validasi nomor WhatsApp
        if (!/^(\+62|62|0)[0-9]{9,12}$/.test(formData.whatsapp)) {
          // Menggunakan modal/kotak pesan kustom alih-alih alert()
          const messageBox = document.createElement('div');
          messageBox.style.cssText = `
                        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                        background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;
                        padding: 15px; border-radius: 5px; z-index: 9999;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        font-family: 'Poppins', sans-serif;
                    `;
          messageBox.innerHTML = `
                        <p>Nomor WhatsApp tidak valid. Harap masukkan nomor Indonesia yang valid.</p>
                        <button style="background-color: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; margin-top: 10px;">Tutup</button>
                    `;
          document.body.appendChild(messageBox);
          messageBox.querySelector('button').addEventListener('click', () => {
            messageBox.remove();
          });
          return;
        }

        // Format nomor WhatsApp
        let whatsappNumber = formData.whatsapp;
        if (whatsappNumber.startsWith('0')) {
          whatsappNumber = '62' + whatsappNumber.substring(1);
        } else if (whatsappNumber.startsWith('+62')) {
          whatsappNumber = whatsappNumber.substring(1);
        } else if (!whatsappNumber.startsWith('62')) {
          whatsappNumber = '62' + whatsappNumber;
        }

        // Pemetaan game dan layanan
        const gameMap = {
          genshin: 'Genshin Impact',
          hsr: 'Honkai: Star Rail',
        };

        const serviceMap = {
          'ar-leveling': 'AR Leveling',
          'spiral-abyss': 'Spiral Abyss 36★',
          'daily-commissions': 'Daily Commissions',
          'boss-farming': 'Boss Farming',
          'artifact-farming': 'Artifact Farming',
          'simulated-universe': 'Simulated Universe',
          'relic-farming': 'Relic Farming',
          'trailblaze-mission': 'Trailblaze Mission',
          'weekly-boss': 'Weekly Boss',
          'forgotten-hall': 'Forgotten Hall',
        };

        // Format pesan WhatsApp
        const whatsappMessage = `*PESANAN JOKI SHIRAORI*\n\n� *Detail Pemesan:*\n├ Nama: ${
          formData.name
        }\n└ WhatsApp: ${formData.whatsapp}\n\n🎮 *Detail Game:*\n├ Game: ${
          gameMap[formData.game]
        }\n├ Layanan: ${serviceMap[formData.service]}\n├ UID: ${
          formData.uid
        }\n└ Server: ${formData.server}\n\n📝 *Catatan:*\n${
          formData.notes
        }\n\n_Silahkan konfirmasi ketersediaan dan detail pembayaran_`;

        // Encode untuk URL
        const encodedMessage = encodeURIComponent(whatsappMessage);

        // Buka WhatsApp
        window.open(
          `https://wa.me/${whatsappNumber}?text=${encodedMessage}`,
          '_blank'
        );
      });
    }
  }

  // --- Lazy loading untuk gambar ---
  const lazyImages = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach((img) => imageObserver.observe(img));
  } else {
    // Fallback untuk browser tanpa IntersectionObserver
    lazyImages.forEach((img) => {
      img.src = img.getAttribute('data-src');
      img.removeAttribute('data-src');
    });
  }
});

// Di main.js
// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function () {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const closeMobileMenuButton = document.getElementById('close-mobile-menu');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuOverlay = document.createElement('div');

  mobileMenuOverlay.classList.add('mobile-menu-overlay');
  document.body.appendChild(mobileMenuOverlay);

  function toggleMobileMenu() {
    mobileMenu.classList.toggle('translate-x-full');
    mobileMenuOverlay.classList.toggle('active');
    document.body.classList.toggle('overflow-hidden');
  }

  mobileMenuButton.addEventListener('click', toggleMobileMenu);
  closeMobileMenuButton.addEventListener('click', toggleMobileMenu);
  mobileMenuOverlay.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when clicking on links
  document.querySelectorAll('.nav-link-mobile').forEach((link) => {
    link.addEventListener('click', toggleMobileMenu);
  });
});

// Di main.js
// Enhanced Slider Functionality
document.addEventListener('DOMContentLoaded', function () {
  const sliderWrapper = document.querySelector('.slider-wrapper');
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevArrow = document.querySelector('.slider-arrow.left-4');
  const nextArrow = document.querySelector('.slider-arrow.right-4');

  let currentIndex = 0;
  const slideCount = slides.length;
  let slideInterval;

  // Initialize slider
  function initSlider() {
    updateSlider();
    startAutoSlide();

    // Click handlers for dots
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        goToSlide(index);
      });
    });

    // Arrow navigation
    if (prevArrow) {
      prevArrow.addEventListener('click', prevSlide);
    }

    if (nextArrow) {
      nextArrow.addEventListener('click', nextSlide);
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    });

    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    sliderWrapper.addEventListener(
      'touchstart',
      (e) => {
        touchStartX = e.changedTouches[0].clientX;
        clearInterval(slideInterval);
      },
      { passive: true }
    );

    sliderWrapper.addEventListener(
      'touchend',
      (e) => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
        startAutoSlide();
      },
      { passive: true }
    );
  }

  function updateSlider() {
    sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update active dot
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = (index + slideCount) % slideCount;
    updateSlider();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function startAutoSlide() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
  }

  function handleSwipe() {
    const threshold = 50;
    if (touchEndX < touchStartX - threshold) {
      nextSlide();
    } else if (touchEndX > touchStartX + threshold) {
      prevSlide();
    }
  }

  // Initialize if slider exists
  if (sliderWrapper) {
    initSlider();
  }
});

// Di main.js
// Game Tabs Functionality
document.addEventListener('DOMContentLoaded', function () {
  const tabButtons = document.querySelectorAll('.game-tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');

      // Update active tab button
      tabButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      // Show corresponding tab content
      tabContents.forEach((content) => {
        content.classList.add('hidden');
        content.classList.remove('active');
      });

      const activeTab = document.getElementById(`${tabId}-tab`);
      if (activeTab) {
        activeTab.classList.remove('hidden');
        activeTab.classList.add('active');

        // Refresh animations if needed
        if (typeof AOS !== 'undefined') {
          AOS.refresh();
        }
      }
    });
  });
});
