let images = [];
let currentIndex = 0;
let thumbs = [];
let currentLang = localStorage.getItem('lang') || 'en';
let translations = {};
let pageTranslations = {};

document.addEventListener("DOMContentLoaded", () => {
    initializeLanguage();
    loadProductData();
});

function initializeLanguage() {
    // Set initial language button text
    document.querySelector('.lang-btn').textContent = currentLang.toUpperCase();
    
    // Set up language switcher
    document.querySelectorAll('.lang-menu li').forEach(item => {
        item.addEventListener('click', () => {
            currentLang = item.dataset.lang;
            localStorage.setItem('lang', currentLang);
            document.querySelector('.lang-btn').textContent = currentLang.toUpperCase();
            loadProductData();
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
}

function loadProductData() {
    const productID = new URLSearchParams(window.location.search).get("id");

    // Load page translations first
    fetch("lang_list_products.json")
        .then(response => response.json())
        .then(data => {
            pageTranslations = data;
            applyPageTranslations();
        });

    // Then load product data
    fetch("products_card.json")
        .then(response => response.json())
        .then(data => {
            translations = data.translations;
            
            let foundProduct;
            Object.values(data.categories).forEach(category => {
                const product = category.products.find(p => p.id === parseInt(productID));
                if (product) foundProduct = product;
            });

            if (foundProduct) {
                updateProductPage({
                    name: foundProduct.name[currentLang],
                    images: foundProduct.image,
                    description: foundProduct.description[currentLang],
                    specifications: foundProduct.specifications[currentLang].split(", "),
                    additionalInfo: foundProduct.additionalInfo[currentLang],
                    price: foundProduct.price
                });
            } else {
                console.error("Product not found");
            }
        });
}

function applyPageTranslations() {
    // Apply translations to all elements with data-lang-key attribute
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (pageTranslations[currentLang] && pageTranslations[currentLang][key]) {
            if (element.tagName === 'INPUT' && element.type === 'placeholder') {
                element.placeholder = pageTranslations[currentLang][key];
            } else {
                element.textContent = pageTranslations[currentLang][key];
            }
        }
    });

    // Update document title
    document.title = pageTranslations[currentLang]["page.title"];
}

function updateProductPage(product) {
    document.getElementById("productName").textContent = product.name;
    
    // 1. Исправляем отображение описания
    document.getElementById("productDescription").textContent = product.description;

    // 2. Добавляем дополнительную информацию
    document.getElementById("productAdditionalInfo").textContent = 
        product.additionalInfo || "";

    // 3. Добавляем цену
    const priceElement = document.getElementById("productPrice");
    if (product.price) {
        priceElement.textContent = `${product.price} €`;
    } else {
        priceElement.textContent = "Contact us for pricing";
    }

    // Обновляем глобальные переменные
    images = product.images;
    currentIndex = 0;

    const specList = document.getElementById("productSpecifications");
    specList.innerHTML = product.specifications.map(spec => 
        `<li>${spec.trim()}</li>` // Добавлен trim()
    ).join("");

    const thumbnailsContainer = document.getElementById("thumbnails");
    thumbnailsContainer.innerHTML = "";

    // Создаем миниатюры
    images.forEach((imgSrc, index) => {
        const img = document.createElement("img");
        img.src = imgSrc;
        img.classList.add("thumb");
        img.onclick = () => changeImage(index);
        thumbnailsContainer.appendChild(img);
    });

    // Инициализируем thumbs после добавления элементов в DOM
    thumbs = document.querySelectorAll(".thumb");
    thumbs[0].classList.add("active");

    // Устанавливаем основное изображение
    document.getElementById("mainImage").src = images[0];

    // Добавляем обработчики прокрутки колесиком
    thumbnailsContainer.addEventListener("wheel", (event) => {
        event.preventDefault();
        thumbnailsContainer.scrollBy({ 
            top: event.deltaY, 
            behavior: "smooth" 
        });
    });
}

function changeImage(index) {
    document.getElementById("mainImage").src = images[index];
    currentIndex = index;

    // Обновляем активную миниатюру
    thumbs.forEach(thumb => thumb.classList.remove('active'));
    thumbs[index].classList.add("active");

    // Автоматическая прокрутка
    scrollToThumb(index);
}

function prevImage() {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    changeImage(newIndex);
}

function nextImage() {
    const newIndex = (currentIndex + 1) % images.length;
    changeImage(newIndex);
}

function scrollToThumb(index) {
    const thumb = thumbs[index];
    const container = document.querySelector(".thumbnails");
    
    if (!thumb || !container) return;

    const thumbHeight = thumb.clientHeight + parseInt(getComputedStyle(thumb).marginBottom || 0);
    const containerHeight = container.clientHeight;
    const scrollTop = container.scrollTop;

    const thumbTop = thumb.offsetTop;
    const thumbBottom = thumbTop + thumbHeight;

    if (thumbTop < scrollTop) {
        container.scrollTo({ top: thumbTop, behavior: 'smooth' });
    } else if (thumbBottom > scrollTop + containerHeight) {
        container.scrollTo({ 
            top: thumbBottom - containerHeight, 
            behavior: 'smooth' 
        });
    }
}