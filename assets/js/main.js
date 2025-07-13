// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      // Toggle 'active' class for sliding effect
      const isMenuOpen = mobileMenu.classList.contains('active');
      if (isMenuOpen) {
        mobileMenu.classList.remove('active');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.style.overflow = 'auto'; // Enable scrolling
      } else {
        mobileMenu.classList.add('active');
        hamburger.innerHTML = '<i class="fas fa-times"></i>';
        document.body.style.overflow = 'hidden'; // Disable scrolling
      }
    });

    // Close mobile menu when clicking on a link
    const mobileLinks = document.querySelectorAll('.mobile-menu a');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('active');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.style.overflow = 'auto';
      });
    });
  }

  // Initialize AOS animations
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100,
    });
  }

  // Enhanced Image Slider Functionality for Hero Section
  const initHeroSlider = () => {
    const slider = document.querySelector('.hero-image .slider');
    if (!slider) return;

    const slides = document.querySelectorAll('.hero-image .slide');
    const prevBtn = document.querySelector('.hero-image .prev-btn');
    const nextBtn = document.querySelector('.hero-image .next-btn');
    let currentIndex = 0;
    const slideCount = slides.length;
    let slideInterval;
    let isHovering = false;

    // Update slider position
    const updateSlider = () => {
      slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    };

    // Go to specific slide
    const goToSlide = (index) => {
      currentIndex = (index + slideCount) % slideCount;
      updateSlider();
    };

    // Next slide
    const nextSlide = () => {
      goToSlide(currentIndex + 1);
    };

    // Previous slide
    const prevSlide = () => {
      goToSlide(currentIndex - 1);
    };

    // Start auto sliding
    const startSlider = () => {
      if (!isHovering && slideCount > 1) {
        stopSlider();
        slideInterval = setInterval(nextSlide, 5000); // Auto slide every 5 seconds
      }
    };

    // Stop auto sliding
    const stopSlider = () => {
      clearInterval(slideInterval);
    };

    // Initialize slider
    if (slideCount > 0) {
      updateSlider(); // Set initial position
      startSlider(); // Start auto-slide

      // Pause on hover
      const sliderContainer = document.querySelector(
        '.hero-image .slider-container'
      );
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

      // Button controls
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

      // Handle keyboard navigation
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

      // Handle swipe for touch devices
      let touchStartX = 0;
      let touchEndX = 0;

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

  // Initialize Hero Slider
  initHeroSlider();

  // Tab functionality for game services with auto-sliding images
  const gameTabBtns = document.querySelectorAll('.game-tabs .tab-btn');
  const gameTabContents = document.querySelectorAll(
    '.game-services .tab-content'
  );
  let gameImageInterval;

  const startImageSlider = (tabContentElement) => {
    const slideInner = tabContentElement.querySelector('.game-slide-inner');
    if (!slideInner) return;

    const images = slideInner.querySelectorAll('img');
    let currentImageIndex = 0;
    const imageCount = images.length;

    if (imageCount > 1) {
      clearInterval(gameImageInterval); // Clear any existing interval
      gameImageInterval = setInterval(() => {
        currentImageIndex = (currentImageIndex + 1) % imageCount;
        slideInner.style.transform = `translateX(-${currentImageIndex * 100}%)`;
      }, 3000); // Change image every 3 seconds
    } else {
      clearInterval(gameImageInterval);
    }
  };

  const stopImageSlider = () => {
    clearInterval(gameImageInterval);
  };

  gameTabBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      const tabId = this.getAttribute('data-tab');

      // Remove active class from all buttons and tabs
      gameTabBtns.forEach((btn) => btn.classList.remove('active'));
      gameTabContents.forEach((tab) => tab.classList.remove('active'));

      // Add active class to clicked button and corresponding tab
      this.classList.add('active');
      const activeTabContent = document.getElementById(tabId);
      activeTabContent.classList.add('active');

      // Stop previous image slider and start for the new active tab
      stopImageSlider();
      startImageSlider(activeTabContent);

      // Trigger AOS refresh for new content
      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }
    });
  });

  // Initialize image slider for the default active tab on load
  const initialActiveTab = document.querySelector('.game-tabs .tab-btn.active');
  if (initialActiveTab) {
    const initialTabContent = document.getElementById(
      initialActiveTab.getAttribute('data-tab')
    );
    startImageSlider(initialTabContent);
  }

  // Image Modal Functionality
  const imageModal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const closeButton = document.querySelector('.close-button');
  const gameServiceImages = document.querySelectorAll('.game-image-slider img');

  closeButton.addEventListener('click', function () {
    // Explicitly set display to none when closing
    imageModal.style.display = 'none';
    imageModal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  });

  // Close modal when clicking outside the image
  imageModal.addEventListener('click', function (e) {
    if (e.target === imageModal) {
      // Explicitly set display to none when closing
      imageModal.style.display = 'none';
      imageModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });

  // Tab functionality for portfolio
  const portfolioTabBtns = document.querySelectorAll(
    '.portfolio-tabs .tab-btn'
  );
  if (portfolioTabBtns.length > 0) {
    // Set default active tab
    const defaultTab = document.querySelector(
      '.portfolio-tabs .tab-btn[data-tab="all"]'
    );
    if (defaultTab) defaultTab.classList.add('active');

    portfolioTabBtns.forEach((btn) => {
      btn.addEventListener('click', function () {
        const filter = this.getAttribute('data-tab');

        // Remove active class from all buttons
        portfolioTabBtns.forEach((btn) => btn.classList.remove('active'));
        // Add active class to clicked button
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

        // Refresh AOS after filtering
        if (typeof AOS !== 'undefined') {
          AOS.refresh();
        }
      });
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Close mobile menu if open
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          mobileMenu.classList.remove('active');
          document.querySelector('.hamburger').innerHTML =
            '<i class="fas fa-bars"></i>';
          document.body.style.overflow = 'auto';
        }

        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth',
        });

        // Update URL without refreshing
        if (history.pushState) {
          history.pushState(null, null, targetId);
        } else {
          location.hash = targetId;
        }
      }
    });
  });

  // Sticky navbar on scroll
  window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('sticky');
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      } else {
        navbar.classList.remove('sticky');
        navbar.style.boxShadow = 'none';
      }
    }
  });

  // Form handling for order page
  const orderForm = document.getElementById('boostingOrderForm'); // Changed to boostingOrderForm as per original
  if (orderForm) {
    // Show/hide services based on game selection
    const gameSelect = document.getElementById('game');
    const genshinServices = document.getElementById('genshin-services-group'); // Changed ID to avoid conflict
    const hsrServices = document.getElementById('hsr-services-group'); // Changed ID to avoid conflict

    // Hide all service groups initially
    if (genshinServices && hsrServices) {
      genshinServices.style.display = 'none';
      hsrServices.style.display = 'none';

      gameSelect.addEventListener('change', function () {
        // Hide all service groups
        genshinServices.style.display = 'none';
        hsrServices.style.display = 'none';

        // Show selected game's services
        if (this.value === 'genshin') {
          genshinServices.style.display = 'block';
        } else if (this.value === 'hsr') {
          hsrServices.style.display = 'block';
        }

        // Reset service selection
        document.getElementById('service').value = '';
      });

      // Check URL parameters for pre-selection
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

    // WhatsApp Order Submission
    const whatsappBtn = document.getElementById('whatsappSubmit');
    if (whatsappBtn) {
      whatsappBtn.addEventListener('click', function (e) {
        e.preventDefault();

        // Validate form
        if (!orderForm.checkValidity()) {
          orderForm.reportValidity();
          return;
        }

        // Get form values
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

        // Validate WhatsApp number
        if (!/^(\+62|62|0)[0-9]{9,12}$/.test(formData.whatsapp)) {
          // Replaced alert with console.error for non-blocking feedback
          console.error(
            'Nomor WhatsApp tidak valid. Harap masukkan nomor Indonesia yang valid.'
          );
          // Optionally, add a visible message to the user on the page
          return;
        }

        // Format WhatsApp number
        let whatsappNumber = formData.whatsapp;
        if (whatsappNumber.startsWith('0')) {
          whatsappNumber = '62' + whatsappNumber.substring(1);
        } else if (whatsappNumber.startsWith('+62')) {
          whatsappNumber = whatsappNumber.substring(1);
        } else if (!whatsappNumber.startsWith('62')) {
          whatsappNumber = '62' + whatsappNumber;
        }

        // Game and service mappings
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

        // Format WhatsApp message
        const whatsappMessage = `*PESANAN JOKI SHIRAORI*\n
📋 *Detail Pemesan:*
├ Nama: ${formData.name}
└ WhatsApp: ${formData.whatsapp}
\n
🎮 *Detail Game:*
├ Game: ${gameMap[formData.game]}
├ Layanan: ${serviceMap[formData.service]}
├ UID: ${formData.uid}
└ Server: ${formData.server}
\n
📝 *Catatan:*
${formData.notes}
\n
_Silahkan konfirmasi ketersediaan dan detail pembayaran_`;

        // Encode for URL
        const encodedMessage = encodeURIComponent(whatsappMessage);

        // Open WhatsApp
        window.open(
          `https://wa.me/${whatsappNumber}?text=${encodedMessage}`,
          '_blank'
        );
      });
    }
  }

  // Lazy loading for images
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
    // Fallback for browsers without IntersectionObserver
    lazyImages.forEach((img) => {
      img.src = img.getAttribute('data-src');
      img.removeAttribute('data-src');
    });
  }

  // Pricing Tabs functionality
  const pricingTabBtns = document.querySelectorAll('.pricing-tabs .tab-btn');
  const pricingTabContents = document.querySelectorAll(
    '.pricing-tabs .tab-content'
  );

  // Function to activate a tab
  const activatePricingTab = (tabId) => {
    console.log(`[Pricing Tabs] Mencoba mengaktifkan tab: ${tabId}`);

    // Hapus kelas 'active' dan sembunyikan semua konten tab
    pricingTabBtns.forEach((b) => {
      b.classList.remove('active');
      b.style.backgroundColor = ''; // Hapus styling sementara
      console.log(
        `[Pricing Tabs] Tombol dinonaktifkan: ${b.getAttribute('data-tab')}`
      );
    });

    pricingTabContents.forEach((content) => {
      content.classList.remove('active');
      content.style.display = 'none'; // Sembunyikan secara eksplisit
      content.style.border = ''; // Hapus styling sementara
      console.log(`[Pricing Tabs] Konten disembunyikan: ${content.id}`);
    });

    // Tambahkan kelas 'active' ke tombol yang diklik
    const clickedButton = document.querySelector(
      `.pricing-tabs .tab-btn[data-tab="${tabId}"]`
    );
    if (clickedButton) {
      clickedButton.classList.add('active');
      clickedButton.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; // Indikator visual sementara
      console.log(
        '[Pricing Tabs] Tombol ditemukan dan diaktifkan:',
        clickedButton.textContent.trim()
      );
    } else {
      console.error(
        '[Pricing Tabs] Tombol yang diklik tidak ditemukan untuk data-tab:',
        tabId
      );
    }

    // Tampilkan konten yang sesuai
    const activeContent = document.getElementById(tabId);
    if (activeContent) {
      activeContent.classList.add('active');
      activeContent.style.display = 'block'; // Tampilkan secara eksplisit
      activeContent.style.border = '2px solid green'; // Indikator visual sementara
      console.log('[Pricing Tabs] Konten ditemukan dan diaktifkan:', tabId);
      console.log(
        '[Pricing Tabs] Gaya display konten aktif saat ini:',
        activeContent.style.display
      );
      // Periksa apakah elemen memiliki dimensi (bukan 0x0)
      console.log(
        '[Pricing Tabs] Apakah activeContent terlihat? offsetWidth:',
        activeContent.offsetWidth,
        'offsetHeight:',
        activeContent.offsetHeight
      );
    } else {
      console.error(
        '[Pricing Tabs] Konten tab tidak ditemukan untuk ID:',
        tabId
      ); // Log penting
    }

    // Refresh animasi AOS untuk konten tab yang baru aktif
    // Menambahkan sedikit penundaan untuk memastikan properti display diterapkan sebelum AOS refresh
    setTimeout(() => {
      if (typeof AOS !== 'undefined') {
        AOS.refresh();
        console.log('[Pricing Tabs] AOS refresh dipanggil.');
      }
    }, 50); // Penundaan 50ms
  };

  pricingTabBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      const tabId = this.getAttribute('data-tab');
      console.log('[Pricing Tabs] Tombol tab diklik, data-tab:', tabId);
      activatePricingTab(tabId);
    });
  });

  // Atur tab aktif awal saat halaman dimuat untuk harga
  const initialPricingTab = document.querySelector(
    '.pricing-tabs .tab-btn.active'
  );
  if (initialPricingTab) {
    const initialPricingTabContentId =
      initialPricingTab.getAttribute('data-tab');
    console.log(
      '[Pricing Tabs] Tab aktif awal ditemukan:',
      initialPricingTabContentId
    );
    activatePricingTab(initialPricingTabContentId);
  } else {
    // Fallback: jika tidak ada tab aktif yang diatur di HTML, default ke yang pertama
    if (pricingTabBtns.length > 0 && pricingTabContents.length > 0) {
      const defaultTabId = pricingTabBtns[0].getAttribute('data-tab');
      console.log(
        '[Pricing Tabs] Tidak ada tab aktif awal yang ditemukan di HTML, mengaktifkan tab pertama:',
        defaultTabId
      );
      activatePricingTab(defaultTabId);
    } else {
      console.warn(
        '[Pricing Tabs] Tidak ada tombol tab atau konten tab ditemukan untuk inisialisasi.'
      );
    }
  }
});
