/**
 * search-index-pricing.test.js - Tests for correct pricing in search index files
 * Following TDD approach - verify search index contains correct prices
 */

describe('Search Index Pricing Tests', () => {
    const fs = require('fs');
    const path = require('path');
    
    describe('Search Index JSON files should have correct pricing', () => {
        test('should contain correct price "от 480.000 руб." not "625.000 руб." in assets/scripts/searchIndex', () => {
            const searchIndexPath = path.join(process.cwd(), 'assets', 'scripts', 'searchIndex-xj-AT2gnOGEQ.json');
            
            if (fs.existsSync(searchIndexPath)) {
                const content = fs.readFileSync(searchIndexPath, 'utf8');
                
                // Should NOT contain incorrect price
                expect(content).not.toContain('625.000 руб.');
                
                // Should contain correct price
                expect(content).toContain('от 480.000 руб.');
                
                // Should contain the AI station price 
                expect(content).toContain('2.850.000 руб.');
            } else {
                console.warn('Search index file not found:', searchIndexPath);
            }
        });
        
        test('should contain correct price "от 480.000 руб." not "625.000 руб." in assets/searchIndex', () => {
            const searchIndexPath = path.join(process.cwd(), 'assets', 'searchIndex-xj-AT2gnOGEQ.json');
            
            if (fs.existsSync(searchIndexPath)) {
                const content = fs.readFileSync(searchIndexPath, 'utf8');
                
                // Should NOT contain incorrect price
                expect(content).not.toContain('625.000 руб.');
                
                // Should contain correct price
                expect(content).toContain('от 480.000 руб.');
                
                // Should contain the AI station price 
                expect(content).toContain('2.850.000 руб.');
            } else {
                console.warn('Search index file not found:', searchIndexPath);
            }
        });
    });
});