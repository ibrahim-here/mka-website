import os

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        updated = False
        
        old_btn_1 = '<button class="mobile-close-btn" aria-label="Close menu" onclick="window.toggleMobileMenu()">&times;</button>'
        new_btn = '<button class="mobile-close-btn" aria-label="Close menu" onclick="document.querySelector(\'.mobile-overlay\').classList.remove(\'active\'); document.body.style.overflow=\'\'; document.querySelectorAll(\'.mobile-menu-toggle\').forEach(btn => btn.classList.remove(\'active\'));">&times;</button>'
        
        old_overlay_1 = '<div class="mobile-overlay" onclick="if(event.target === this) window.toggleMobileMenu()">'
        new_overlay = '<div class="mobile-overlay" onclick="if(event.target === this) { this.classList.remove(\'active\'); document.body.style.overflow=\'\'; document.querySelectorAll(\'.mobile-menu-toggle\').forEach(btn => btn.classList.remove(\'active\')); }">'
        
        if old_btn_1 in content:
            content = content.replace(old_btn_1, new_btn)
            updated = True

        if old_overlay_1 in content:
            content = content.replace(old_overlay_1, new_overlay)
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
