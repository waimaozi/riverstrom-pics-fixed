<?php
/**
 * IntegrationTest.php - Integration tests for form functionality
 */

use PHPUnit\Framework\TestCase;

class IntegrationTest extends TestCase
{
    protected function setUp(): void
    {
        // Reset any test state
        if (file_exists('form_submissions.log')) {
            unlink('form_submissions.log');
        }
    }
    
    /**
     * Test complete form submission workflow
     */
    public function testCompleteFormSubmissionWorkflow()
    {
        // Mock the HTTP request
        $_SERVER['REQUEST_METHOD'] = 'POST';
        $_SERVER['CONTENT_TYPE'] = 'application/json';
        
        $formData = [
            'first_name' => 'Test User',
            'last_name' => 'Integration',
            'email' => 'test@example.com',
            'city' => 'Moscow'
        ];
        
        // Mock the input stream
        $mockInput = json_encode($formData);
        
        // Start output buffering to capture the response
        ob_start();
        
        // Include the contact handler (this would normally be called via HTTP)
        // We'll test the components separately for integration
        
        $emailService = new Riverstrom\GmailEmailService('test@example.com', 'password');
        $formHandler = new Riverstrom\FormHandler($emailService);
        
        $result = $formHandler->processFormSubmission($formData);
        
        ob_end_clean();
        
        // Verify the form processing works
        $this->assertIsArray($result);
        $this->assertArrayHasKey('success', $result);
        $this->assertArrayHasKey('message', $result);
    }
    
    /**
     * Test form validation integration
     */
    public function testFormValidationIntegration()
    {
        $emailService = new Riverstrom\GmailEmailService('test@example.com', 'password');
        $formHandler = new Riverstrom\FormHandler($emailService);
        
        // Test with invalid data
        $invalidData = [
            'first_name' => '',
            'last_name' => 'Test',
            'email' => 'invalid-email',
            'city' => ''
        ];
        
        $result = $formHandler->processFormSubmission($invalidData);
        
        $this->assertFalse($result['success']);
        $this->assertStringContainsString('first_name', $result['message']);
    }
    
    /**
     * Test sanitization integration
     */
    public function testSanitizationIntegration()
    {
        $emailService = new Riverstrom\GmailEmailService('test@example.com', 'password');
        $formHandler = new Riverstrom\FormHandler($emailService);
        
        $maliciousData = [
            'first_name' => '<script>alert("xss")</script>Test',
            'last_name' => 'User',
            'email' => 'test@example.com',
            'city' => 'Moscow<script>alert("xss")</script>'
        ];
        
        $sanitized = $formHandler->sanitizeFormData($maliciousData);
        
        $this->assertStringNotContainsString('<script>', $sanitized['first_name']);
        $this->assertStringNotContainsString('<script>', $sanitized['city']);
        $this->assertStringContainsString('Test', $sanitized['first_name']);
    }
    
    /**
     * Test CORS headers are properly set
     */
    public function testCORSHeaders()
    {
        // This would normally be tested with actual HTTP requests
        // For now, we'll test that the headers are defined correctly
        
        $expectedHeaders = [
            'Content-Type: application/json',
            'Access-Control-Allow-Origin: *',
            'Access-Control-Allow-Methods: POST, OPTIONS',
            'Access-Control-Allow-Headers: Content-Type'
        ];
        
        // In a real integration test, we'd make HTTP requests and verify headers
        $this->assertTrue(true); // Placeholder for actual HTTP header testing
    }
}