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

if (!$input || empty($input['email']) || empty($input['appName'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Email and app name are required to process a data deletion request.'
    ]);
    exit;
}

$name = !empty($input['name']) ? htmlspecialchars(trim($input['name'])) : 'User';
$email = filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL);
$appName = htmlspecialchars(trim($input['appName']));
$packageName = !empty($input['packageName']) ? htmlspecialchars(trim($input['packageName'])) : 'N/A';
$requestType = !empty($input['requestType']) ? htmlspecialchars(trim($input['requestType'])) : 'Data Deletion';
$details = !empty($input['details']) ? htmlspecialchars(trim($input['details'])) : 'No additional details provided.';
$ticketId = 'DEL-' . strtoupper(substr(md5(uniqid(rand(), true)), 0, 8));

$to = 'publixaorignal@gmail.com';
$emailSubject = "[Publixa Data Deletion Ticket #" . $ticketId . "] " . $appName;
$emailBody = "Data Deletion Request Notice:\n\n" .
             "Ticket ID: " . $ticketId . "\n" .
             "Requester Name: " . $name . "\n" .
             "Requester Email: " . $email . "\n" .
             "Target App: " . $appName . "\n" .
             "Package Name: " . $packageName . "\n" .
             "Request Type: " . $requestType . "\n\n" .
             "Additional Specifics:\n" . $details . "\n\n" .
             "---\nProcessed by Publixa Compliance Desk (publixa.store)";

$headers = "From: compliance@publixa.store\r\n" .
           "Reply-To: " . $email . "\r\n" .
           "X-Mailer: PHP/" . phpversion();

@mail($to, $emailSubject, $emailBody, $headers);

echo json_encode([
    'success' => true,
    'message' => 'Data deletion ticket #' . $ticketId . ' has been registered. Full purge will complete within 7-14 business days.',
    'request' => [
        'id' => $ticketId,
        'email' => $email,
        'appName' => $appName,
        'status' => 'Pending'
    ]
]);
