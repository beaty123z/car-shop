<?php
require_once 'config.php';

// Get all products
if (isset($_GET['action']) && $_GET['action'] == 'get_all') {
    $query = "SELECT * FROM products";
    $result = $conn->query($query);
    
    $products = $result->fetchAll();
    
    header('Content-Type: application/json');
    echo json_encode($products);
    exit();
}

// Get single product
if (isset($_GET['action']) && $_GET['action'] == 'get_single' && isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $query = "SELECT * FROM products WHERE id = :id";
    $stmt = $conn->prepare($query);
    $stmt->execute([':id' => $id]);
    $result = $stmt->fetchAll();
    
    if (count($result) === 1) {
        $product = $result[0];
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
    $query = "SELECT * FROM products WHERE category = :category";
    $stmt = $conn->prepare($query);
    $stmt->execute([':category' => $category]);
    
    $products = $stmt->fetchAll();
    
    header('Content-Type: application/json');
    echo json_encode($products);
    exit();
}

// Search products
if (isset($_GET['action']) && $_GET['action'] == 'search' && isset($_GET['query'])) {
    $search = '%' . sanitize($_GET['query']) . '%';
    $query = "SELECT * FROM products WHERE name ILIKE :search OR description ILIKE :search";
    $stmt = $conn->prepare($query);
    $stmt->execute([':search' => $search]);
    
    $products = $stmt->fetchAll();
    
    header('Content-Type: application/json');
    echo json_encode($products);
    exit();
}

// Get categories
if (isset($_GET['action']) && $_GET['action'] == 'get_categories') {
    $query = "SELECT DISTINCT category FROM products";
    $result = $conn->query($query);
    
    $categories = [];
    foreach ($result as $row) {
        $categories[] = $row['category'];
    }
    
    header('Content-Type: application/json');
    echo json_encode($categories);
    exit();
}
?>
