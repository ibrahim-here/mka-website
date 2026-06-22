import os
import re

def clean_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Remove onclick from .mobile-close-btn
        content = re.sub(r'<button class="mobile-close-btn" aria-label="Close menu" onclick="[^"]*">&times;</button>', 
                         '<button class="mobile-close-btn" aria-label="Close menu">&times;</button>', content)
                         
        # Remove onclick from .mobile-overlay
        content = re.sub(r'<div class="mobile-overlay" onclick="[^"]*">', 
                         '<div class="mobile-overlay">', content)
            
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Cleaned {filepath}")
    except Exception as e:
        print(f"Error reading {filepath}: {e}")

for root, dirs, files in os.walk('.'):
    for file in files:
        if file.endswith('.html'):
            clean_file(os.path.join(root, file))
