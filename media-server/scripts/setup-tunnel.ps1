# setup-tunnel.ps1
# Installs cloudflared and creates a Cloudflare Tunnel for Jellyfin.
# Run as Administrator: powershell -ExecutionPolicy Bypass -File setup-tunnel.ps1

#Requires -RunAsAdministrator

$ErrorActionPreference = "Stop"

Write-Host "=== Cloudflare Tunnel Setup ===" -ForegroundColor Cyan

# --- Configuration ---
$tunnelName = "jellyfin"
$hostname   = "watch.cuboholic.in"

# --- Step 1: Check if cloudflared is installed ---
$cloudflared = Get-Command cloudflared -ErrorAction SilentlyContinue

if (-not $cloudflared) {
    Write-Host "`ncloudflared is not installed. Downloading..." -ForegroundColor Yellow

    $tempDir = "$env:TEMP\cloudflared-install"
    New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

    $msiUrl = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.msi"
    $msiPath = Join-Path $tempDir "cloudflared-windows-amd64.msi"

    Write-Host "Downloading cloudflared..." -ForegroundColor Cyan
    Invoke-WebRequest -Uri $msiUrl -OutFile $msiPath -UseBasicParsing

    Write-Host "Installing cloudflared..." -ForegroundColor Cyan
    Start-Process msiexec.exe -ArgumentList "/i `"$msiPath`" /quiet /norestart" -Wait

    # Refresh PATH
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

    Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue
}

# Verify installation
$version = & cloudflared --version 2>&1
Write-Host "cloudflared version: $version" -ForegroundColor Green

# --- Step 2: Authenticate ---
Write-Host "`n--- Step 2: Authenticate with Cloudflare ---" -ForegroundColor Cyan
Write-Host "A browser window will open. Select your domain: cuboholic.in" -ForegroundColor Yellow

$certPath = Join-Path $env:USERPROFILE ".cloudflared\cert.pem"
if (Test-Path $certPath) {
    Write-Host "Already authenticated (cert.pem exists). Skipping." -ForegroundColor Green
} else {
    & cloudflared tunnel login
    if (-not (Test-Path $certPath)) {
        Write-Host "Authentication failed. Please run 'cloudflared tunnel login' manually." -ForegroundColor Red
        exit 1
    }
    Write-Host "Authenticated successfully!" -ForegroundColor Green
}

# --- Step 3: Create tunnel ---
Write-Host "`n--- Step 3: Create tunnel ---" -ForegroundColor Cyan

$existingTunnel = & cloudflared tunnel list 2>&1 | Select-String $tunnelName
if ($existingTunnel) {
    Write-Host "Tunnel '$tunnelName' already exists:" -ForegroundColor Yellow
    Write-Host $existingTunnel
} else {
    Write-Host "Creating tunnel '$tunnelName'..."
    & cloudflared tunnel create $tunnelName
    Write-Host "Tunnel created!" -ForegroundColor Green
}

# Get tunnel ID
$tunnelInfo = & cloudflared tunnel list 2>&1 | Select-String $tunnelName
$tunnelId = ($tunnelInfo -split '\s+')[0]
Write-Host "Tunnel ID: $tunnelId"

# --- Step 4: Create config ---
Write-Host "`n--- Step 4: Configure tunnel ---" -ForegroundColor Cyan

$configDir = Join-Path $env:USERPROFILE ".cloudflared"
$configPath = Join-Path $configDir "config.yml"
$credPath = Join-Path $configDir "$tunnelId.json"

$configContent = @"
tunnel: $tunnelId
credentials-file: $credPath

ingress:
  - hostname: $hostname
    service: http://localhost:8096
    originRequest:
      connectTimeout: 30s
      keepAliveTimeout: 90s
      keepAliveConnections: 100
  - service: http_status:404
"@

$configContent | Out-File -FilePath $configPath -Encoding utf8 -Force
Write-Host "Config written to: $configPath" -ForegroundColor Green

# --- Step 5: Route DNS ---
Write-Host "`n--- Step 5: Route DNS ---" -ForegroundColor Cyan
Write-Host "Creating DNS record: $hostname -> tunnel"

& cloudflared tunnel route dns $tunnelName $hostname 2>&1
Write-Host "DNS route created!" -ForegroundColor Green

# --- Step 6: Test ---
Write-Host "`n--- Step 6: Test tunnel ---" -ForegroundColor Cyan
Write-Host "Starting tunnel for a quick test. Press Ctrl+C to stop." -ForegroundColor Yellow
Write-Host "While this runs, try accessing: https://$hostname" -ForegroundColor Yellow
Write-Host ""
Write-Host "Once verified, press Ctrl+C and the script will install it as a service." -ForegroundColor Yellow
Write-Host ""

try {
    & cloudflared tunnel run $tunnelName
} catch {
    # User pressed Ctrl+C
}

# --- Step 7: Install as service ---
Write-Host "`n--- Step 7: Install as Windows service ---" -ForegroundColor Cyan
Write-Host "Installing cloudflared as a Windows service..."

& cloudflared service install
Set-Service -Name "cloudflared" -StartupType Automatic -ErrorAction SilentlyContinue
Start-Service -Name "cloudflared" -ErrorAction SilentlyContinue

Write-Host "`n=== Tunnel Setup Complete ===" -ForegroundColor Green
Write-Host "Jellyfin is now accessible at: https://$hostname"
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Set up Cloudflare Access for authentication"
Write-Host "     See docs/setup-plan.md, Stage 4"
Write-Host "  2. Run scripts/validate.ps1 to verify everything"
