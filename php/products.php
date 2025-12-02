<?php
require_once 'config.php';

// Get all products
if (isset($_GET['action']) && $_GET['action'] == 'get_all') {
    $query = "SELECT * FROM products";
    $result = $conn->query($query);
    
    $products = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }
    }
    
    header('Content-Type: application/json');
    echo json_encode($products);
    exit();
}

// Get single product
if (isset($_GET['action']) && $_GET['action'] == 'get_single' && isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $query = "SELECT * FROM products WHERE id=$id";
    $result = $conn->query($query);
    
    if ($result->num_rows === 1) {
        $product = $result->fetch_assoc();
        header('Content-Type: application/json');
        echo json_encode($product);
    } else {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Product not found']);
    }
    exit();
}

// Get products by category
if (isset($_GET['action']) && $_GET['action'] == 'get_by_category' && isset($_GET['category'])) {
    $category = sanitize($_GET['category']);
    $query = "SELECT * FROM products WHERE category='$category'";
    $result = $conn->query($query);
    
    $products = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }
    }
    
    header('Content-Type: application/json');
    echo json_encode($products);
    exit();
}

// Search products
if (isset($_GET['action']) && $_GET['action'] == 'search' && isset($_GET['query'])) {
    $search = sanitize($_GET['query']);
    $query = "SELECT * FROM products WHERE name LIKE '%$search%' OR description LIKE '%$search%'";
    $result = $conn->query($query);
    
    $products = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }
    }
    
    header('Content-Type: application/json');
    echo json_encode($products);
    exit();
}

// Get categories
if (isset($_GET['action']) && $_GET['action'] == 'get_categories') {
    $query = "SELECT DISTINCT category FROM products";
    $result = $conn->query($query);
    
    $categories = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $categories[] = $row['category'];
        }
    }
    
    header('Content-Type: application/json');
    echo json_encode($categories);
    exit();
}
?>
