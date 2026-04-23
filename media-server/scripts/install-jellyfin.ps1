# install-jellyfin.ps1
# Downloads and installs Jellyfin Server on Windows.
# Run as Administrator: powershell -ExecutionPolicy Bypass -File install-jellyfin.ps1

#Requires -RunAsAdministrator

$ErrorActionPreference = "Stop"

Write-Host "=== Jellyfin Server Installer ===" -ForegroundColor Cyan

# --- Configuration ---
$installDir = "C:\Program Files\Jellyfin\Server"
$dataDir    = "C:\ProgramData\Jellyfin\Server"
$tempDir    = "$env:TEMP\jellyfin-install"

# --- Step 1: Check if already installed ---
$existingService = Get-Service -Name "JellyfinServer" -ErrorAction SilentlyContinue
if ($existingService) {
    Write-Host "Jellyfin is already installed as a service." -ForegroundColor Yellow
    Write-Host "Status: $($existingService.Status)"
    Write-Host "To reinstall, first uninstall the existing version."
    exit 0
}

# --- Step 2: Get latest release URL from GitHub API ---
Write-Host "`nFetching latest Jellyfin release..." -ForegroundColor Cyan
$releasesUrl = "https://api.github.com/repos/jellyfin/jellyfin/releases/latest"

try {
    $release = Invoke-RestMethod -Uri $releasesUrl -UseBasicParsing
    $version = $release.tag_name -replace '^v', ''
    Write-Host "Latest version: $version"
} catch {
    Write-Host "Could not fetch latest version. Falling back to manual download." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please download the installer manually from:"
    Write-Host "  https://jellyfin.org/downloads/windows" -ForegroundColor Green
    Write-Host ""
    Write-Host "Then run the .exe installer and continue with the setup guide."
    exit 1
}

# Find the Windows installer asset
$installerAsset = $release.assets | Where-Object {
    $_.name -match "jellyfin.*install.*\.exe$" -or
    $_.name -match "jellyfin.*setup.*\.exe$" -or
    $_.name -match "jellyfin.*windows.*\.exe$"
} | Select-Object -First 1

if (-not $installerAsset) {
    Write-Host "Could not find Windows installer in the release assets." -ForegroundColor Yellow
    Write-Host "Please download manually from: https://jellyfin.org/downloads/windows"
    exit 1
}

# --- Step 3: Download ---
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
$installerPath = Join-Path $tempDir $installerAsset.name

Write-Host "Downloading $($installerAsset.name)..." -ForegroundColor Cyan
Invoke-WebRequest -Uri $installerAsset.browser_download_url -OutFile $installerPath -UseBasicParsing
Write-Host "Downloaded to: $installerPath"

# --- Step 4: Install ---
Write-Host "`nRunning installer (this may take a minute)..." -ForegroundColor Cyan
Write-Host "The installer will open. Use default settings." -ForegroundColor Yellow
Start-Process -FilePath $installerPath -Wait

# --- Step 5: Verify ---
Write-Host "`nVerifying installation..." -ForegroundColor Cyan

$service = Get-Service -Name "JellyfinServer" -ErrorAction SilentlyContinue
if ($service) {
    Write-Host "Jellyfin service installed successfully!" -ForegroundColor Green
    Write-Host "Status: $($service.Status)"

    # Ensure it's set to auto-start
    Set-Service -Name "JellyfinServer" -StartupType Automatic

    # Start if not running
    if ($service.Status -ne "Running") {
        Start-Service -Name "JellyfinServer"
        Write-Host "Service started." -ForegroundColor Green
    }
} else {
    Write-Host "Service not found. The installer may have used a different service name." -ForegroundColor Yellow
    Write-Host "Check services.msc manually."
}

# --- Step 6: Open setup wizard ---
Write-Host "`n=== Installation Complete ===" -ForegroundColor Green
Write-Host "Jellyfin should now be running at: http://localhost:8096"
Write-Host "Opening in your default browser..."
Start-Process "http://localhost:8096"

# Cleanup
Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue

Write-Host "`nNext step: Complete the setup wizard in your browser."
Write-Host "See docs/setup-plan.md for detailed instructions."
