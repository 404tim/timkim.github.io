document.addEventListener("DOMContentLoaded", () => {
  // Initialize language variables
  let currentLang = localStorage.getItem('lang') || 'en';
  let translations = {};
  let pageTranslations = {};
  
  const productsContainer = document.getElementById("product-list");
  const categoryTitle = document.getElementById("category-title");
  const urlParams = new URLSearchParams(window.location.search);
  const selectedCategory = urlParams.get("category");

  // Initialize language UI and load translations
  initializeLanguage();

  function initializeLanguage() {
    // Set initial language button text
    document.querySelector('.lang-btn').textContent = currentLang.toUpperCase();
    
    // Set up language switcher
    document.querySelectorAll('.lang-menu li').forEach(item => {
      item.addEventListener('click', () => {
        currentLang = item.dataset.lang;
        localStorage.setItem('lang', currentLang);
        document.querySelector('.lang-btn').textContent = currentLang.toUpperCase();
        loadTranslations(); // Load all translations
      });
    });

    // Toggle language menu
    document.querySelector('.lang-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelector('.lang-menu').classList.toggle('show');
    });

    // Close language menu when clicking outside
    document.addEventListener('click', () => {
      document.querySelector('.lang-menu').classList.remove('show');
    });

    // Initial load of translations
    loadTranslations();
  }

  function loadTranslations() {
    // Load product translations
    fetch("products.json")
      .then(response => response.json())
      .then(data => {
        translations = data.translations;
        
        const categoryData = data.categories[selectedCategory];
        if (!categoryData) {
          categoryTitle.textContent = translations[currentLang]["category.not.found"] || "Category not found";
          return;
        }

        // Update the category title with the specific category name
        categoryTitle.textContent = categoryData.title[currentLang];
        renderProducts(categoryData.products);
      });

    // Load page translations
    fetch("lang_list_products.json")
      .then(response => response.json())
      .then(data => {
        pageTranslations = data;
        applyTranslations();
      });
  }

  function applyTranslations() {
    // Apply product-related translations
    document.querySelectorAll('[data-lang-key]').forEach(element => {
      const key = element.getAttribute('data-lang-key');
      
      // Skip the category title as it's now handled in loadTranslations
      if (element.id === 'category-title') return;
      
      // Check in page translations first
      if (pageTranslations[currentLang] && pageTranslations[currentLang][key]) {
        if (element.tagName === 'INPUT' && element.type === 'placeholder') {
          element.placeholder = pageTranslations[currentLang][key];
        } else {
          element.textContent = pageTranslations[currentLang][key];
        }
      }
      // Then check in product translations
      else if (translations[currentLang] && translations[currentLang][key]) {
        if (element.tagName === 'INPUT' && element.type === 'placeholder') {
          element.placeholder = translations[currentLang][key];
        } else {
          element.textContent = translations[currentLang][key];
        }
      }
    });

    // Update document title
    document.title = pageTranslations[currentLang]["page.title"];
  }

  function createCarousel(images, name) {
      const carousel = document.createElement('div');
      carousel.className = 'carousel-container';
  
      let currentIndex = 0;
      const imgElement = document.createElement('img');
      imgElement.src = images[currentIndex];
      imgElement.alt = name[currentLang];
  
      const prevButton = document.createElement('button');
      prevButton.className = 'carousel-arrow prev';
      prevButton.innerHTML = '❮';
  
      const nextButton = document.createElement('button');
      nextButton.className = 'carousel-arrow next';
      nextButton.innerHTML = '❯';
  
      function updateImage() {
        imgElement.src = images[currentIndex];
        imgElement.alt = name[currentLang];
      }
  
      prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateImage();
      });
  
      nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length;
        updateImage();
      });
  
      carousel.appendChild(prevButton);
      carousel.appendChild(imgElement);
      carousel.appendChild(nextButton);
  
      if (images.length <= 1) {
        prevButton.style.display = 'none';
        nextButton.style.display = 'none';
      }
  
      return carousel;
  }

  function renderProducts(products) {
      productsContainer.innerHTML = "";
      products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-item");
  
        const images = Array.isArray(product.image) ? product.image : [product.image];
        const descriptionLines = product.description[currentLang].split(", ");
  
        const descriptionList = document.createElement("ul");
        descriptionLines.forEach(line => {
          const li = document.createElement("li");
          li.textContent = line;
          descriptionList.appendChild(li);
        });
  
        const priceDisplay = product.price ? 
          `${product.price} €` : 
          translations[currentLang]["price.contact"];
  
        productCard.innerHTML = `
          <div class="product-details">
            <h2 data-id="${product.id}">${product.name[currentLang]}</h2>
          </div>
          <div class="product-price-and-cart">
            <div class="product-price">
              <span>${priceDisplay}</span>
            </div>
            <a href="contact.html">
              <button class="add-to-cart">${translations[currentLang]["buy.button"]}</button>
            </a>
          </div>
        `;
  
        const productDetails = productCard.querySelector(".product-details");
        productDetails.appendChild(descriptionList);
  
        const imageContainer = document.createElement('div');
        imageContainer.className = 'product-image';
        const carousel = createCarousel(images, product.name);
        imageContainer.appendChild(carousel);
  
        productCard.prepend(imageContainer);
  
        const titleElement = productCard.querySelector("h2");
        titleElement.addEventListener("click", (event) => {
          event.stopPropagation();
          window.location.href = `product_card.html?id=${event.target.dataset.id}`;
        });
  
        productsContainer.appendChild(productCard);
      });
  }
});