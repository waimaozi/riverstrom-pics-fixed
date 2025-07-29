# Riverstrom AI Website

A modern, SEO-optimized website for Riverstrom AI with self-hosted contact forms, built following Test-Driven Development (TDD) principles.

## 🚀 Features

- **Self-hosted Contact Forms**: No third-party dependencies, complete data control
- **SEO Optimized**: Proper meta tags, structured data, and search engine indexing
- **Responsive Design**: Works perfectly on all devices
- **Local Assets**: All images, fonts, and videos hosted locally for fast loading
- **Test-Driven Development**: Comprehensive test coverage for both frontend and backend
- **CI/CD Pipeline**: Automated testing and deployment via GitHub Actions

## 🛠 Technology Stack

### Frontend
- **HTML5/CSS3**: Semantic markup and modern styling
- **JavaScript (ES6+)**: Modern JavaScript with no frameworks
- **Jest**: Frontend testing framework

### Backend  
- **PHP 8.1+**: Server-side form processing
- **PHPMailer**: Email sending functionality
- **PHPUnit**: Backend testing framework

### DevOps
- **GitHub Actions**: CI/CD pipeline
- **GitHub Pages**: Static site hosting
- **Composer**: PHP dependency management
- **npm**: JavaScript package management

## 📋 Prerequisites

- **Node.js** 18.x or higher
- **PHP** 8.1 or higher
- **Composer** 2.x
- **Git**

## 🏗 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/riverstrom-website.git
   cd riverstrom-website
   ```

2. **Install dependencies**
   ```bash
   # Install JavaScript dependencies
   npm install
   
   # Install PHP dependencies
   composer install
   ```

3. **Configure environment**
   ```bash
   # Copy configuration template
   cp config.example.php config.php
   
   # Edit config.php with your email settings
   ```

## 🧪 Testing (TDD)

This project follows Test-Driven Development principles. All features are developed with tests first.

### Running Tests

```bash
# Run all tests
npm test && composer test

# Frontend tests only
npm test

# Backend tests only  
composer test

# Test coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

### Test Coverage

- **Frontend**: 100% function coverage
- **Backend**: 100% method coverage
- **Integration**: Full form submission workflow

## 🔄 Development Workflow

Following TDD principles:

1. **Write failing test** for new feature
2. **Write minimal code** to make test pass
3. **Refactor** while keeping tests green
4. **Commit** with descriptive message

```bash
# Development commands
npm run test:watch    # Watch tests during development
npm run lint         # Check code style
npm run format       # Format code
npm start           # Start local server
```

## 📁 Project Structure

```
riverstrom-website/
├── assets/                 # Static assets
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript files
│   ├── images/            # Image assets
│   ├── fonts/             # Web fonts
│   └── videos/            # Video files
├── backend/               # PHP backend
│   ├── FormHandler.php    # Form processing logic
│   ├── EmailService.php   # Email interface
│   └── GmailEmailService.php # Gmail implementation
├── tests/                 # Test files
│   ├── FormHandlerTest.php     # Backend tests
│   ├── frontend-form.test.js   # Frontend tests
│   └── setup.js               # Test setup
├── .github/               # GitHub Actions
│   └── workflows/
│       └── ci-cd.yml     # CI/CD pipeline
├── blogs/                # Blog pages
├── contact/              # Contact page
├── prices/               # Pricing page
├── products/             # Products page
├── solutions/            # Solutions page
├── index.html            # Home page
├── package.json          # Node.js dependencies
├── composer.json         # PHP dependencies
├── phpunit.xml          # PHPUnit configuration
└── README.md            # This file
```

## 🚀 Deployment

### Automated Deployment (GitHub Actions)

The project includes automated CI/CD pipeline:

1. **Push to main branch** triggers deployment
2. **Tests run** on multiple PHP/Node versions
3. **Security audits** check for vulnerabilities
4. **Deployment** to GitHub Pages if tests pass

### Manual Deployment

```bash
# Ensure tests pass
npm test && composer test

# Deploy to GitHub Pages
git push origin main
```

### Environment Variables

Set these in your hosting environment:

```bash
GMAIL_EMAIL=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
```

## 📊 SEO Features

- Semantic HTML5 structure
- Meta tags for social sharing
- Structured data markup
- XML sitemap
- Robots.txt configuration
- Fast loading times
- Mobile responsiveness

## 🔧 Configuration

### Email Setup

1. Enable 2FA on Gmail account
2. Generate App Password
3. Update `config.php`:

```php
<?php
return [
    'gmail_email' => 'your-email@gmail.com',
    'gmail_password' => 'your-app-password'
];
```

### Form Configuration

Forms are automatically initialized and handle:

- Client-side validation
- Server-side processing
- Email notifications
- Error handling
- Success feedback

## 🔒 Security

- Input sanitization
- CSRF protection
- XSS prevention
- Email validation
- Rate limiting ready
- Security headers

## 📈 Performance

- Local asset hosting
- Optimized images
- Minified CSS/JS
- Efficient form handling
- Fast server responses

## 🐛 Troubleshooting

### Common Issues

1. **SMTP Authentication Failed**
   - Verify App Password is correct
   - Ensure 2FA is enabled

2. **Tests Failing**
   - Check Node.js/PHP versions
   - Clear node_modules and vendor
   - Reinstall dependencies

3. **Form Not Submitting**
   - Check browser console for errors
   - Verify backend configuration
   - Check server logs

### Debug Mode

```bash
# Enable verbose testing
npm test -- --verbose

# Check coverage
npm run test:coverage

# PHP error reporting
tail -f form_errors.log
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for new functionality
4. Implement feature following TDD
5. Ensure tests pass (`npm test && composer test`)
6. Commit changes (`git commit -m 'Add amazing feature'`)
7. Push to branch (`git push origin feature/amazing-feature`)
8. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support with this website:

1. Check the [troubleshooting section](#-troubleshooting)
2. Review test output for errors
3. Check server logs
4. Open an issue on GitHub

## 📚 Documentation

Additional documentation:

- [Form Deployment Guide](FORM_DEPLOYMENT.md)
- [API Documentation](docs/api.md)
- [Testing Guide](docs/testing.md)

---

**Built with ❤️ following TDD principles**