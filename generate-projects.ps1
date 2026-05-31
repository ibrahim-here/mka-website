$projects = @(
  @{slug="sozo-water-park"; name="Sozo Water Park"},
  @{slug="masjid-ibrahim-complex"; name="Masjid Ibrahim Complex"},
  @{slug="paediatric-block-mayo"; name="Paediatric Block, Mayo Hospital"},
  @{slug="badami-bagh-bus-terminal"; name="Badami Bagh Bus Terminal"},
  @{slug="chand-bagh-school"; name="Chand Bagh School"},
  @{slug="hashoo-group-corporate-hq"; name="Hashoo Group Corporate HQ"},
  @{slug="model-town-residence"; name="Model Town Residence"},
  @{slug="sialkot-dry-port"; name="Sialkot Dry Port Extension"},
  @{slug="dha-phase-8-sector-plan"; name="DHA Phase 8 Sector Plan"},
  @{slug="pc-hotel-bhurban-renovation"; name="PC Hotel Bhurban Renovation"},
  @{slug="ds-textiles-mill"; name="D.S. Textiles Mill"}
)

$sourceDir = ".\projects\kallar-kahar-park"

foreach ($project in $projects) {
  $targetDir = ".\projects\" + $project.slug
  if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir | Out-Null
  }
  
  $sourceFile = Join-Path $sourceDir "index.html"
  $targetFile = Join-Path $targetDir "index.html"
  
  Copy-Item -Path $sourceFile -Destination $targetFile -Force
  
  $content = Get-Content $targetFile -Raw
  $content = $content -replace "Kallar Kahar Park", $project.name
  Set-Content $targetFile -Value $content
}
