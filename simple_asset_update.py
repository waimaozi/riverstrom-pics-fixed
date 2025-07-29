#!/usr/bin/env python3
"""
Simple script to ONLY replace external asset URLs with local ones
No other changes to HTML structure, meta tags, or layout
"""

import os
import glob
import re

def create_simple_url_mapping():
    """Create mapping for external URLs to local assets"""
    
    # Find all local assets
    asset_files = []
    for root, dirs, files in os.walk('assets'):
        for file in files:
            asset_files.append(os.path.join(root, file))
    
    print(f"Found {len(asset_files)} local asset files")
    
    # Create URL mapping based on filename matching
    url_mapping = {}
    
    for asset_path in asset_files:
        filename = os.path.basename(asset_path)
        
        # Map external URLs to local paths based on file type and name
        if filename.endswith('.webp') or filename.endswith('.png') or filename.endswith('.jpeg') or filename.endswith('.jpg'):
            external_url = f"https://framerusercontent.com/images/{filename}"
            url_mapping[external_url] = asset_path
        elif filename.endswith('.woff2'):
            external_url = f"https://fonts.gstatic.com/s/inter/{filename}"
            url_mapping[external_url] = asset_path
            # Also try other font URL patterns
            if 'inter' in filename.lower():
                alt_url = f"https://fonts.gstatic.com/s/inter/v13/{filename}"
                url_mapping[alt_url] = asset_path
        elif filename.endswith('.mjs') or filename.endswith('.js'):
            external_url = f"https://framerusercontent.com/sites/4zp4mSwd9uFfZhQIdrbx0g/{filename}"
            url_mapping[external_url] = asset_path
        elif filename.endswith('.mp4'):
            external_url = f"https://framerusercontent.com/videos/{filename}"
            url_mapping[external_url] = asset_path
        elif filename.endswith('.pdf'):
            external_url = f"https://framerusercontent.com/assets/{filename}"
            url_mapping[external_url] = asset_path
    
    return url_mapping

def update_html_assets_only(html_file, url_mapping):
    """Update ONLY asset URLs in HTML file, nothing else"""
    
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        replacements_made = 0
        
        # Replace external URLs with local paths
        for external_url, local_path in url_mapping.items():
            if external_url in content:
                content = content.replace(external_url, local_path)
                replacements_made += 1
        
        # Also do pattern-based replacements for any missed URLs
        patterns = [
            (r'https://framerusercontent\.com/images/([^"\')\s]+)', r'assets/images/\1'),
            (r'https://framerusercontent\.com/videos/([^"\')\s]+)', r'assets/videos/\1'),
            (r'https://framerusercontent\.com/assets/([^"\')\s]+)', r'assets/\1'),
            (r'https://framerusercontent\.com/sites/4zp4mSwd9uFfZhQIdrbx0g/([^"\')\s]+)', r'assets/scripts/\1'),
            (r'https://fonts\.gstatic\.com/s/[^/]+/[^/]*(/[^"\')\s]+)', r'assets/fonts\1'),
        ]
        
        for pattern, replacement in patterns:
            new_content = re.sub(pattern, replacement, content)
            if new_content != content:
                content = new_content
                replacements_made += 1
        
        if content != original_content:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Updated {html_file} ({replacements_made} replacements)")
            return True
        else:
            print(f"No changes needed for {html_file}")
            return False
            
    except Exception as e:
        print(f"❌ Error updating {html_file}: {e}")
        return False

def main():
    """Update asset URLs in all HTML files"""
    
    print("🔗 Creating URL mapping for local assets...")
    url_mapping = create_simple_url_mapping()
    print(f"📋 Created {len(url_mapping)} URL mappings")
    
    # Find all HTML files
    html_files = []
    for pattern in ['*.html', '*/*.html', '*/*/*.html']:
        html_files.extend(glob.glob(pattern))
    
    print(f"\n🔍 Found {len(html_files)} HTML files to update")
    
    updated_count = 0
    for html_file in html_files:
        if update_html_assets_only(html_file, url_mapping):
            updated_count += 1
    
    print(f"\n🎉 Asset URL update complete!")
    print(f"📝 Updated {updated_count} out of {len(html_files)} HTML files")
    print("✅ Only asset URLs were changed - all original layout preserved")

if __name__ == "__main__":
    main()