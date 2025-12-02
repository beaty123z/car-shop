<?php
require_once 'config.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Not logged in']);
    exit();
}

// Get cart from session
if (isset($_GET['action']) && $_GET['action'] == 'get_cart') {
    $cart = isset($_SESSION['cart']) ? $_SESSION['cart'] : [];
    header('Content-Type: application/json');
    echo json_encode($cart);
    exit();
}

// Add to cart
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['action']) && $_POST['action'] == 'add') {
    $product_id = intval($_POST['product_id']);
    $quantity = intval($_POST['quantity']);
    
    if (!isset($_SESSION['cart'])) {
        $_SESSION['cart'] = [];
    }
    
    // Check if product exists
    $query = "SELECT * FROM products WHERE id = :id";
    $stmt = $conn->prepare($query);
    $stmt->execute([':id' => $product_id]);
    $result = $stmt->fetchAll();
    
    if (count($result) === 1) {
        $product = $result[0];
        
        if ($quantity > $product['stock']) {
            echo json_encode(['error' => 'Insufficient stock']);
            exit();
        }
        
        // Check if product already in cart
        $found = false;
        foreach ($_SESSION['cart'] as &$item) {
            if ($item['id'] == $product_id) {
                $item['quantity'] += $quantity;
                $found = true;
                break;
            }
        }
        
        if (!$found) {
            $_SESSION['cart'][] = [
                'id' => $product['id'],
                'name' => $product['name'],
                'price' => $product['price'],
                'quantity' => $quantity,
                'image_url' => $product['image_url']
            ];
        }
        
        header('Content-Type: application/json');
        echo json_encode(['success' => 'Product added to cart']);
    } else {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Product not found']);
    }
    exit();
}

// Remove from cart
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['action']) && $_POST['action'] == 'remove') {
    $product_id = intval($_POST['product_id']);
    
    if (isset($_SESSION['cart'])) {
        $_SESSION['cart'] = array_filter($_SESSION['cart'], function($item) use ($product_id) {
            return $item['id'] != $product_id;
        });
        $_SESSION['cart'] = array_values($_SESSION['cart']); // Re-index array
    }
    
    header('Content-Type: application/json');
    echo json_encode(['success' => 'Product removed from cart']);
    exit();
}

// Update cart quantity
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['action']) && $_POST['action'] == 'update') {
    $product_id = intval($_POST['product_id']);
    $quantity = intval($_POST['quantity']);
    
    if (isset($_SESSION['cart'])) {
        foreach ($_SESSION['cart'] as &$item) {
            if ($item['id'] == $product_id) {
                $item['quantity'] = max(1, $quantity);
                break;
            }
        }
    }
    
    header('Content-Type: application/json');
    echo json_encode(['success' => 'Cart updated']);
    exit();
}

// Clear cart
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['action']) && $_POST['action'] == 'clear') {
    $_SESSION['cart'] = [];
    header('Content-Type: application/json');
    echo json_encode(['success' => 'Cart cleared']);
    exit();
}
?>
