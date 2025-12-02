<?php
require_once 'config.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Not logged in']);
    exit();
}

// Create order
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['action']) && $_POST['action'] == 'create') {
    if (empty($_SESSION['cart'])) {
        echo json_encode(['error' => 'Cart is empty']);
        exit();
    }
    
    $payment_method = sanitize($_POST['payment_method']);
    $user_id = $_SESSION['user_id'];
    
    // Calculate total
    $total = 0;
    foreach ($_SESSION['cart'] as $item) {
        $total += $item['price'] * $item['quantity'];
    }
    
    // Start transaction
    $conn->begin_transaction();
    
    try {
        // Insert order
        $order_query = "INSERT INTO orders (user_id, total_amount, payment_method, status) 
                       VALUES ($user_id, $total, '$payment_method', 'completed')";
        
        if (!$conn->query($order_query)) {
            throw new Exception("Order creation failed: " . $conn->error);
        }
        
        $order_id = $conn->insert_id;
        
        // Insert order items
        foreach ($_SESSION['cart'] as $item) {
            $product_id = $item['id'];
            $quantity = $item['quantity'];
            $unit_price = $item['price'];
            $item_total = $unit_price * $quantity;
            
            $item_query = "INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) 
                          VALUES ($order_id, $product_id, $quantity, $unit_price, $item_total)";
            
            if (!$conn->query($item_query)) {
                throw new Exception("Order item insertion failed: " . $conn->error);
            }
            
            // Update product stock
            $stock_query = "UPDATE products SET stock = stock - $quantity WHERE id = $product_id";
            if (!$conn->query($stock_query)) {
                throw new Exception("Stock update failed: " . $conn->error);
            }
        }
        
        $conn->commit();
        
        // Clear cart
        $_SESSION['cart'] = [];
        $_SESSION['last_order_id'] = $order_id;
        $_SESSION['last_order_total'] = $total;
        
        header('Content-Type: application/json');
        echo json_encode([
            'success' => 'Order placed successfully',
            'order_id' => $order_id,
            'total' => $total
        ]);
    } catch (Exception $e) {
        $conn->rollback();
        header('Content-Type: application/json');
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit();
}

// Get user orders
if (isset($_GET['action']) && $_GET['action'] == 'get_orders') {
    $user_id = $_SESSION['user_id'];
    $query = "SELECT * FROM orders WHERE user_id=$user_id ORDER BY order_date DESC";
    $result = $conn->query($query);
    
    $orders = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $orders[] = $row;
        }
    }
    
    header('Content-Type: application/json');
    echo json_encode($orders);
    exit();
}

// Get order details
if (isset($_GET['action']) && $_GET['action'] == 'get_order_details' && isset($_GET['order_id'])) {
    $order_id = intval($_GET['order_id']);
    $user_id = $_SESSION['user_id'];
    
    // Verify order belongs to user
    $order_query = "SELECT * FROM orders WHERE id=$order_id AND user_id=$user_id";
    $order_result = $conn->query($order_query);
    
    if ($order_result->num_rows !== 1) {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Order not found']);
        exit();
    }
    
    // Get order items
    $items_query = "SELECT oi.*, p.name, p.image_url FROM order_items oi 
                   JOIN products p ON oi.product_id = p.id 
                   WHERE oi.order_id=$order_id";
    $items_result = $conn->query($items_query);
    
    $order_details = $order_result->fetch_assoc();
    $order_details['items'] = [];
    
    while ($item = $items_result->fetch_assoc()) {
        $order_details['items'][] = $item;
    }
    
    header('Content-Type: application/json');
    echo json_encode($order_details);
    exit();
}
?>
