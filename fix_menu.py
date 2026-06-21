import os

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        updated = False
        
        old_btn = '<button class="mobile-close-btn" aria-label="Close menu">&times;</button>'
        new_btn = '<button class="mobile-close-btn" aria-label="Close menu" onclick="window.toggleMobileMenu()">&times;</button>'
        
        # also check if the button doesn't have aria-label
        old_btn_2 = '<button class="mobile-close-btn">&times;</button>'
        new_btn_2 = '<button class="mobile-close-btn" onclick="window.toggleMobileMenu()">&times;</button>'
        
        if old_btn in content:
            content = content.replace(old_btn, new_btn)
            updated = True
        elif old_btn_2 in content:
            content = content.replace(old_btn_2, new_btn_2)
            updated = True

        old_overlay = '<div class="mobile-overlay">'
        new_overlay = '<div class="mobile-overlay" onclick="if(event.target === this) window.toggleMobileMenu()">'
        
        if old_overlay in content:
            content = content.replace(old_overlay, new_overlay)
            updated = True
            
        if updated:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed {filepath}")
    except Exception as e:
        print(f"Error reading {filepath}: {e}")

for root, dirs, files in os.walk('.'):
    for file in files:
        if file.endswith('.html'):
            fix_file(os.path.join(root, file))
