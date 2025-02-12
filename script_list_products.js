document.addEventListener("DOMContentLoaded", () => {
    const productsContainer = document.getElementById("product-list");
    const categoryTitle = document.getElementById("category-title");
  
    const urlParams = new URLSearchParams(window.location.search);
    const selectedCategory = urlParams.get("category");
  
    function loadCategoryData() {
        fetch("products.json")
            .then(response => response.json())
            .then(data => {
                const categoryData = data.categories[selectedCategory];
                if (!categoryData) {
                    categoryTitle.textContent = "Category not found";
                    return;
                }
  
                categoryTitle.textContent = categoryData.title;
                renderProducts(categoryData.products);
            });
    }
  
    function createCarousel(images, name) {
        const carousel = document.createElement('div');
        carousel.className = 'carousel-container';
  
        let currentIndex = 0;
        const imgElement = document.createElement('img');
        imgElement.src = images[currentIndex];
        imgElement.alt = name;
  
        const prevButton = document.createElement('button');
        prevButton.className = 'carousel-arrow prev';
        prevButton.innerHTML = '❮';
  
        const nextButton = document.createElement('button');
        nextButton.className = 'carousel-arrow next';
        nextButton.innerHTML = '❯';
  
        function updateImage() {
            imgElement.src = images[currentIndex];
            imgElement.alt = name;
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
          const descriptionLines = product.description.split(", ");
  
          const descriptionList = document.createElement("ul");
          descriptionLines.forEach(line => {
              const li = document.createElement("li");
              li.textContent = line;
              descriptionList.appendChild(li);
          });
  
          productCard.innerHTML = `
              <div class="product-details">
                  <h2 data-id="${product.id}">${product.name}</h2>
              </div>
              <div class="product-price-and-cart">
                  <div class="product-price">
                      <span>${product.price} $</span>
                  </div>
                  <button class="add-to-cart">Buy</button>
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
  
    loadCategoryData();
  });
  