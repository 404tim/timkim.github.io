document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.carousel');
  const indicators = document.querySelectorAll('.indicator');
  const leftArrow = document.querySelector('.left-arrow');
  const rightArrow = document.querySelector('.right-arrow');
  let currentIndex = 0;

  function updateIndicators() {
      indicators.forEach((indicator, index) => {
          indicator.classList.toggle('active', index === currentIndex);
      });
  }

  function moveToSlide(index) {
      const offset = -index * 100;
      carousel.style.transform = `translateX(${offset}%)`;
      updateIndicators();
  }

  leftArrow.addEventListener('click', () => {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : indicators.length - 1;
      moveToSlide(currentIndex);
  });

  rightArrow.addEventListener('click', () => {
      currentIndex = (currentIndex < indicators.length - 1) ? currentIndex + 1 : 0;
      moveToSlide(currentIndex);
  });

  indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
          currentIndex = index;
          moveToSlide(currentIndex);
      });
  });

  document.querySelectorAll('.dropdown-menu a').forEach(link => {
      link.addEventListener('click', event => {
          const category = link.getAttribute('href').split('category=')[1];
          console.log(`Navigating to category: ${category}`);
      });
  });

  const carouselInner = document.querySelector('.achieve-carousel-inner');
  const prevButton = document.querySelector('.achieve-carousel-prev');
  const nextButton = document.querySelector('.achieve-carousel-next');
  let currentIndex_achive = 0;
  const slides = document.querySelectorAll('.achieve-carousel-slide');

  const firstClone = slides[0].cloneNode(true);
  carouselInner.appendChild(firstClone);

  function updateCarousel() {
      carouselInner.style.transition = 'transform 0.5s ease';
      carouselInner.style.transform = `translateX(-${currentIndex_achive * 100}%)`;

      if (currentIndex_achive === slides.length) {
          setTimeout(() => {
              carouselInner.style.transition = 'none';
              currentIndex_achive = 0;
              carouselInner.style.transform = `translateX(0)`;
          }, 500);
      }
      if (currentIndex_achive === 2) {
          setTimeout(initSpeedometers, 500);
      }
  }

  nextButton.addEventListener('click', () => {
      currentIndex_achive++;
      updateCarousel();
  });

  prevButton.addEventListener('click', () => {
      currentIndex_achive = (currentIndex_achive - 1 + slides.length) % slides.length;
      updateCarousel();
  });

  document.querySelectorAll('.accordion-item').forEach(item => {
      item.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          document.querySelectorAll('.accordion-item').forEach(i => {
              i.classList.remove('active');
          });
          if (!isActive) {
              item.classList.add('active');
          }
      });
  });

});
