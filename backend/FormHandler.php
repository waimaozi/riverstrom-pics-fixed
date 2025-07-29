<?php

namespace Riverstrom;

/**
 * FormHandler - Handles form submission, validation, and processing
 * Implemented following TDD approach
 */
class FormHandler
{
    private EmailService $emailService;
    private array $requiredFields = ['first_name', 'last_name', 'email', 'city'];
    
    public function __construct(EmailService $emailService)
    {
        $this->emailService = $emailService;
    }
    
    /**
     * Validate form data
     * 
     * @param array $formData Form data to validate
     * @return array Validation result with 'valid' boolean and 'errors' array
     */
    public function validateFormData(array $formData): array
    {
        $errors = [];
        
        // Check required fields
        foreach ($this->requiredFields as $field) {
            if (empty($formData[$field])) {
                $errors[] = "Field '{$field}' is required";
            }
        }
        
        // Validate email format
        if (!empty($formData['email']) && !filter_var($formData['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = "Invalid email format";
        }
        
        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }
    
    /**
     * Sanitize form data to prevent XSS
     * 
     * @param array $formData Raw form data
     * @return array Sanitized form data
     */
    public function sanitizeFormData(array $formData): array
    {
        $sanitized = [];
        
        foreach ($formData as $key => $value) {
            if (is_string($value)) {
                $sanitized[$key] = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
            } else {
                $sanitized[$key] = $value;
            }
        }
        
        return $sanitized;
    }
    
    /**
     * Process form submission
     * 
     * @param array $formData Form data to process
     * @return array Processing result with 'success' boolean and 'message' string
     */
    public function processFormSubmission(array $formData): array
    {
        // Validate form data
        $validation = $this->validateFormData($formData);
        if (!$validation['valid']) {
            return [
                'success' => false,
                'message' => implode(', ', $validation['errors'])
            ];
        }
        
        // Sanitize form data
        $sanitizedData = $this->sanitizeFormData($formData);
        
        // Send email
        $emailSent = $this->emailService->sendEmail(
            'business@riverstrom.ai',
            'Новая заявка с сайта',
            $sanitizedData['first_name'],
            $sanitizedData['last_name'],
            $sanitizedData['email'],
            $sanitizedData['city']
        );
        
        if ($emailSent) {
            // Log successful submission
            $this->logSubmission($sanitizedData);
            
            return [
                'success' => true,
                'message' => 'Сообщение успешно отправлено!'
            ];
        } else {
            return [
                'success' => false,
                'message' => 'Ошибка при отправке сообщения'
            ];
        }
    }
    
    /**
     * Log form submission
     * 
     * @param array $formData Sanitized form data
     */
    private function logSubmission(array $formData): void
    {
        $logEntry = date('Y-m-d H:i:s') . " - Form submission from: {$formData['email']} ({$formData['first_name']} {$formData['last_name']})" . PHP_EOL;
        file_put_contents('form_submissions.log', $logEntry, FILE_APPEND | LOCK_EX);
    }
}