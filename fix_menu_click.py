import os

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        updated = False
        
        old_overlay = '<div class="mobile-overlay" onclick="if(event.target === this) { this.classList.remove(\'active\'); document.body.style.overflow=\'\'; document.querySelectorAll(\'.mobile-menu-toggle\').forEach(btn => btn.classList.remove(\'active\')); }">'
        new_overlay = '<div class="mobile-overlay" onclick="if(!event.target.closest(\'a\')) { this.classList.remove(\'active\'); document.body.style.overflow=\'\'; document.querySelectorAll(\'.mobile-menu-toggle\').forEach(btn => btn.classList.remove(\'active\')); }">'
        
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
