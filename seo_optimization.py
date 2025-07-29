#!/usr/bin/env python3
"""
SEO optimization script - adds SEO elements without touching layout or structure
"""

import os
import glob
import re
from datetime import datetime

def create_seo_meta_tags():
    """Create SEO meta tags to insert into head section"""
    return '''
    <!-- SEO Meta Tags -->
    <meta name="robots" content="index, follow">
    <meta name="googlebot" content="index, follow">
    <meta name="language" content="ru">
    <meta name="author" content="Riverstrom AI">
    <meta name="keywords" content="AI, искусственный интеллект, машинное обучение, on-premise, не-облачный AI, Riverstrom">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:site_name" content="Riverstrom AI">
    <meta property="og:locale" content="ru_RU">
    <meta property="og:url" content="https://riverstrom.ai/">
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:site" content="@riverstrom">
    <meta name="twitter:creator" content="@riverstrom">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://riverstrom.ai/">'''

def create_structured_data():
    """Create JSON-LD structured data"""
    return '''
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Riverstrom AI",
        "url": "https://riverstrom.ai",
        "description": "Не-облачный Искусственный Интеллект оборудование для запуска AI моделей on-premise",
        "foundingDate": "2024",
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "sales",
            "url": "https://riverstrom.ai/contact/"
        },
        "sameAs": [
            "https://github.com/pangeafate/riverstrom"
        ]
    }
    </script>'''

def get_page_specific_seo(page_path):
    """Get page-specific SEO data"""
    
    page_configs = {
        'page.html': {
            'title': 'Riverstrom AI - Не-облачный Искусственный Интеллект',
            'description': 'Не-облачный Искусственный Интеллект оборудование для запуска AI моделей on-premise. Профессиональные решения для машинного обучения.',
            'url': '/',
            'keywords': 'AI, искусственный интеллект, machine learning, on-premise AI, не-облачный AI'
        },
        'products/page.html': {
            'title': 'Продукты - Riverstrom AI',
            'description': 'Наши продукты для искусственного интеллекта и машинного обучения. Решения on-premise для вашего бизнеса.',
            'url': '/products/',
            'keywords': 'AI продукты, машинное обучение, hardware, on-premise решения'
        },
        'solutions/page.html': {
            'title': 'Решения - Riverstrom AI',
            'description': 'Комплексные решения искусственного интеллекта для различных отраслей. Консультации и внедрение AI.',
            'url': '/solutions/',
            'keywords': 'AI решения, консультации, внедрение искусственного интеллекта'
        },
        'prices/page.html': {
            'title': 'Цены - Riverstrom AI',
            'description': 'Прозрачные цены на продукты и услуги Riverstrom AI. Стоимость решений искусственного интеллекта.',
            'url': '/prices/',
            'keywords': 'цены AI, стоимость, прайс-лист, машинное обучение'
        },
        'contact/page.html': {
            'title': 'Контакты - Riverstrom AI',
            'description': 'Свяжитесь с командой Riverstrom AI. Консультации по внедрению искусственного интеллекта.',
            'url': '/contact/',
            'keywords': 'контакты, связаться, консультация AI, поддержка'
        },
        'blogs/page.html': {
            'title': 'Блог - Riverstrom AI',
            'description': 'Статьи и новости о искусственном интеллекте, машинном обучении и технологиях AI.',
            'url': '/blogs/',
            'keywords': 'блог AI, статьи машинное обучение, новости искусственный интеллект'
        }
    }
    
    # Default for blog articles
    default_blog = {
        'title': 'Статья - Riverstrom AI',
        'description': 'Статья о искусственном интеллекте и машинном обучении от экспертов Riverstrom AI.',
        'url': f'/blogs/{os.path.basename(os.path.dirname(page_path))}/',
        'keywords': 'AI статья, машинное обучение, искусственный интеллект, технологии'
    }
    
    return page_configs.get(page_path, default_blog)

