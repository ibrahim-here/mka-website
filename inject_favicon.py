import os
import re

def clean_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # If it doesn't have a favicon link, inject it right before </head>
        if '<link rel="icon"' not in content and '</head>' in content:
            favicon_tag = '  <link rel="icon" type="image/png" href="/assets/images/favicon.png">\n'
            content = content.replace('</head>', f'{favicon_tag}</head>')
            
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Injected into {filepath}")
    except Exception as e:
        print(f"Error reading {filepath}: {e}")

for root, dirs, files in os.walk('.'):
    for file in files:
        if file.endswith('.html'):
            clean_file(os.path.join(root, file))
