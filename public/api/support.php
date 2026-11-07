<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['name']) || empty($input['email']) || empty($input['message'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Name, email, and message are required fields.'
    ]);
    exit;
}

$name = htmlspecialchars(trim($input['name']));
$email = filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL);
$subject = !empty($input['subject']) ? htmlspecialchars(trim($input['subject'])) : 'Publixa User Support Inquiry';
$appName = !empty($input['appName']) ? htmlspecialchars(trim($input['appName'])) : 'General Inquiries';
$message = htmlspecialchars(trim($input['message']));

$to = 'publixaorignal@gmail.com';
$emailSubject = "[Publixa Support] " . $subject . " (" . $appName . ")";
$emailBody = "Support Ticket Details:\n\n" .
             "Sender Name: " . $name . "\n" .
             "Sender Email: " . $email . "\n" .
             "Related App: " . $appName . "\n" .
             "Subject: " . $subject . "\n\n" .
             "Message:\n" . $message . "\n\n" .
             "---\nSent via Publixa Website Support Portal (publixa.store)";

$headers = "From: no-reply@publixa.store\r\n" .
           "Reply-To: " . $email . "\r\n" .
           "X-Mailer: PHP/" . phpversion();

@mail($to, $emailSubject, $emailBody, $headers);

echo json_encode([
    'success' => true,
    'message' => 'Your message has been received! Our support team will reply to ' . $email . ' within 24-48 hours.'
]);
