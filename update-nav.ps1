$files = Get-ChildItem -Path . -Recurse -Filter *.html
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    $homeActive = ''
    $aboutActive = ''
    $projectsActive = ''
    $servicesActive = ''
    $galleryActive = ''
    
    $path = $file.FullName
    if ($path -match 'about\\index\.html') { $aboutActive = ' class="active"' }
    elseif ($path -match 'projects\\.*index\.html') { $projectsActive = ' class="active"' }
    elseif ($path -match 'services\\index\.html') { $servicesActive = ' class="active"' }
    elseif ($path -match 'gallery\\index\.html') { $galleryActive = ' class="active"' }
    elseif ($path -match 'MKA\\index\.html$') { $homeActive = ' class="active"' }

    $newNav = "      <div class=`"nav-links`">`r`n" +
              "        <a href=`"/index.html`"$homeActive>HOME</a>`r`n" +
              "        <a href=`"/about/index.html`"$aboutActive>ABOUT</a>`r`n" +
              "        <a href=`"/projects/index.html`"$projectsActive>PROJECTS</a>`r`n" +
              "        <a href=`"/services/index.html`"$servicesActive>SERVICES</a>`r`n" +
              "        <a href=`"/gallery/index.html`"$galleryActive>GALLERY</a>`r`n" +
              "      </div>"

    $content = [System.Text.RegularExpressions.Regex]::Replace($content, '(?s)      <div class="nav-links">\s*<a href="/index\.html"[^>]*>.*?</div>', $newNav)
    Set-Content $file.FullName -Value $content
}