def add_seo_to_html(html_file):
    """Add SEO elements to HTML file without touching existing structure"""
    
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Get page-specific SEO data
        page_info = get_page_specific_seo(html_file)
        
        # Only add SEO if not already present
        if '<!-- SEO Meta Tags -->' in content:
            print(f"SEO already present in {html_file}")
            return False
        
        # Find the closing </head> tag to insert before it
        head_close_match = re.search(r'</head>', content, re.IGNORECASE)
        if not head_close_match:
            print(f"No </head> tag found in {html_file}")
            return False
        
        # Create SEO content
        seo_meta = create_seo_meta_tags()
        
        # Update canonical URL for specific pages
        if html_file != 'page.html':
            seo_meta = seo_meta.replace('https://riverstrom.ai/', f'https://riverstrom.ai{page_info["url"]}')
        
        # Add page-specific meta tags
        page_specific_meta = f'''
    <meta name="description" content="{page_info['description']}">
    <meta name="keywords" content="{page_info['keywords']}">
    <meta property="og:title" content="{page_info['title']}">
    <meta property="og:description" content="{page_info['description']}">
    <meta property="og:url" content="https://riverstrom.ai{page_info['url']}">
    <meta name="twitter:title" content="{page_info['title']}">
    <meta name="twitter:description" content="{page_info['description']}">'''
        
        structured_data = create_structured_data()
        
        # Insert SEO content before </head>
        insert_pos = head_close_match.start()
        new_content = (content[:insert_pos] + 
                      seo_meta + 
                      page_specific_meta + 
                      structured_data + '\n    ' +
                      content[insert_pos:])
        
        # Write the updated content
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✅ Added SEO to {html_file}")
        return True
        
    except Exception as e:
        print(f"❌ Error processing {html_file}: {e}")
        return False

def create_sitemap():
    """Create XML sitemap"""
    
    pages = [
        {'url': '/', 'priority': '1.0'},
        {'url': '/products/', 'priority': '0.8'},
        {'url': '/solutions/', 'priority': '0.8'},
        {'url': '/prices/', 'priority': '0.7'},
        {'url': '/contact/', 'priority': '0.7'},
        {'url': '/blogs/', 'priority': '0.6'},
        {'url': '/blogs/a7130d/', 'priority': '0.5'},
        {'url': '/blogs/a8236/', 'priority': '0.5'},
        {'url': '/blogs/h7230d/', 'priority': '0.5'},
        {'url': '/blogs/ais07/', 'priority': '0.5'},
        {'url': '/blogs/a7135d/', 'priority': '0.5'},
        {'url': '/blogs/a7230x/', 'priority': '0.5'}
    ]
    
    lastmod = datetime.now().strftime('%Y-%m-%d')
    
    sitemap_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    for page in pages:
        sitemap_content += f'''  <url>
    <loc>https://riverstrom.ai{page['url']}</loc>
    <lastmod>{lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>{page['priority']}</priority>
  </url>
'''
    
    sitemap_content += '</urlset>'
    
    with open('sitemap.xml', 'w', encoding='utf-8') as f:
        f.write(sitemap_content)
    
    print("✅ Created sitemap.xml")

def create_robots_txt():
    """Create robots.txt file"""
    
    robots_content = '''User-agent: *
Allow: /

# Sitemaps
Sitemap: https://riverstrom.ai/sitemap.xml

# Crawl-delay
Crawl-delay: 1'''
    
    with open('robots.txt', 'w', encoding='utf-8') as f:
        f.write(robots_content)
    
    print("✅ Created robots.txt")

def main():
    """Main function to add SEO optimization"""
    
    print("🚀 Starting SEO optimization...")
    print("⚠️  Only adding SEO elements - no layout changes!")
    
    # Find all HTML files
    html_files = []
    for pattern in ['*.html', '*/*.html', '*/*/*.html']:
        html_files.extend(glob.glob(pattern))
    
    # Remove index.html from processing (it's just a redirect)
    html_files = [f for f in html_files if f != 'index.html']
    
    print(f"\n🔍 Found {len(html_files)} HTML files to optimize")
    
    # Add SEO to HTML files
    updated_count = 0
    for html_file in html_files:
        if add_seo_to_html(html_file):
            updated_count += 1
    
    # Create SEO files
    create_sitemap()
    create_robots_txt()
    
    print(f"\n🎉 SEO optimization complete!")
    print(f"📝 Updated {updated_count} HTML files with SEO")
    print(f"📄 Created sitemap.xml and robots.txt")
    print("✅ Original layout and structure preserved")

if __name__ == "__main__":
    main()