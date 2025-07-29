/**
 * form-handler.js - Frontend form handling to replace Framer
 * Handles form submission, validation, and user feedback
 */

// Initialize when DOM is loaded
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        initializeForms();
    });
}

/**
 * Initialize all forms on the page
 */
function initializeForms() {
    // Find all contact forms (both main page and contact page)
    const forms = document.querySelectorAll('form.framer-7wmuvs, form.framer-1oy82dr');
    
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
}

/**
 * Handle form submission
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton ? submitButton.textContent : 'Отправить';
    
    // Get form data
    const formData = new FormData(form);
    const data = {
        first_name: formData.get('First') || formData.get('first_name') || '',
        last_name: formData.get('Last') || formData.get('last_name') || '',
        email: formData.get('Email') || formData.get('email') || '',
        city: formData.get('Ваш город') || formData.get('city') || '',
        message: formData.get('message') || ''
    };
    
    // Validate client-side
    if (!validateFormData(data)) {
        return;
    }
    
    // Update button state
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Отправляется...';
    }
    
    try {
        const response = await fetch('/backend/contact_handler.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('Спасибо! Ваше сообщение успешно отправлено. Мы свяжемся с вами в ближайшее время.', 'success');
            form.reset();
        } else {
            showMessage(result.message || 'Произошла ошибка при отправке сообщения', 'error');
        }
        
    } catch (error) {
        console.error('Form submission error:', error);
        showMessage('Произошла ошибка при отправке сообщения. Попробуйте позже.', 'error');
    } finally {
        // Restore button state
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    }
}

/**
 * Validate form data
 */
function validateFormData(data) {
    if (!data.first_name.trim()) {
        showMessage('Пожалуйста, введите имя', 'error');
        return false;
    }
    
    if (!data.last_name.trim()) {
        showMessage('Пожалуйста, введите фамилию', 'error');
        return false;
    }
    
    if (!data.email.trim()) {
        showMessage('Пожалуйста, введите email адрес', 'error');
        return false;
    }
    
    if (!validateEmail(data.email)) {
        showMessage('Пожалуйста, введите корректный email адрес', 'error');
        return false;
    }
    
    if (!data.city.trim()) {
        showMessage('Пожалуйста, выберите город', 'error');
        return false;
    }
    
    return true;
}

/**
 * Validate email format
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Show message to user
 */
function showMessage(message, type) {
    // Remove any existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message--${type}`;
    messageDiv.textContent = message;
    
    // Style the message
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 4px;
        font-weight: 500;
        z-index: 10000;
        max-width: 300px;
        ${type === 'success' ? 
            'background-color: #4caf50; color: white;' : 
            'background-color: #f44336; color: white;'
        }
    `;
    
    // Add to page
    document.body.appendChild(messageDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        handleFormSubmit,
        showMessage,
        validateEmail,
        validateFormData,
        initializeForms
    };
}