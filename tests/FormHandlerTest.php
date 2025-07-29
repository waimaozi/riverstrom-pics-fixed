<?php
/**
 * FormHandlerTest.php - Unit tests for form submission functionality
 * Following TDD approach - write failing tests first
 */

use PHPUnit\Framework\TestCase;
use Riverstrom\FormHandler;
use Riverstrom\EmailService;

class FormHandlerTest extends TestCase
{
    private $formHandler;
    private $mockEmailService;
    
    protected function setUp(): void
    {
        $this->mockEmailService = $this->createMock(EmailService::class);
        $this->formHandler = new FormHandler($this->mockEmailService);
    }
    
    /**
     * Test 1: Form validation should fail with empty required fields
     */
    public function testValidationFailsWithEmptyRequiredFields()
    {
        $formData = [
            'first_name' => '',
            'last_name' => 'Petrov',
            'email' => 'test@example.com',
            'city' => 'Moscow'
        ];
        
        $result = $this->formHandler->validateFormData($formData);
        
        $this->assertFalse($result['valid']);
        $this->assertStringContainsString('first_name', $result['errors'][0]);
    }
    
    /**
     * Test 2: Form validation should fail with invalid email
     */
    public function testValidationFailsWithInvalidEmail()
    {
        $formData = [
            'first_name' => 'Ivan',
            'last_name' => 'Petrov',
            'email' => 'invalid-email',
            'city' => 'Moscow'
        ];
        
        $result = $this->formHandler->validateFormData($formData);
        
        $this->assertFalse($result['valid']);
        $this->assertStringContainsString('email', $result['errors'][0]);
    }
    
    /**
     * Test 3: Form validation should pass with valid data
     */
    public function testValidationPassesWithValidData()
    {
        $formData = [
            'first_name' => 'Ivan',
            'last_name' => 'Petrov',
            'email' => 'ivan.petrov@yandex.ru',
            'city' => 'Moscow'
        ];
        
        $result = $this->formHandler->validateFormData($formData);
        
        $this->assertTrue($result['valid']);
        $this->assertEmpty($result['errors']);
    }
    
    /**
     * Test 4: Form submission should send email with correct data
     */
    public function testFormSubmissionSendsEmailWithCorrectData()
    {
        $formData = [
            'first_name' => 'Ivan',
            'last_name' => 'Petrov',
            'email' => 'ivan.petrov@yandex.ru',
            'city' => 'Moscow'
        ];
        
        $this->mockEmailService->expects($this->once())
            ->method('sendEmail')
            ->with(
                $this->equalTo('business@riverstrom.ai'),
                $this->stringContains('Новая заявка с сайта'),
                $this->stringContains('Ivan'),
                $this->stringContains('Petrov'),
                $this->stringContains('ivan.petrov@yandex.ru'),
                $this->stringContains('Moscow')
            )
            ->willReturn(true);
        
        $result = $this->formHandler->processFormSubmission($formData);
        
        $this->assertTrue($result['success']);
        $this->assertEquals('Сообщение успешно отправлено!', $result['message']);
    }
    
    /**
     * Test 5: Form submission should handle email sending failure
     */
    public function testFormSubmissionHandlesEmailFailure()
    {
        $formData = [
            'first_name' => 'Ivan',
            'last_name' => 'Petrov',
            'email' => 'ivan.petrov@yandex.ru',
            'city' => 'Moscow'
        ];
        
        $this->mockEmailService->expects($this->once())
            ->method('sendEmail')
            ->willReturn(false);
        
        $result = $this->formHandler->processFormSubmission($formData);
        
        $this->assertFalse($result['success']);
        $this->assertEquals('Ошибка при отправке сообщения', $result['message']);
    }
    
    /**
     * Test 6: Form should sanitize input data
     */
    public function testFormSanitizesInputData()
    {
        $formData = [
            'first_name' => '<script>alert("xss")</script>Ivan',
            'last_name' => 'Petrov',
            'email' => 'ivan.petrov@yandex.ru',
            'city' => 'Moscow'
        ];
        
        $sanitized = $this->formHandler->sanitizeFormData($formData);
        
        $this->assertStringNotContainsString('<script>', $sanitized['first_name']);
        $this->assertStringContainsString('Ivan', $sanitized['first_name']);
    }
    
    /**
     * Test 7: Form should log submissions
     */
    public function testFormLogsSubmissions()
    {
        $formData = [
            'first_name' => 'Ivan',
            'last_name' => 'Petrov',
            'email' => 'ivan.petrov@yandex.ru',
            'city' => 'Moscow'
        ];
        
        $this->mockEmailService->expects($this->once())
            ->method('sendEmail')
            ->willReturn(true);
        
        $result = $this->formHandler->processFormSubmission($formData);
        
        $this->assertTrue($result['success']);
        // Check log file exists and contains entry
        $this->assertFileExists('form_submissions.log');
    }
    
    /**
     * Test 8: Form should validate required fields are present
     */
    public function testFormValidatesRequiredFields()
    {
        $incompleteData = [
            'first_name' => 'Ivan',
            'email' => 'ivan@example.com'
            // Missing last_name and city
        ];
        
        $result = $this->formHandler->validateFormData($incompleteData);
        
        $this->assertFalse($result['valid']);
        $this->assertCount(2, $result['errors']); // Should have 2 missing field errors
    }
}