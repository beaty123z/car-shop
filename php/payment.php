<?php
require_once 'config.php';

// Process payment
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['action']) && $_POST['action'] == 'process_payment') {
    header('Content-Type: application/json');
    
    $payment_method = sanitize($_POST['payment_method']);
    $amount = floatval($_POST['amount']);
    
    // Validate payment method
    if (!in_array($payment_method, ['card', 'mpesa'])) {
        echo json_encode(['error' => 'Invalid payment method']);
        exit();
    }
    
    // Simulate payment processing
    // In production, integrate with actual payment gateway
    if ($payment_method === 'card') {
        $card_number = sanitize($_POST['card_number']);
        $expiry = sanitize($_POST['expiry']);
        $cvv = sanitize($_POST['cvv']);
        
        // Basic validation
        if (strlen($card_number) < 13 || strlen($cvv) < 3) {
            echo json_encode(['error' => 'Invalid card details']);
            exit();
        }
        
        // Simulate successful payment
        echo json_encode([
            'success' => 'Payment processed successfully via Card',
            'method' => 'card',
            'amount' => $amount,
            'transaction_id' => 'TXN' . time()
        ]);
    } else if ($payment_method === 'mpesa') {
        $phone = sanitize($_POST['phone']);
        
        // Validate phone number
        if (strlen($phone) < 10) {
            echo json_encode(['error' => 'Invalid phone number']);
            exit();
        }
        
        // Simulate M-Pesa payment
        echo json_encode([
            'success' => 'Payment initiated via M-Pesa. Check your phone for STK prompt.',
            'method' => 'mpesa',
            'amount' => $amount,
            'phone' => $phone,
            'transaction_id' => 'MPESA' . time()
        ]);
    }
    exit();
}

// Verify payment status
if (isset($_GET['action']) && $_GET['action'] == 'verify' && isset($_GET['transaction_id'])) {
    $transaction_id = sanitize($_GET['transaction_id']);
    
    // In production, check actual payment status from payment gateway
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'completed',
        'transaction_id' => $transaction_id,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    exit();
}
?>
