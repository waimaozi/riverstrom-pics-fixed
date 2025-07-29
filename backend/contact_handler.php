<?php
/**
 * contact_handler.php - Main endpoint for form submissions
 * Handles CORS, validates input, and processes form submissions
 */

require_once '../vendor/autoload.php';

use Riverstrom\FormHandler;
use Riverstrom\GmailEmailService;

// CORS headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    // Get form data
    $input = json_decode(file_get_contents('php://input'), true);
    
    if ($input === null) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
        exit;
    }
    
    // Load configuration (you should set these environment variables)
    $gmailEmail = $_ENV['GMAIL_EMAIL'] ?? 'your-email@gmail.com';
    $gmailPassword = $_ENV['GMAIL_APP_PASSWORD'] ?? 'your-app-password';
    
    // Create services
    $emailService = new GmailEmailService($gmailEmail, $gmailPassword);
    $formHandler = new FormHandler($emailService);
    
    // Process form submission
    $result = $formHandler->processFormSubmission($input);
    
    if ($result['success']) {
        http_response_code(200);
    } else {
        http_response_code(400);
    }
    
    echo json_encode($result);
    
} catch (Exception $e) {
    error_log("Form submission error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error'
    ]);
}