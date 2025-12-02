// Shop page functionality
let allProducts = [];
let filteredProducts = [];
let selectedProduct = null;

document.addEventListener('DOMContentLoaded', function() {
    loadUsername();
    loadProducts();
    loadCategories();
    setupEventListeners();
});

function loadUsername() {
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay) {
        const username = localStorage.getItem('username') || 'Guest';
        usernameDisplay.textContent = `👤 ${username}`;
    }
}

function loadProducts() {
    fetch('php/products.php?action=get_all')
        .then(response => response.json())
        .then(data => {
            allProducts = data;
            filteredProducts = data;
            displayProducts(data);
            updateCartCount();
        })
        .catch(error => {
            console.error('Error loading products:', error);
            document.getElementById('products-grid').innerHTML = '<div class="loading">Error loading products</div>';
        });
}

function loadCategories() {
    fetch('php/products.php?action=get_categories')
        .then(response => response.json())
        .then(data => {
            const categoriesList = document.getElementById('categories-list');
            
            // Clear existing items except the first "All Products" option
            const allProductsLabel = categoriesList.querySelector('label');
            categoriesList.innerHTML = '';
            categoriesList.appendChild(allProductsLabel);
            
            // Add categories
            data.forEach(category => {
                const label = document.createElement('label');
                label.innerHTML = `<input type="radio" name="category" value="${category}"> ${category}`;
                categoriesList.appendChild(label);
            });
        })
        .catch(error => console.error('Error loading categories:', error));
}

function setupEventListeners() {
    // Category filter
    document.addEventListener('change', function(e) {
        if (e.target.name === 'category') {
            filterByCategory(e.target.value);
        }
    });
    
    // Price range filter
    const priceRange = document.getElementById('price-range');
    if (priceRange) {
        priceRange.addEventListener('input', function() {
            document.getElementById('price-value').textContent = new Intl.NumberFormat('en-US').format(this.value);
            filterByPrice(this.value);
        });
    }
}

function displayProducts(products) {
    const grid = document.getElementById('products-grid');
    
    if (products.length === 0) {
        grid.innerHTML = '<div class="loading">No products found</div>';
        return;
    }
    
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image-placeholder">${getCategoryEmoji(product.category)}</div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.category}</p>
                <div class="product-price">KES ${formatPrice(product.price)}</div>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="openProductModal(${product.id})">View Details</button>
                </div>
            </div>
        </div>
    `).join('');
}

function getCategoryEmoji(category) {
    const emojis = {
        'Engine': '🚗',
        'Transmission': '⚙️',
        'Brakes': '🛑',
        'Suspension': '🔧',
        'Electrical': '🔋',
        'Cooling': '❄️',
        'Engine Parts': '⚡',
        'Filters': '🌊',
        'Fuel System': '⛽'
    };
    return emojis[category] || '🚙';
}

function formatPrice(price) {
    return new Intl.NumberFormat('en-US').format(price);
}

function filterByCategory(category) {
    if (category === '') {
        filteredProducts = allProducts;
    } else {
        filteredProducts = allProducts.filter(p => p.category === category);
    }
    filterByPrice(document.getElementById('price-range').value);
}

function filterByPrice(maxPrice) {
    const filtered = filteredProducts.filter(p => p.price <= maxPrice);
    displayProducts(filtered);
}

function searchProducts() {
    const searchInput = document.getElementById('search-input').value.trim();
    
    if (!searchInput) {
        filteredProducts = allProducts;
        filterByPrice(document.getElementById('price-range').value);
        return;
    }
    
    fetch(`php/products.php?action=search&query=${encodeURIComponent(searchInput)}`)
        .then(response => response.json())
        .then(data => {
            filteredProducts = data;
            filterByPrice(document.getElementById('price-range').value);
        })
        .catch(error => console.error('Error searching:', error));
}

function resetFilters() {
    document.getElementById('search-input').value = '';
    document.querySelector('input[name="category"][value=""]').checked = true;
    document.getElementById('price-range').value = 100000;
    document.getElementById('price-value').textContent = '100,000';
    filteredProducts = allProducts;
    displayProducts(allProducts);
}

function openProductModal(productId) {
    const product = allProducts.find(p => p.id === productId);
    
    if (!product) return;
    
    selectedProduct = product;
    document.getElementById('modal-product-name').textContent = product.name;
    document.getElementById('modal-product-description').textContent = product.description || 'Premium quality product';
    document.getElementById('modal-product-price').textContent = `KES ${formatPrice(product.price)}`;
    document.getElementById('modal-product-stock').textContent = `Stock: ${product.stock} units available`;
    document.getElementById('modal-image').innerHTML = getCategoryEmoji(product.category);
    document.getElementById('quantity').value = 1;
    
    const modal = document.getElementById('addToCartModal');
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('addToCartModal').classList.remove('active');
}

function increaseQty() {
    const qty = document.getElementById('quantity');
    qty.value = Math.min(parseInt(qty.value) + 1, selectedProduct.stock);
}

function decreaseQty() {
    const qty = document.getElementById('quantity');
    qty.value = Math.max(parseInt(qty.value) - 1, 1);
}

function addToCart() {
    if (!selectedProduct) return;
    
    const quantity = parseInt(document.getElementById('quantity').value);
    
    const formData = new FormData();
    formData.append('action', 'add');
    formData.append('product_id', selectedProduct.id);
    formData.append('quantity', quantity);
    
    fetch('php/cart.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            closeModal();
            updateCartCount();
            showNotification(`${selectedProduct.name} added to cart!`);
        } else {
            alert(data.error || 'Error adding to cart');
        }
    })
    .catch(error => console.error('Error:', error));
}

function updateCartCount() {
    fetch('php/cart.php?action=get_cart')
        .then(response => response.json())
        .then(data => {
            const count = data.length;
            document.getElementById('cart-count').textContent = count;
        })
        .catch(error => console.error('Error updating cart:', error));
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modal = document.getElementById('addToCartModal');
    if (e.target === modal) {
        closeModal();
    }
});
