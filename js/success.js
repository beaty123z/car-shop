// Success page functionality
document.addEventListener('DOMContentLoaded', function() {
    displayOrderDetails();
});

function displayOrderDetails() {
    const orderId = localStorage.getItem('last_order_id');
    const total = localStorage.getItem('last_order_total');
    const paymentMethod = localStorage.getItem('last_payment_method');
    
    if (!orderId) {
        window.location.href = 'shop.html';
        return;
    }
    
    const paymentMethodText = paymentMethod === 'card' ? 'Credit Card' : 'M-Pesa';
    const currentDate = new Date().toLocaleString();
    
    document.getElementById('order-id').textContent = `#${orderId}`;
    document.getElementById('order-amount').textContent = `KES ${formatPrice(total)}`;
    document.getElementById('payment-method').textContent = paymentMethodText;
    document.getElementById('order-date').textContent = currentDate;
    
    // Clear localStorage
    setTimeout(() => {
        localStorage.removeItem('last_order_id');
        localStorage.removeItem('last_order_total');
        localStorage.removeItem('last_payment_method');
    }, 5000);
}

function formatPrice(price) {
    return new Intl.NumberFormat('en-US').format(price);
}
