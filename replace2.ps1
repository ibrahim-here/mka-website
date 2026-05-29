$files = Get-ChildItem -Path . -Recurse -Filter *.html
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $content = $content.Replace("<h2>Let's Build Together</h2>", "<h2>Let's Build<br>Together</h2>")
    Set-Content -Path $file.FullName -Value $content
}
