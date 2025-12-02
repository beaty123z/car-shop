// Orders page functionality
document.addEventListener('DOMContentLoaded', function() {
    loadUsername();
    loadOrders();
});

function loadUsername() {
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay) {
        const username = localStorage.getItem('username') || 'Guest';
        usernameDisplay.textContent = `👤 ${username}`;
    }
}

function loadOrders() {
    fetch('php/orders.php?action=get_orders')
        .then(response => response.json())
        .then(data => {
            displayOrders(data);
        })
        .catch(error => {
            console.error('Error loading orders:', error);
            document.getElementById('orders-container').innerHTML = '<p>Error loading orders</p>';
        });
}

function displayOrders(orders) {
    const container = document.getElementById('orders-container');
    
    if (orders.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <p>You haven't placed any orders yet.</p>
                <a href="shop.html" class="btn btn-primary" style="display: inline-block; margin-top: 1rem;">Start Shopping</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = orders.map(order => `
        <div class="order-card" onclick="viewOrderDetails(${order.id})">
            <div class="order-header">
                <span class="order-id">Order #${order.id}</span>
                <span class="order-status status-${order.status}">${order.status.toUpperCase()}</span>
            </div>
            <div class="order-info">
                <div>
                    <span>Order Date:</span>
                    <div>${formatDate(order.order_date)}</div>
                </div>
                <div>
                    <span>Payment Method:</span>
                    <div>${order.payment_method === 'card' ? 'Credit Card' : 'M-Pesa'}</div>
                </div>
                <div>
                    <span>Total:</span>
                    <div class="order-total">KES ${formatPrice(order.total_amount)}</div>
                </div>
            </div>
        </div>
    `).join('');
}

function formatPrice(price) {
    return new Intl.NumberFormat('en-US').format(price);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function viewOrderDetails(orderId) {
    fetch(`php/orders.php?action=get_order_details&order_id=${orderId}`)
        .then(response => response.json())
        .then(data => {
            displayOrderDetailsModal(data);
        })
        .catch(error => console.error('Error:', error));
}

function displayOrderDetailsModal(order) {
    const itemsHtml = order.items.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>KES ${formatPrice(item.unit_price)}</td>
            <td>KES ${formatPrice(item.total_price)}</td>
        </tr>
    `).join('');
    
    const content = `
        <div class="order-modal-content">
            <div class="detail-item">
                <strong>Order ID:</strong>
                <span>#${order.id}</span>
            </div>
            <div class="detail-item">
                <strong>Status:</strong>
                <span>${order.status.toUpperCase()}</span>
            </div>
            <div class="detail-item">
                <strong>Order Date:</strong>
                <span>${formatDate(order.order_date)}</span>
            </div>
            <div class="detail-item">
                <strong>Payment Method:</strong>
                <span>${order.payment_method === 'card' ? 'Credit Card' : 'M-Pesa'}</span>
            </div>
            
            <h4 style="margin-top: 1.5rem; margin-bottom: 1rem;">Order Items</h4>
            <table class="order-table" style="width: 100%;">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>
            
            <div style="background-color: #f3f4f6; padding: 1rem; margin-top: 1rem; border-radius: 0.25rem;">
                <div class="detail-item">
                    <strong>Order Total:</strong>
                    <span style="font-weight: 700; color: #2563eb;">KES ${formatPrice(order.total_amount)}</span>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('order-modal-content').innerHTML = content;
    const modal = document.getElementById('orderDetailsModal');
    modal.classList.add('active');
}

function closeOrderModal() {
    document.getElementById('orderDetailsModal').classList.remove('active');
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modal = document.getElementById('orderDetailsModal');
    if (e.target === modal) {
        closeOrderModal();
    }
});
