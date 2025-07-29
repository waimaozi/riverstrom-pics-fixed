/**
 * prices-page-issues.test.js - Tests to verify prices page fixes
 * Following TDD approach - verify the expected behavior after fixes
 */

describe('Prices Page Issues - After Fix', () => {
    const fs = require('fs');
    const path = require('path');
    
    describe('Navigation Links Fixed', () => {
        test('should use root-relative navigation links, not relative to /prices/', () => {
            const pricesIndexPath = path.join(process.cwd(), 'prices', 'index.html');
            const pricesPagePath = path.join(process.cwd(), 'prices', 'page.html');
            
            // Check both index.html and page.html in prices directory
            [pricesIndexPath, pricesPagePath].forEach(filePath => {
                if (fs.existsSync(filePath)) {
                    const content = fs.readFileSync(filePath, 'utf8');
                    
                    // Check that navigation links now use root-relative paths
                    expect(content).toContain('href="/#solutions"');
                    expect(content).toContain('href="/products"');
                    expect(content).toContain('href="/prices"');
                    expect(content).toContain('href="/#manufacturing"');
                    expect(content).toContain('href="/contact"');
                    expect(content).toContain('href="/"'); // Logo link
                    expect(content).toContain('href="/#contactform"');
                    
                    // Verify that old relative paths are NOT present
                    expect(content).not.toContain('href="./#manufacturing"');
                    expect(content).not.toContain('href="./products"');
                    expect(content).not.toContain('href="./contact"');
                }
            });
        });
        
        test('should have correct image asset paths', () => {
            const pricesIndexPath = path.join(process.cwd(), 'prices', 'index.html');
            
            if (fs.existsSync(pricesIndexPath)) {
                const content = fs.readFileSync(pricesIndexPath, 'utf8');
                
                // Check that image paths are correct
                expect(content).toContain('src="../assets/images/');
                expect(content).toContain('srcset="../assets/images/');
                
                // Check that font paths in CSS are correct
                expect(content).toContain('src:url(../assets/fonts/');
                
                // Verify old incorrect paths are NOT present
                expect(content).not.toContain('src="assets/images/');
                expect(content).not.toContain('srcset="assets/images/');
                expect(content).not.toContain('src:url(assets/fonts/');
            }
        });
        
        test('should have correct script asset paths', () => {
            const pricesIndexPath = path.join(process.cwd(), 'prices', 'index.html');
            
            if (fs.existsSync(pricesIndexPath)) {
                const content = fs.readFileSync(pricesIndexPath, 'utf8');
                
                // Check that script paths are correct
                expect(content).toContain('href="../assets/scripts/');
                expect(content).toContain('src="../assets/scripts/');
                
                // Verify old incorrect paths are NOT present
                expect(content).not.toContain('href="assets/scripts/');
                expect(content).not.toContain('src="assets/scripts/');
            }
        });
    });
    
    describe('Pricing Information', () => {
        test('should show correct pricing for RTX4090M', () => {
            const pricesIndexPath = path.join(process.cwd(), 'prices', 'index.html');
            
            if (fs.existsSync(pricesIndexPath)) {
                const content = fs.readFileSync(pricesIndexPath, 'utf8');
                
                // Check that correct pricing is shown
                expect(content).toContain('от 480.000 руб.');
                
                // Verify that the old incorrect price is NOT present
                expect(content).not.toContain('625.000 руб.');
            }
        });
    });
    
    describe('File Structure Verification', () => {
        test('should have both page.html and index.html in prices directory', () => {
            const pricesIndexPath = path.join(process.cwd(), 'prices', 'index.html');
            const pricesPagePath = path.join(process.cwd(), 'prices', 'page.html');
            
            expect(fs.existsSync(pricesIndexPath)).toBe(true);
            expect(fs.existsSync(pricesPagePath)).toBe(true);
        });
    });
});

