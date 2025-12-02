// Checkout page functionality
let checkoutCart = [];

document.addEventListener('DOMContentLoaded', function() {
    loadUsername();
    loadCheckoutCart();
    setupPaymentMethodToggle();
});

function loadUsername() {
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay) {
        const username = localStorage.getItem('username') || 'Guest';
        usernameDisplay.textContent = `👤 ${username}`;
    }
}

function loadCheckoutCart() {
    const cartData = localStorage.getItem('cart');
    if (!cartData) {
        window.location.href = 'cart.html';
        return;
    }
    
    checkoutCart = JSON.parse(cartData);
    displayOrderReview();
}

function displayOrderReview() {
    const orderList = document.getElementById('order-items-list');
    
    orderList.innerHTML = checkoutCart.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>KES ${formatPrice(item.price)}</td>
            <td>KES ${formatPrice(item.price * item.quantity)}</td>
        </tr>
    `).join('');
    
    updateOrderTotals();
}

function formatPrice(price) {
    return new Intl.NumberFormat('en-US').format(price);
}

function updateOrderTotals() {
    let subtotal = 0;
    checkoutCart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    document.getElementById('order-subtotal').textContent = formatPrice(subtotal);
    document.getElementById('order-tax').textContent = formatPrice(tax);
    document.getElementById('order-total').textContent = formatPrice(total);
}

function setupPaymentMethodToggle() {
    const paymentMethods = document.querySelectorAll('input[name="payment_method"]');
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            const cardForm = document.getElementById('card-form');
            const mpesaForm = document.getElementById('mpesa-form');
            
            if (this.value === 'card') {
                cardForm.classList.add('active');
                cardForm.style.display = 'block';
                mpesaForm.classList.remove('active');
                mpesaForm.style.display = 'none';
            } else if (this.value === 'mpesa') {
                mpesaForm.classList.add('active');
                mpesaForm.style.display = 'block';
                cardForm.classList.remove('active');
                cardForm.style.display = 'none';
            }
        });
    });
    
    // Set default
    document.querySelector('input[value="card"]').checked = true;
    document.getElementById('card-form').style.display = 'block';
}

function processPayment() {
    const paymentMethod = document.querySelector('input[name="payment_method"]:checked').value;
    const total = calculateTotal();
    
    if (!validatePaymentForm(paymentMethod)) {
        return;
    }
    
    showProcessingModal();
    
    // Simulate payment processing
    setTimeout(() => {
        completePayment(paymentMethod, total);
    }, 2000);
}

function validatePaymentForm(method) {
    if (method === 'card') {
        const cardholderName = document.getElementById('cardholder-name').value.trim();
        const cardNumber = document.getElementById('card-number').value.trim();
        const expiry = document.getElementById('expiry').value.trim();
        const cvv = document.getElementById('cvv').value.trim();
        
        if (!cardholderName) {
            alert('Please enter cardholder name');
            return false;
        }
        
        if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) {
            alert('Please enter a valid card number');
            return false;
        }
        
        if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
            alert('Please enter expiry date in MM/YY format');
            return false;
        }
        
        if (!cvv || cvv.length < 3) {
            alert('Please enter a valid CVV');
            return false;
        }
    } else if (method === 'mpesa') {
        const phone = document.getElementById('mpesa-phone').value.trim();
        
        if (!phone || phone.length < 10) {
            alert('Please enter a valid phone number');
            return false;
        }
    }
    
    return true;
}

function calculateTotal() {
    let subtotal = 0;
    checkoutCart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    return subtotal * 1.1; // Including 10% tax
}

function showProcessingModal() {
    const modal = document.getElementById('processingModal');
    modal.classList.add('active');
}

function hideProcessingModal() {
    const modal = document.getElementById('processingModal');
    modal.classList.remove('active');
}

function completePayment(method, total) {
    const formData = new FormData();
    formData.append('action', 'create');
    formData.append('payment_method', method);
    
    fetch('php/orders.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Store order info and redirect to success page
            localStorage.setItem('last_order_id', data.order_id);
            localStorage.setItem('last_order_total', total);
            localStorage.setItem('last_payment_method', method);
            localStorage.removeItem('cart');
            
            hideProcessingModal();
            
            // Redirect to success page
            setTimeout(() => {
                window.location.href = 'success.html';
            }, 1000);
        } else {
            hideProcessingModal();
            alert(data.error || 'Payment processing failed');
        }
    })
    .catch(error => {
        hideProcessingModal();
        console.error('Error:', error);
        alert('An error occurred during payment processing');
    });
}

// Format card number with spaces
document.addEventListener('DOMContentLoaded', function() {
    const cardInput = document.getElementById('card-number');
    if (cardInput) {
        cardInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formatted = value.replace(/(\d{4})/g, '$1 ').trim();
            e.target.value = formatted;
        });
    }
    
    // Format expiry date
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
});
