let images = [];
let currentIndex = 0;
let thumbs = [];

document.addEventListener("DOMContentLoaded", () => {
    const productID = new URLSearchParams(window.location.search).get("id");

    fetch("products_card.json")
        .then(response => response.json())
        .then(data => {
            let foundProduct;

            Object.values(data.categories).forEach(category => {
                const product = category.products.find(p => p.id === parseInt(productID));
                if (product) foundProduct = product;
            });

            if (foundProduct) {
                updateProductPage({
                    name: foundProduct.name,
                    images: foundProduct.image,
                    description: foundProduct.description,
                    specifications: foundProduct.specifications.split(", "),
                    additionalInfo: foundProduct.additionalInfo, 
                    price: foundProduct.price
                });
            } else {
                console.error("Product not found");
            }
        });
});

function updateProductPage(product) {
    document.getElementById("productName").textContent = product.name;
    document.getElementById("productDescription").textContent = product.description;
    document.getElementById("productAdditionalInfo").textContent = 
        product.additionalInfo || "Additional product information";

    const priceElement = document.getElementById("productPrice");
    if (product.price) {
        priceElement.textContent = `${product.price} $`;
    } else {
        priceElement.textContent = "Contact us for pricing";
    }

    images = product.images;
    currentIndex = 0;

    const specList = document.getElementById("productSpecifications");
    specList.innerHTML = product.specifications.map(spec => 
        `<li>${spec.trim()}</li>`
    ).join("");

    const thumbnailsContainer = document.getElementById("thumbnails");
    thumbnailsContainer.innerHTML = "";

    images.forEach((imgSrc, index) => {
        const img = document.createElement("img");
        img.src = imgSrc;
        img.classList.add("thumb");
        img.onclick = () => changeImage(index);
        thumbnailsContainer.appendChild(img);
    });

    thumbs = document.querySelectorAll(".thumb");
    thumbs[0].classList.add("active");

    document.getElementById("mainImage").src = images[0];

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

    thumbs.forEach(thumb => thumb.classList.remove('active'));
    thumbs[index].classList.add("active");

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
