<?php

namespace Riverstrom;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

/**
 * GmailEmailService - Implementation for sending emails via Gmail SMTP
 */
class GmailEmailService implements EmailService
{
    private string $gmailEmail;
    private string $gmailPassword;
    private string $smtpHost = 'smtp.gmail.com';
    private int $smtpPort = 587;
    
    public function __construct(string $gmailEmail, string $gmailPassword)
    {
        $this->gmailEmail = $gmailEmail;
        $this->gmailPassword = $gmailPassword;
    }
    
    /**
     * Send email via Gmail SMTP
     */
    public function sendEmail(string $to, string $subject, string $firstName, string $lastName, string $email, string $city): bool
    {
        try {
            $mail = new PHPMailer(true);
            
            // SMTP configuration
            $mail->isSMTP();
            $mail->Host = $this->smtpHost;
            $mail->SMTPAuth = true;
            $mail->Username = $this->gmailEmail;
            $mail->Password = $this->gmailPassword;
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = $this->smtpPort;
            $mail->CharSet = 'UTF-8';
            
            // Email settings
            $mail->setFrom($this->gmailEmail, 'Riverstrom AI Website');
            $mail->addAddress($to);
            $mail->addReplyTo($email, "{$firstName} {$lastName}");
            
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $this->createEmailBody($firstName, $lastName, $email, $city);
            
            // Send email
            return $mail->send();
            
        } catch (Exception $e) {
            error_log("Email sending error: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Create formatted email body
     */
    private function createEmailBody(string $firstName, string $lastName, string $email, string $city): string
    {
        return "
        <html>
        <head><title>Новая заявка с сайта</title></head>
        <body>
            <h2>Новая заявка с сайта Riverstrom AI</h2>
            <p><strong>Имя:</strong> {$firstName}</p>
            <p><strong>Фамилия:</strong> {$lastName}</p>
            <p><strong>Email:</strong> {$email}</p>
            <p><strong>Город:</strong> {$city}</p>
            <p><strong>Дата:</strong> " . date('Y-m-d H:i:s') . "</p>
            <p><strong>IP адрес:</strong> " . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown') . "</p>
        </body>
        </html>
        ";
    }
}