document.addEventListener("DOMContentLoaded", () => {
    let cart = JSON.parse(localStorage.getItem("badarStudioCart")) || [];

    const cartLink = document.getElementById("cartNavBtn");
    const aboutLink = document.querySelector('nav ul li a[href="#about"]');
    const contactLink = document.querySelector('nav ul li a[href="#contact"]');
    const footer = document.querySelector('.main-footer');
    const productsSection = document.querySelector('.products-section');
    const shopButtons = document.querySelectorAll('.hero-btn, .banner-btn');

    const cartModal = document.getElementById("cartModal");
    const checkoutModal = document.getElementById("checkoutModal");
    const productModal = document.getElementById("productModal");

    const cartItemsContainer = document.getElementById("cartItems");
    const cartTotalElement = document.getElementById("cartTotal");

    const closeCartBtn = document.querySelector(".close-cart");
    const closeCheckoutBtn = document.querySelector(".close-checkout");
    const closeProductBtn = document.querySelector(".close-product");

    const openCheckoutBtn = document.getElementById("openCheckoutBtn");
    const checkoutForm = document.getElementById("checkoutForm");

    const modalTitle = document.getElementById("modalTitle");
    const modalImg = document.getElementById("modalImg");
    const modalPrice = document.getElementById("modalPrice");
    const modalAddToCartBtn = document.getElementById("modalAddToCartBtn");

    let currentSelectedProduct = null;
    let selectedColor = "Default";
    let selectedSize = "M";

    const updateCart = () => {
        localStorage.setItem("badarStudioCart", JSON.stringify(cart));
        
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartLink) {
            cartLink.textContent = `Cart (${totalItems})`;
        }

        cartItemsContainer.innerHTML = "";
        let totalAmount = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `<p class="empty-cart">Your cart is currently empty.</p>`;
            if (openCheckoutBtn) {
                openCheckoutBtn.disabled = true;
                openCheckoutBtn.style.opacity = "0.5";
                openCheckoutBtn.style.cursor = "not-allowed";
            }
        } else {
            if (openCheckoutBtn) {
                openCheckoutBtn.disabled = false;
                openCheckoutBtn.style.opacity = "1";
                openCheckoutBtn.style.cursor = "pointer";
            }

            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                totalAmount += itemTotal;

                const itemRow = document.createElement("div");
                itemRow.classList.add("cart-item");
                itemRow.innerHTML = `
                    <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h4>${item.title}</h4>
                        <small>Color: ${item.color} | Size: ${item.size}</small>
                        <p>₹${item.price.toLocaleString('en-IN')} x ${item.quantity}</p>
                    </div>
                    <button class="remove-btn" data-index="${index}">&times;</button>
                `;
                cartItemsContainer.appendChild(itemRow);
            });
        }

        if (cartTotalElement) {
            cartTotalElement.textContent = `₹${totalAmount.toLocaleString('en-IN')}`;
        }

        document.querySelectorAll(".remove-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const index = e.target.getAttribute("data-index");
                cart.splice(index, 1);
                updateCart();
            });
        });
    };

    updateCart();

    const openProductModal = (card) => {
        const title = card.querySelector("h3").innerText.trim();
        const priceText = card.querySelector(".price").innerText.replace(/[^0-9]/g, "");
        const price = parseInt(priceText, 10);
        const image = card.querySelector("img").getAttribute("src");

        currentSelectedProduct = { title, price, image };

        modalTitle.textContent = title;
        modalImg.src = image;
        modalPrice.textContent = `₹${price.toLocaleString('en-IN')}`;

        selectedColor = "Default";
        selectedSize = "M";
        document.querySelectorAll(".color-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".size-btn").forEach(b => b.classList.remove("active"));
        document.querySelector('.color-btn[data-color="Default"]').classList.add("active");
        document.querySelector('.size-btn[data-size="M"]').classList.add("active");

        if (productModal) productModal.style.display = "flex";
    };

    const productCards = document.querySelectorAll(".product-card");
    productCards.forEach((card) => {
        card.style.cursor = "pointer";
        card.addEventListener("click", () => {
            openProductModal(card);
        });
    });

    document.querySelectorAll(".color-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".color-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            selectedColor = btn.getAttribute("data-color");
        });
    });

    document.querySelectorAll(".size-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".size-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            selectedSize = btn.getAttribute("data-size");
        });
    });

    if (modalAddToCartBtn) {
        modalAddToCartBtn.addEventListener("click", () => {
            if (!currentSelectedProduct) return;

            const { title, price, image } = currentSelectedProduct;

            const existingIndex = cart.findIndex(
                (item) => item.title === title && item.color === selectedColor && item.size === selectedSize
            );

            if (existingIndex > -1) {
                cart[existingIndex].quantity += 1;
            } else {
                cart.push({ title, price, image, color: selectedColor, size: selectedSize, quantity: 1 });
            }

            updateCart();

            modalAddToCartBtn.textContent = "Added ✓";
            modalAddToCartBtn.style.backgroundColor = "#5AC8FA";

            setTimeout(() => {
                modalAddToCartBtn.textContent = "Add to Cart";
                modalAddToCartBtn.style.backgroundColor = "#111111";
                if (productModal) productModal.style.display = "none";
            }, 800);
        });
    }

    if (cartLink) cartLink.addEventListener("click", (e) => { e.preventDefault(); if (cartModal) cartModal.style.display = "flex"; });
    if (closeCartBtn) closeCartBtn.addEventListener("click", () => { if (cartModal) cartModal.style.display = "none"; });
    if (closeCheckoutBtn) closeCheckoutBtn.addEventListener("click", () => { if (checkoutModal) checkoutModal.style.display = "none"; });
    if (closeProductBtn) closeProductBtn.addEventListener("click", () => { if (productModal) productModal.style.display = "none"; });

    if (openCheckoutBtn) {
        openCheckoutBtn.addEventListener("click", () => {
            if (cart.length === 0) return;
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

            document.getElementById("summaryItemCount").textContent = totalItems;
            document.getElementById("summaryTotalAmount").textContent = `₹${totalAmount.toLocaleString('en-IN')}`;

            if (cartModal) cartModal.style.display = "none";
            if (checkoutModal) checkoutModal.style.display = "flex";
        });
    }

    if (checkoutForm) {
        checkoutForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("fullName").value;
            alert(`Thank you for your order, ${name}! Your order has been placed successfully.`);
            cart = [];
            updateCart();
            checkoutForm.reset();
            if (checkoutModal) checkoutModal.style.display = "none";
        });
    }

    window.addEventListener("click", (e) => {
        if (e.target === cartModal) cartModal.style.display = "none";
        if (e.target === checkoutModal) checkoutModal.style.display = "none";
        if (e.target === productModal) productModal.style.display = "none";
    });

    const scrollToFooter = (e) => {
        e.preventDefault();
        if (footer) footer.scrollIntoView({ behavior: "smooth" });
    };

    if (aboutLink) aboutLink.addEventListener("click", scrollToFooter);
    if (contactLink) contactLink.addEventListener("click", scrollToFooter);

    shopButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            if (productsSection) productsSection.scrollIntoView({ behavior: "smooth" });
        });
    });

    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector("nav ul");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
        });
    }
});