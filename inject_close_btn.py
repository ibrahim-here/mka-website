import os
import re

def inject_button(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original_content = content
        
        # Check if the button already exists to avoid duplicates
        if 'class="mobile-close-btn"' in content:
            return
            
        # Replace the opening <div class="mobile-overlay"> with the button inside it
        button_html = '\n    <button class="mobile-close-btn" onclick="window.toggleMobileMenu()">&times;</button>'
        content = re.sub(r'(<div class="mobile-overlay">)', r'\1' + button_html, content)
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Injected close button into {filepath}")
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

for root, dirs, files in os.walk('.'):
    # skip node_modules
    if 'node_modules' in root:
        continue
    for file in files:
        if file.endswith('.html'):
            inject_button(os.path.join(root, file))
