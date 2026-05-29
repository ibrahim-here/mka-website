$content = Get-Content -Path "assets\css\style.css" -Raw
$content = $content -replace "'Inter', sans-serif", "'Inter Display', sans-serif"
Set-Content -Path "assets\css\style.css" -Value $content

$contentProj = Get-Content -Path "projects\index.html" -Raw
$contentProj = $contentProj -replace "'Inter', sans-serif", "'Inter Display', sans-serif"
Set-Content -Path "projects\index.html" -Value $contentProj
