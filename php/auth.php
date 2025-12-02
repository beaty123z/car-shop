<?php
require_once 'config.php';

// Register user
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['register'])) {
    $username = sanitize($_POST['username']);
    $email = sanitize($_POST['email']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    $full_name = sanitize($_POST['full_name']);
    $phone = sanitize($_POST['phone']);
    $address = sanitize($_POST['address']);

    // Validation
    if (empty($username) || empty($email) || empty($password) || empty($full_name)) {
        $_SESSION['error'] = 'All fields are required';
    } elseif (!validateEmail($email)) {
        $_SESSION['error'] = 'Invalid email format';
    } elseif ($password !== $confirm_password) {
        $_SESSION['error'] = 'Passwords do not match';
    } elseif (strlen($password) < 6) {
        $_SESSION['error'] = 'Password must be at least 6 characters';
    } else {
        // Check if user already exists
        $check_query = "SELECT id FROM users WHERE email='$email' OR username='$username'";
        $result = $conn->query($check_query);

        if ($result->num_rows > 0) {
            $_SESSION['error'] = 'Username or Email already exists';
        } else {
            $hashed_password = hashPassword($password);
            $insert_query = "INSERT INTO users (username, email, password, full_name, phone, address) 
                            VALUES ('$username', '$email', '$hashed_password', '$full_name', '$phone', '$address')";

            if ($conn->query($insert_query) === TRUE) {
                $_SESSION['success'] = 'Registration successful! Please login.';
                header('Location: ../login.html');
                exit();
            } else {
                $_SESSION['error'] = 'Registration failed: ' . $conn->error;
            }
        }
    }
}

// Login user
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['login'])) {
    $email = sanitize($_POST['email']);
    $password = $_POST['password'];

    if (empty($email) || empty($password)) {
        $_SESSION['error'] = 'Email and password are required';
    } else {
        $login_query = "SELECT id, username, password FROM users WHERE email='$email'";
        $result = $conn->query($login_query);

        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            if (verifyPassword($password, $user['password'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['success'] = 'Login successful!';
                header('Location: ../shop.html');
                exit();
            } else {
                $_SESSION['error'] = 'Invalid password';
            }
        } else {
            $_SESSION['error'] = 'User not found';
        }
    }
}

// Logout user
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: ../index.html');
    exit();
}
?>
