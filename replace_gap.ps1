$files = Get-ChildItem -Path . -Recurse -Filter *.html
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $content = $content.Replace('<div class="nav-links" style="gap: 24px;">', '<div class="nav-links">')
    Set-Content -Path $file.FullName -Value $content
}
