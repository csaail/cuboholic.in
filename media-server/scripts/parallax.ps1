# parallax.ps1
# Unified server control script for the Parallax media server.
#
# Usage:
#   .\parallax.ps1 start       - Start Jellyfin + Cloudflare Tunnel
#   .\parallax.ps1 stop        - Stop both services
#   .\parallax.ps1 restart     - Restart both services
#   .\parallax.ps1 status      - Show service status
#   .\parallax.ps1 logs        - Open Jellyfin log folder
#   .\parallax.ps1 open        - Open Jellyfin admin in browser
#   .\parallax.ps1 tunnel      - Start only the Cloudflare Tunnel
#   .\parallax.ps1 kill-tunnel - Stop only the Cloudflare Tunnel

param(
    [Parameter(Position = 0)]
    [ValidateSet("start", "stop", "restart", "status", "logs", "open", "tunnel", "kill-tunnel")]
    [string]$Action = "status"
)

$jellyfinService   = "JellyfinServer"
$cloudflaredService = "cloudflared"
$localUrl          = "http://localhost:8096"
$remoteUrl         = "https://watch.cuboholic.in"
$logPath           = "C:\ProgramData\Jellyfin\Server\log"

function Show-Banner {
    Write-Host ""
    Write-Host "  +======================================+" -ForegroundColor Magenta
    Write-Host "  |          P A R A L L A X             |" -ForegroundColor Magenta
    Write-Host "  |        Media Server Control          |" -ForegroundColor DarkMagenta
    Write-Host "  +======================================+" -ForegroundColor Magenta
    Write-Host ""
}

function Get-ServiceStatus {
    param([string]$Name)
    $svc = Get-Service -Name $Name -ErrorAction SilentlyContinue
    if (-not $svc) { return "NOT INSTALLED" }
    return $svc.Status.ToString()
}

function Start-ServerComponent {
    param([string]$Name, [string]$DisplayName)
    $svc = Get-Service -Name $Name -ErrorAction SilentlyContinue
    if (-not $svc) {
        Write-Host "  [!] $DisplayName is not installed." -ForegroundColor Red
        return $false
    }
    if ($svc.Status -eq "Running") {
        Write-Host "  [=] $DisplayName is already running." -ForegroundColor Yellow
        return $true
    }
    Write-Host "  [>] Starting $DisplayName..." -ForegroundColor Cyan -NoNewline
    try {
        Start-Service -Name $Name -ErrorAction Stop
        Write-Host " OK" -ForegroundColor Green
        return $true
    } catch {
        Write-Host " FAILED" -ForegroundColor Red
        Write-Host "      Run as Administrator if you see Access Denied." -ForegroundColor DarkGray
        return $false
    }
}

function Stop-ServerComponent {
    param([string]$Name, [string]$DisplayName)
    $svc = Get-Service -Name $Name -ErrorAction SilentlyContinue
    if (-not $svc -or $svc.Status -ne "Running") {
        Write-Host "  [=] $DisplayName is not running." -ForegroundColor Yellow
        return $true
    }
    Write-Host "  [x] Stopping $DisplayName..." -ForegroundColor Cyan -NoNewline
    try {
        Stop-Service -Name $Name -Force -ErrorAction Stop
        Write-Host " OK" -ForegroundColor Green
        return $true
    } catch {
        Write-Host " FAILED" -ForegroundColor Red
        return $false
    }
}

function Show-Status {
    $jfStatus = Get-ServiceStatus $jellyfinService
    $cfStatus = Get-ServiceStatus $cloudflaredService

    $jfColor = switch ($jfStatus) { "Running" { "Green" } "Stopped" { "Red" } default { "Yellow" } }
    $cfColor = switch ($cfStatus) { "Running" { "Green" } "Stopped" { "Red" } default { "Yellow" } }

    Write-Host "  Jellyfin Server:    $jfStatus" -ForegroundColor $jfColor
    Write-Host "  Cloudflare Tunnel:  $cfStatus" -ForegroundColor $cfColor
    Write-Host ""

    if ($jfStatus -eq "Running") {
        Write-Host "  Local:   $localUrl" -ForegroundColor DarkGray
    }
    if ($jfStatus -eq "Running" -and $cfStatus -eq "Running") {
        Write-Host "  Remote:  $remoteUrl" -ForegroundColor DarkGray
    }
    Write-Host ""
}

# --- Main ---
Show-Banner

switch ($Action) {
    "start" {
        Write-Host "  Starting Parallax..." -ForegroundColor White
        Write-Host ""
        $jf = Start-ServerComponent $jellyfinService "Jellyfin Server"
        $cf = Start-ServerComponent $cloudflaredService "Cloudflare Tunnel"
        Write-Host ""
        if ($jf -and $cf) {
            Write-Host "  Parallax is LIVE" -ForegroundColor Green
            Write-Host "  Local:   $localUrl" -ForegroundColor DarkGray
            Write-Host "  Remote:  $remoteUrl" -ForegroundColor DarkGray
        }
    }
    "stop" {
        Write-Host "  Shutting down Parallax..." -ForegroundColor White
        Write-Host ""
        Stop-ServerComponent $cloudflaredService "Cloudflare Tunnel"
        Stop-ServerComponent $jellyfinService "Jellyfin Server"
        Write-Host ""
        Write-Host "  Parallax is OFFLINE" -ForegroundColor Red
    }
    "restart" {
        Write-Host "  Restarting Parallax..." -ForegroundColor White
        Write-Host ""
        Stop-ServerComponent $cloudflaredService "Cloudflare Tunnel"
        Stop-ServerComponent $jellyfinService "Jellyfin Server"
        Start-Sleep -Seconds 2
        Start-ServerComponent $jellyfinService "Jellyfin Server"
        Start-ServerComponent $cloudflaredService "Cloudflare Tunnel"
        Write-Host ""
        Write-Host "  Parallax restarted" -ForegroundColor Green
    }
    "status" {
        Show-Status
    }
    "logs" {
        if (Test-Path $logPath) {
            Write-Host "  Opening log folder..." -ForegroundColor Cyan
            explorer.exe $logPath
        } else {
            Write-Host "  Log folder not found: $logPath" -ForegroundColor Red
        }
    }
    "open" {
        Write-Host "  Opening Parallax admin..." -ForegroundColor Cyan
        Start-Process $localUrl
    }
    "tunnel" {
        Start-ServerComponent $cloudflaredService "Cloudflare Tunnel"
    }
    "kill-tunnel" {
        Stop-ServerComponent $cloudflaredService "Cloudflare Tunnel"
    }
}

Write-Host ""
