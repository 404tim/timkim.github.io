// Language Manager Class
class LanguageManager {
  constructor() {
    this.currentLang = localStorage.getItem('lang') || 'en';
    this.translations = {};
    this.init();
  }

  async init() {
    try {
      await this.loadTranslations();
      this.initLanguageUI();
      this.initCarousels();
      this.initAccordion();
      this.initLearnMoreLink();
    } catch (error) {
      console.error('Initialization error:', error);
    }
  }

  async loadTranslations() {
    try {
      const response = await fetch('lang_main.json');
      this.translations = await response.json();
      this.applyTranslations();
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  }

  initLanguageUI() {
    const langBtn = document.querySelector('.lang-btn');
    const langMenu = document.querySelector('.lang-menu');

    if (langBtn) {
      langBtn.textContent = this.currentLang.toUpperCase();
      
      langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langMenu?.classList.toggle('show');
      });
    }

    document.querySelectorAll('.lang-menu li').forEach(item => {
      item.addEventListener('click', () => {
        this.switchLanguage(item.dataset.lang);
        langMenu?.classList.remove('show');
      });
    });

    // Close language menu when clicking outside
    document.addEventListener('click', () => {
      langMenu?.classList.remove('show');
    });
  }

  switchLanguage(newLang) {
    this.currentLang = newLang;
    localStorage.setItem('lang', newLang);
    document.querySelector('.lang-btn').textContent = newLang.toUpperCase();
    this.applyTranslations();
  }

  getTranslationByKey(key) {
    const keys = key.split('.');
    let translation = this.translations[this.currentLang];
    
    for (const k of keys) {
      if (translation && typeof translation === 'object') {
        translation = translation[k];
      } else {
        console.warn(`Translation missing for key: ${key}`);
        return null;
      }
    }
    
    return translation;
  }

  applyTranslations() {
    document.querySelectorAll('[data-lang-key]').forEach(element => {
      const key = element.getAttribute('data-lang-key');
      const translation = this.getTranslationByKey(key);
      
      if (translation) {
        if (element.tagName === 'INPUT' && element.getAttribute('placeholder')) {
          element.placeholder = translation;
        } else {
          element.textContent = translation;
        }
      }
    });
  }

  initLearnMoreLink() {
    const learnMoreLink = document.querySelector('.learn-more-link');
    if (learnMoreLink) {
      learnMoreLink.addEventListener('click', () => {
        const carousel = document.querySelector('.achieve-carousel-inner');
        if (carousel) {
          const currentSlide = carousel.querySelector('.achieve-carousel-slide');
          const slideWidth = currentSlide.offsetWidth;
          carousel.style.transition = 'transform 0.5s ease';
          carousel.style.transform = `translateX(-${slideWidth}px)`;
        }
      });
    }
  }

  initCarousels() {
    // Main carousel initialization
    const carousel = document.querySelector('.carousel');
    const indicators = document.querySelectorAll('.indicator');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');

    if (carousel && indicators.length) {
      let currentIndex = 0;

      const moveToSlide = (index) => {
        carousel.style.transform = `translateX(-${index * 100}%)`;
        indicators.forEach((indicator, i) => {
          indicator.classList.toggle('active', i === index);
        });
        currentIndex = index;
      };

      leftArrow?.addEventListener('click', () => {
        const newIndex = currentIndex > 0 ? currentIndex - 1 : indicators.length - 1;
        moveToSlide(newIndex);
      });

      rightArrow?.addEventListener('click', () => {
        const newIndex = currentIndex < indicators.length - 1 ? currentIndex + 1 : 0;
        moveToSlide(newIndex);
      });

      indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => moveToSlide(index));
      });
    }

    // Achieve carousel initialization
    const achieveCarousel = document.querySelector('.achieve-carousel-inner');
    const achieveSlides = document.querySelectorAll('.achieve-carousel-slide');
    const prevButton = document.querySelector('.achieve-carousel-prev');
    const nextButton = document.querySelector('.achieve-carousel-next');

    if (achieveCarousel && achieveSlides.length) {
      let currentSlideIndex = 0;
      const totalSlides = achieveSlides.length;

      const moveToAchieveSlide = (index) => {
        achieveCarousel.style.transition = 'transform 0.5s ease';
        achieveCarousel.style.transform = `translateX(-${index * 100}%)`;
        currentSlideIndex = index;
      };

      prevButton?.addEventListener('click', () => {
        const newIndex = currentSlideIndex > 0 ? currentSlideIndex - 1 : totalSlides - 1;
        moveToAchieveSlide(newIndex);
      });

      nextButton?.addEventListener('click', () => {
        const newIndex = currentSlideIndex < totalSlides - 1 ? currentSlideIndex + 1 : 0;
        moveToAchieveSlide(newIndex);
      });
    }
  }

  initAccordion() {
    document.querySelectorAll('.accordion-item').forEach(item => {
      item.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.accordion-item').forEach(accordionItem => {
          accordionItem.classList.remove('active');
        });
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }
}



// Initialize language manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new LanguageManager();
  // Add to main_page.js
  document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
    document.querySelector('.mobile-nav').classList.toggle('active');
  });

  // Handle dropdown menus in mobile view
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    dropdown.addEventListener('click', function() {
        this.classList.toggle('active');
    });
  });
});