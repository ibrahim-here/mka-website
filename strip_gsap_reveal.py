import os

def strip_gsap_reveal(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.html'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if 'gsap-reveal' in content:
                    new_content = content.replace('gsap-reveal', '')
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Stripped gsap-reveal from {filepath}")

strip_gsap_reveal('./projects')
