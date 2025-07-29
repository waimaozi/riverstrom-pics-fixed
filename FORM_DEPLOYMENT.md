# Self-Hosted Form System Deployment

## Overview

This system implements a self-hosted contact form that forwards submissions to `business@riverstrom.ai` using Gmail SMTP, replacing the previous Framer form integration.

## Features

- ✅ Self-hosted PHP backend
- ✅ Gmail SMTP integration
- ✅ Form validation and sanitization
- ✅ XSS protection
- ✅ CORS support
- ✅ Logging of form submissions
- ✅ TDD approach with comprehensive tests
- ✅ No external dependencies (Framer removed)

## Requirements

- PHP 7.4+ with `openssl` and `mbstring` extensions
- Composer (for dependency management)
- Gmail account with App Password enabled

## Installation

### 1. Install Dependencies

```bash
composer install
```

### 2. Configure Gmail SMTP

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Create configuration:**
   ```bash
   cp config.example.php config.php
   ```
4. **Edit `config.php`** with your credentials:
   ```php
   define('GMAIL_EMAIL', 'your-email@gmail.com');
   define('GMAIL_APP_PASSWORD', 'your-16-char-app-password');
   ```

### 3. Upload Files

Upload these files to your web server:
```
/backend/
├── contact_handler.php
├── FormHandler.php
├── EmailService.php
├── GmailEmailService.php
└── config.php
/assets/js/
└── form-handler.js
```

### 4. Update Web Server

Ensure your web server can:
- Execute PHP files
- Allow outbound SMTP connections (port 587)
- Handle CORS headers

## Testing

### Run Tests

```bash
# Run all tests
composer test

# Run specific test file
./vendor/bin/phpunit tests/FormHandlerTest.php
```

### Manual Testing

1. **Fill out form** on website
2. **Check email** at business@riverstrom.ai
3. **Verify logs** in `form_submissions.log`

## Form Fields

The system handles these form fields:
- `first_name` (required)
- `last_name` (required) 
- `email` (required, validated)
- `city` (required)
- `message` (optional)

## Security Features

- **Input Validation:** Required fields, email format validation
- **XSS Protection:** HTML entity encoding
- **CSRF Protection:** Consider adding for production
- **Rate Limiting:** Consider implementing for production
- **Logging:** All submissions logged with timestamps

## API Endpoint

**POST** `/backend/contact_handler.php`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "first_name": "Ivan",
  "last_name": "Petrov", 
  "email": "ivan.petrov@yandex.ru",
  "city": "Moscow",
  "message": "Optional message"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Сообщение успешно отправлено!"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## Troubleshooting

### Common Issues

1. **SMTP Authentication Failed**
   - Verify App Password is correct
   - Ensure 2FA is enabled on Gmail account

2. **CORS Errors**
   - Check web server CORS configuration
   - Verify `Access-Control-Allow-Origin` headers

3. **File Permissions**
   - Ensure PHP can write to log files
   - Check directory permissions (755)

4. **Form Not Submitting**
   - Check browser console for JavaScript errors
   - Verify form handler JavaScript is loaded
   - Check network tab for HTTP errors

### Log Files

- `form_submissions.log` - Successful submissions
- `form_errors.log` - Error details
- Web server error logs

## Production Recommendations

1. **HTTPS Only:** Ensure all traffic uses HTTPS
2. **Rate Limiting:** Implement to prevent spam
3. **CSRF Tokens:** Add for additional security
4. **Input Filtering:** Consider additional validation rules
5. **Monitoring:** Set up alerts for failed submissions
6. **Backup:** Regular backup of log files

## Files Modified

**Frontend:**
- `page.html` - Removed Framer events, added form handler
- `contact/page.html` - Removed Framer events, added form handler
- `assets/js/form-handler.js` - New self-hosted form handling

**Backend:**
- `backend/contact_handler.php` - Main form endpoint
- `backend/FormHandler.php` - Form validation and processing
- `backend/EmailService.php` - Email service interface
- `backend/GmailEmailService.php` - Gmail SMTP implementation

**Configuration:**
- `composer.json` - Dependencies and scripts
- `phpunit.xml` - Test configuration
- `config.example.php` - Configuration template

## Support

For issues with the form system:
1. Check the troubleshooting section above
2. Review log files for error details
3. Test with browser developer tools
4. Verify SMTP credentials are correct