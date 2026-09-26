/**
 * TermoTek Pro - İklimlendirme & Akıllı Tesisat Teknik Servis
 * Etkileşimli JavaScript Modülleri
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Lucide İkonlarını Başlat
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. Mobil Menü Aç/Kapat
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // 3. İnteraktif Servis ve Fiyat Hesaplayıcı
  const calcService = document.getElementById('calc-service');
  const calcType = document.getElementById('calc-type');
  const calcUrgency = document.getElementById('calc-urgency');
  const priceDisplay = document.getElementById('price-display');
  const bookCalcBtn = document.getElementById('book-calc-btn');

  function calculateEstimate() {
    if (!calcService || !calcType || !calcUrgency || !priceDisplay) return;

    const selectedService = calcService.options[calcService.selectedIndex];
    const selectedType = calcType.options[calcType.selectedIndex];
    const selectedUrgency = calcUrgency.options[calcUrgency.selectedIndex];

    const basePrice = parseFloat(selectedService.getAttribute('data-base')) || 750;
    const multiplier = parseFloat(selectedType.getAttribute('data-mult')) || 1.0;
    const extraUrgency = parseFloat(selectedUrgency.getAttribute('data-extra')) || 0;

    const calculatedBase = (basePrice * multiplier) + extraUrgency;
    const minPrice = Math.round(calculatedBase);
    const maxPrice = Math.round(calculatedBase * 1.3); // %30 tolerans aralığı

    priceDisplay.textContent = `₺${minPrice.toLocaleString('tr-TR')} - ₺${maxPrice.toLocaleString('tr-TR')}`;
  }

  if (calcService && calcType && calcUrgency) {
    calcService.addEventListener('change', calculateEstimate);
    calcType.addEventListener('change', calculateEstimate);
    calcUrgency.addEventListener('change', calculateEstimate);
    calculateEstimate(); // İlk yüklemede çalıştır
  }

  // Hesaplayıcıdan Randevu Formuna Otomatik Aktarım
  if (bookCalcBtn) {
    bookCalcBtn.addEventListener('click', () => {
      const selectedService = calcService.options[calcService.selectedIndex];
      const serviceName = selectedService.getAttribute('data-name');
      const formServiceSelect = document.getElementById('form-service-select');
      const formNote = document.getElementById('form-note');

      // Randevu alanındaki ilgili servisi eşleştir
      if (formServiceSelect) {
        const val = calcService.value;
        if (val.includes('kombi')) formServiceSelect.value = 'kombi';
        else if (val.includes('klima')) formServiceSelect.value = 'klima';
        else if (val.includes('su_kacagi')) formServiceSelect.value = 'su_kacagi';
        else if (val.includes('petek')) formServiceSelect.value = 'petek';
      }

      if (formNote) {
        formNote.value = `Fiyat Hesaplayıcı ile seçildi: ${serviceName} (Tahmini: ${priceDisplay.textContent})`;
      }

      // Randevu bölümüne yumuşak kaydır
      const randevuSection = document.getElementById('randevu');
      if (randevuSection) {
        randevuSection.scrollIntoView({ behavior: 'smooth' });
        // İsim alanına odaklan
        const nameInput = document.getElementById('form-name');
        if (nameInput) setTimeout(() => nameInput.focus(), 600);
      }
    });
  }

  // 4. Before / After Etkileşimli Görsel Kaydırıcı
  const sliderContainer = document.getElementById('before-after-container');
  const beforeLayer = document.getElementById('before-layer');
  const sliderHandle = document.getElementById('slider-handle');

  if (sliderContainer && beforeLayer && sliderHandle) {
    let isDragging = false;

    function updateSlider(clientX) {
      const rect = sliderContainer.getBoundingClientRect();
      let x = clientX - rect.left;
      if (x < 0) x = 0;
      if (x > rect.width) x = rect.width;

      const percentage = (x / rect.width) * 100;
      beforeLayer.style.width = `${percentage}%`;
      sliderHandle.style.left = `${percentage}%`;
    }

    sliderContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      updateSlider(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      updateSlider(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Mobil Dokunmatik (Touch) Desteği
    sliderContainer.addEventListener('touchstart', (e) => {
      isDragging = true;
      updateSlider(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      updateSlider(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // 5. Sıkça Sorulan Sorular (Akordeon)
  const faqButtons = document.querySelectorAll('.faq-btn');
  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector('[data-lucide="chevron-down"]');

      const isOpen = !content.classList.contains('hidden');

      // Diğer tüm açık akordeonları kapat
      document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
      document.querySelectorAll('.faq-btn [data-lucide="chevron-down"]').forEach(i => {
        i.style.transform = 'rotate(0deg)';
      });

      if (!isOpen) {
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });

  // 6. Form Gönderim Simülasyonları
  const heroQuickForm = document.getElementById('hero-quick-form');
  const heroSuccess = document.getElementById('hero-success');

  if (heroQuickForm) {
    heroQuickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = heroQuickForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<span>Talebiniz İletiliyor...</span>';
      submitBtn.disabled = true;

      setTimeout(() => {
        heroQuickForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        if (heroSuccess) {
          heroSuccess.classList.remove('hidden');
          setTimeout(() => heroSuccess.classList.add('hidden'), 5000);
        }
      }, 1000);
    });
  }

  const bookingForm = document.getElementById('booking-form');
  const formSuccessMessage = document.getElementById('form-success-message');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<span>Randevu Kaydediliyor...</span>';
      submitBtn.disabled = true;

      setTimeout(() => {
        bookingForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        if (formSuccessMessage) {
          formSuccessMessage.classList.remove('hidden');
          formSuccessMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 1200);
    });
  }
});
