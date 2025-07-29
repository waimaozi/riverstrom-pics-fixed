<?php
/**
 * config.example.php - Example configuration file
 * Copy this to config.php and set your Gmail credentials
 */

// Gmail SMTP Settings
// You need to generate an App Password in your Google Account settings
// Go to: Google Account > Security > 2-Step Verification > App passwords
define('GMAIL_EMAIL', 'your-email@gmail.com');
define('GMAIL_APP_PASSWORD', 'your-app-password-here');

// Email Settings
define('ADMIN_EMAIL', 'business@riverstrom.ai');
define('FROM_NAME', 'Riverstrom AI Website');

// Optional: Error logging
define('LOG_ERRORS', true);
define('LOG_FILE', 'form_errors.log');