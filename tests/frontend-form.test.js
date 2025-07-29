/**
 * frontend-form.test.js - Frontend form functionality tests
 * Following TDD approach for client-side form handling
 */

// Mock fetch for testing
global.fetch = jest.fn();

// Mock DOM methods
const mockSubmitButton = {
    textContent: 'Отправить',
    disabled: false
};

const mockForm = {
    addEventListener: jest.fn(),
    querySelector: jest.fn(() => mockSubmitButton),
    querySelectorAll: jest.fn(() => []),
    reset: jest.fn()
};

const mockFormData = {
    get: jest.fn()
};

// Mock document
Object.defineProperty(global, 'document', {
    value: {
        addEventListener: jest.fn(),
        querySelectorAll: jest.fn(() => [mockForm]),
        querySelector: jest.fn(),
        createElement: jest.fn(() => ({
            className: '',
            textContent: '',
            style: { cssText: '' },
            remove: jest.fn()
        })),
        body: {
            appendChild: jest.fn()
        }
    },
    writable: true
});

// Mock window.FormData
global.FormData = jest.fn(() => mockFormData);

describe('Frontend Form Handler', () => {
    let formHandler;
    
    beforeEach(() => {
        fetch.mockClear();
        mockForm.addEventListener.mockClear();
        mockForm.querySelector.mockReset();
        mockForm.reset.mockClear();
        mockFormData.get.mockClear();
        document.querySelectorAll.mockClear();
        document.createElement.mockClear();
        
        // Setup default form data
        mockForm.querySelector.mockReturnValue(mockSubmitButton);
        mockFormData.get.mockImplementation((field) => {
            const data = {
                'First': 'Ivan',
                'Last': 'Petrov',
                'Email': 'ivan.petrov@yandex.ru',
                'Ваш город': 'Moscow'
            };
            return data[field] || '';
        });
        
        // Load the module under test
        formHandler = require('../assets/js/form-handler.js');
    });

    test('should find and bind to contact forms on page load', () => {
        // Mock forms being found
        document.querySelectorAll.mockReturnValue([mockForm]);
        
        // Call initializeForms
        formHandler.initializeForms();
        
        expect(mockForm.addEventListener).toHaveBeenCalledWith('submit', formHandler.handleFormSubmit);
    });

    test('should prevent default form submission', async () => {
        const mockEvent = {
            preventDefault: jest.fn(),
            target: mockForm
        };
        
        await formHandler.handleFormSubmit(mockEvent);
        
        expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    test('should validate required fields before submission', async () => {
        // Mock incomplete form data
        mockFormData.get.mockImplementation((field) => {
            const data = {
                'First': '', // Empty required field
                'Last': 'Petrov',
                'Email': 'ivan.petrov@yandex.ru',
                'Ваш город': 'Moscow'
            };
            return data[field] || '';
        });
        
        const mockEvent = {
            preventDefault: jest.fn(),
            target: mockForm
        };
        
        await formHandler.handleFormSubmit(mockEvent);
        
        // Should not call fetch if validation fails
        expect(fetch).not.toHaveBeenCalled();
    });

    test('should validate email format', async () => {
        // Mock invalid email
        mockFormData.get.mockImplementation((field) => {
            const data = {
                'First': 'Ivan',
                'Last': 'Petrov',
                'Email': 'invalid-email', // Invalid email
                'Ваш город': 'Moscow'
            };
            return data[field] || '';
        });
        
        const mockEvent = {
            preventDefault: jest.fn(),
            target: mockForm
        };
        
        await formHandler.handleFormSubmit(mockEvent);
        
        // Should not call fetch if email validation fails
        expect(fetch).not.toHaveBeenCalled();
    });

    test('should send POST request with correct data on valid submission', async () => {
        fetch.mockResolvedValueOnce({
            json: async () => ({ success: true, message: 'Success!' })
        });
        
        const mockEvent = {
            preventDefault: jest.fn(),
            target: mockForm
        };
        
        await formHandler.handleFormSubmit(mockEvent);
        
        expect(fetch).toHaveBeenCalledWith('/backend/contact_handler.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                first_name: 'Ivan',
                last_name: 'Petrov',
                email: 'ivan.petrov@yandex.ru',
                city: 'Moscow',
                message: ''
            })
        });
    });

    test('should disable submit button during submission', async () => {
        fetch.mockResolvedValueOnce({
            json: async () => ({ success: true, message: 'Success!' })
        });
        
        const mockEvent = {
            preventDefault: jest.fn(),
            target: mockForm
        };
        
        const promise = formHandler.handleFormSubmit(mockEvent);
        
        // Button should be disabled during submission
        expect(mockSubmitButton.disabled).toBe(true);
        expect(mockSubmitButton.textContent).toBe('Отправляется...');
        
        await promise;
        
        // Button should be re-enabled after submission
        expect(mockSubmitButton.disabled).toBe(false);
        expect(mockSubmitButton.textContent).toBe('Отправить');
    });

    test('should reset form on successful submission', async () => {
        fetch.mockResolvedValueOnce({
            json: async () => ({ success: true, message: 'Success!' })
        });
        
        const mockEvent = {
            preventDefault: jest.fn(),
            target: mockForm
        };
        
        await formHandler.handleFormSubmit(mockEvent);
        
        expect(mockForm.reset).toHaveBeenCalled();
    });

    test('should validate email format correctly', () => {
        expect(formHandler.validateEmail('test@example.com')).toBe(true);
        expect(formHandler.validateEmail('invalid-email')).toBe(false);
        expect(formHandler.validateEmail('')).toBe(false);
    });

    test('should handle network errors gracefully', async () => {
        fetch.mockRejectedValueOnce(new Error('Network error'));
        
        const mockEvent = {
            preventDefault: jest.fn(),
            target: mockForm
        };
        
        // This test ensures the function doesn't throw errors when network fails
        await expect(formHandler.handleFormSubmit(mockEvent)).resolves.not.toThrow();
        
        // Verify the submit button is properly restored after error
        expect(mockSubmitButton.disabled).toBe(false);
        expect(mockSubmitButton.textContent).toBe('Отправить');
    });

    test('should validate form data correctly', () => {
        const validData = {
            first_name: 'Ivan',
            last_name: 'Petrov',
            email: 'ivan@example.com',
            city: 'Moscow'
        };
        
        const invalidData = {
            first_name: '',
            last_name: 'Petrov',
            email: 'invalid-email',
            city: 'Moscow'
        };
        
        // Mock showMessage to prevent actual DOM manipulation in tests
        const originalShowMessage = formHandler.showMessage;
        formHandler.showMessage = jest.fn();
        
        expect(formHandler.validateFormData(validData)).toBe(true);
        expect(formHandler.validateFormData(invalidData)).toBe(false);
        
        // Restore original function
        formHandler.showMessage = originalShowMessage;
    });
});