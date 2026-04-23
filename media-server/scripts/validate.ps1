# validate.ps1
# Validates that all media server components are correctly set up.
# Run: powershell -ExecutionPolicy Bypass -File validate.ps1

$ErrorActionPreference = "Continue"

Write-Host "=== Media Server Validation ===" -ForegroundColor Cyan
Write-Host ""

$pass = 0
$fail = 0

function Test-Check {
    param([string]$Name, [scriptblock]$Test)
    try {
        $result = & $Test
        if ($result) {
            Write-Host "  PASS  $Name" -ForegroundColor Green
            $script:pass++
        } else {
            Write-Host "  FAIL  $Name" -ForegroundColor Red
            $script:fail++
        }
    } catch {
        Write-Host "  FAIL  $Name ($_)" -ForegroundColor Red
        $script:fail++
    }
}

# --- Jellyfin Checks ---
Write-Host "--- Jellyfin ---" -ForegroundColor Yellow

Test-Check "Jellyfin service exists" {
    $null -ne (Get-Service -Name "JellyfinServer" -ErrorAction SilentlyContinue)
}

Test-Check "Jellyfin service is running" {
    (Get-Service -Name "JellyfinServer" -ErrorAction SilentlyContinue).Status -eq "Running"
}

Test-Check "Jellyfin service set to auto-start" {
    (Get-Service -Name "JellyfinServer" -ErrorAction SilentlyContinue).StartType -eq "Automatic"
}

Test-Check "Jellyfin responds on localhost:8096" {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8096/health" -UseBasicParsing -TimeoutSec 5
        $response.StatusCode -eq 200
    } catch {
        try {
            # Fallback: try the main page
            $response = Invoke-WebRequest -Uri "http://localhost:8096" -UseBasicParsing -TimeoutSec 5
            $response.StatusCode -eq 200
        } catch {
            $false
        }
    }
}

Test-Check "Jellyfin data directory exists" {
    Test-Path "C:\ProgramData\Jellyfin\Server"
}

# --- Cloudflared Checks ---
Write-Host ""
Write-Host "--- Cloudflare Tunnel ---" -ForegroundColor Yellow

Test-Check "cloudflared is installed" {
    $null -ne (Get-Command cloudflared -ErrorAction SilentlyContinue)
}

Test-Check "cloudflared service exists" {
    $null -ne (Get-Service -Name "cloudflared" -ErrorAction SilentlyContinue)
}

Test-Check "cloudflared service is running" {
    (Get-Service -Name "cloudflared" -ErrorAction SilentlyContinue).Status -eq "Running"
}

Test-Check "cloudflared service set to auto-start" {
    (Get-Service -Name "cloudflared" -ErrorAction SilentlyContinue).StartType -eq "Automatic"
}

Test-Check "cloudflared config file exists" {
    Test-Path (Join-Path $env:USERPROFILE ".cloudflared\config.yml")
}

Test-Check "cloudflared cert.pem exists" {
    Test-Path (Join-Path $env:USERPROFILE ".cloudflared\cert.pem")
}

# --- DNS Check ---
Write-Host ""
Write-Host "--- DNS ---" -ForegroundColor Yellow

Test-Check "watch.cuboholic.in resolves" {
    $result = Resolve-DnsName -Name "watch.cuboholic.in" -ErrorAction SilentlyContinue
    $null -ne $result
}

# --- Network Check ---
Write-Host ""
Write-Host "--- Network ---" -ForegroundColor Yellow

Test-Check "Port 8096 is listening" {
    $listener = Get-NetTCPConnection -LocalPort 8096 -State Listen -ErrorAction SilentlyContinue
    $null -ne $listener
}

Test-Check "Firewall rule for Jellyfin LAN exists" {
    $rule = Get-NetFirewallRule -DisplayName "Jellyfin (LAN only)" -ErrorAction SilentlyContinue
    $null -ne $rule
}

# --- Remote Access Check ---
Write-Host ""
Write-Host "--- Remote Access (requires internet) ---" -ForegroundColor Yellow

Test-Check "https://watch.cuboholic.in is reachable" {
    try {
        $response = Invoke-WebRequest -Uri "https://watch.cuboholic.in" -UseBasicParsing -TimeoutSec 10 -MaximumRedirection 0
        # Any response (even 302 redirect to Cloudflare Access) means the tunnel works
        $true
    } catch [System.Net.WebException] {
        # A 403 or redirect from Cloudflare Access is actually a success
        # (means the tunnel is working, Access is just gating it)
        $_.Exception.Response -ne $null
    } catch {
        $false
    }
}

# --- Summary ---
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Results: $pass passed, $fail failed" -ForegroundColor $(if ($fail -eq 0) { "Green" } else { "Yellow" })
Write-Host "================================" -ForegroundColor Cyan

if ($fail -gt 0) {
    Write-Host ""
    Write-Host "Some checks failed. See docs/troubleshooting.md for help." -ForegroundColor Yellow
}
