// Cart page functionality
let cart = [];

document.addEventListener('DOMContentLoaded', function() {
    loadUsername();
    loadCart();
});

function loadUsername() {
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay) {
        const username = localStorage.getItem('username') || 'Guest';
        usernameDisplay.textContent = `👤 ${username}`;
    }
}

function loadCart() {
    fetch('php/cart.php?action=get_cart')
        .then(response => response.json())
        .then(data => {
            cart = data;
            displayCart();
        })
        .catch(error => {
            console.error('Error loading cart:', error);
            showEmptyCart();
        });
}

function displayCart() {
    const emptyDiv = document.getElementById('cart-empty');
    const contentDiv = document.getElementById('cart-content');
    const summaryDiv = document.getElementById('cart-summary');
    
    if (cart.length === 0) {
        emptyDiv.style.display = 'block';
        contentDiv.style.display = 'none';
        summaryDiv.style.display = 'none';
        return;
    }
    
    emptyDiv.style.display = 'none';
    contentDiv.style.display = 'block';
    summaryDiv.style.display = 'block';
    
    // Populate cart items
    const cartList = document.getElementById('cart-items-list');
    cartList.innerHTML = cart.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>KES ${formatPrice(item.price)}</td>
            <td>
                <div class="quantity-control">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <input type="number" value="${item.quantity}" min="1" readonly>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </td>
            <td>KES ${formatPrice(item.price * item.quantity)}</td>
            <td>
                <button class="btn btn-danger" onclick="removeFromCart(${item.id})">Remove</button>
            </td>
        </tr>
    `).join('');
    
    // Update summary
    updateSummary();
}

function formatPrice(price) {
    return new Intl.NumberFormat('en-US').format(price);
}

function updateSummary() {
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    document.getElementById('subtotal').textContent = formatPrice(subtotal);
    document.getElementById('tax').textContent = formatPrice(tax);
    document.getElementById('total').textContent = formatPrice(total);
}

function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    
    const newQuantity = Math.max(1, item.quantity + change);
    
    const formData = new FormData();
    formData.append('action', 'update');
    formData.append('product_id', productId);
    formData.append('quantity', newQuantity);
    
    fetch('php/cart.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        item.quantity = newQuantity;
        displayCart();
    })
    .catch(error => console.error('Error:', error));
}

function removeFromCart(productId) {
    if (!confirm('Are you sure you want to remove this item?')) return;
    
    const formData = new FormData();
    formData.append('action', 'remove');
    formData.append('product_id', productId);
    
    fetch('php/cart.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        cart = cart.filter(i => i.id !== productId);
        displayCart();
    })
    .catch(error => console.error('Error:', error));
}

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    
    // Store cart in localStorage for checkout page
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = 'checkout.html';
}

function showEmptyCart() {
    document.getElementById('cart-empty').style.display = 'block';
    document.getElementById('cart-content').style.display = 'none';
    document.getElementById('cart-summary').style.display = 'none';
}
