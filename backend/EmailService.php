<?php

namespace Riverstrom;

/**
 * EmailService interface for sending emails
 */
interface EmailService
{
    /**
     * Send email to specified recipient
     * 
     * @param string $to Recipient email address
     * @param string $subject Email subject
     * @param string $firstName First name from form
     * @param string $lastName Last name from form
     * @param string $email Email from form
     * @param string $city City from form
     * @return bool True if email sent successfully, false otherwise
     */
    public function sendEmail(string $to, string $subject, string $firstName, string $lastName, string $email, string $city): bool;
}