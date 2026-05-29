$files = Get-ChildItem -Path . -Recurse -Filter *.html
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $pattern = '(?s)<div class="dropdown-container">\s*<a href="/projects/index\.html"(.*?)>PROJECTS</a>\s*<div class="dropdown-menu">.*?</div>\s*</div>'
    $replacement = '<a href="/projects/index.html"$1>PROJECTS</a>'
    $content = [regex]::Replace($content, $pattern, $replacement)
    Set-Content -Path $file.FullName -Value $content
}
