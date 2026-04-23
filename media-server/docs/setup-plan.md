# Parallax — Media Server Setup Plan

> Host: Windows 11 PC | Domain: watch.cuboholic.in
> Architecture: Jellyfin + Cloudflare Tunnel (zero port-forwarding)
> Movies folder: E:\Movies\Parallax

---

## Overview

```
[Remote User] ──HTTPS──▶ [Cloudflare Edge]
                              │
                         Cloudflare Access
                         (email allowlist)
                              │
                      Cloudflare Tunnel
                       (outbound only)
                              │
                    [Your Windows PC]
                     Jellyfin :8096
                              │
                    [E:\Movies\Parallax]
```

**Key properties:**
- No inbound ports opened on your router
- TLS termination at Cloudflare (free)
- Two layers of auth: Cloudflare Access + Jellyfin accounts
- Direct Play prioritized to avoid transcoding

---

## Prerequisites

- [ ] Windows 11 PC (your current machine)
- [ ] Domain `cuboholic.in` with DNS managed by Cloudflare (free plan is fine)
- [ ] Movies folder exists: `E:\Movies\Parallax`
- [ ] Stable internet connection (upload speed matters for remote streaming)
- [ ] Admin access on your PC

---

## Stage 1: Install Jellyfin

### 1.1 Download and install

1. Download the Jellyfin Windows installer from https://jellyfin.org/downloads/windows
   - Choose the **installer** (.exe), not the portable version
   - The installer registers Jellyfin as a Windows service (auto-starts on boot)
2. Run the installer with default settings
3. Jellyfin installs to `C:\Program Files\Jellyfin\Server\`
4. Data directory: `C:\ProgramData\Jellyfin\Server\`

> Or run `scripts/install-jellyfin.ps1` to automate this.

### 1.2 Initial configuration wizard

1. Open http://localhost:8096 in your browser
2. Walk through the setup wizard:
   - **Language:** English (or your preference)
   - **Create admin account:** Pick a strong username + password
     - Username: `YOUR_ADMIN_USERNAME`
     - Password: `YOUR_ADMIN_PASSWORD`
   - **Add media library:**
     - Content type: Movies
     - Display name: **Parallax**
     - Folder: `E:\Movies\Parallax`
     - Metadata language: English
     - Country: India
   - **Preferred metadata language:** English
   - **Remote access:** Leave enabled (we'll secure it via Cloudflare)
   - **Port:** Keep default `8096`
3. Finish the wizard

### 1.3 Validate Stage 1

```
✅ http://localhost:8096 loads the Jellyfin dashboard
✅ You can log in with your admin account
✅ Your movies folder appears under Libraries
✅ Library scan starts and movies begin appearing
✅ You can play a movie locally in the browser
```

---

## Stage 2: Configure Jellyfin for Optimal Playback

### 2.1 Network settings

Dashboard → Settings → Networking:

| Setting                          | Value                    | Why                                   |
|----------------------------------|--------------------------|---------------------------------------|
| Local HTTP port                  | `8096`                   | Default, no reason to change          |
| Allow remote connections         | Enabled                  | Tunnel needs this                     |
| LAN networks                     | `192.168.0.0/16,10.0.0.0/8` | Your local subnets                |
| Known proxies                    | `127.0.0.1`             | Cloudflare Tunnel connects locally    |

### 2.2 Playback / Transcoding settings

Dashboard → Settings → Playback → Transcoding:

| Setting                          | Value                    | Why                                   |
|----------------------------------|--------------------------|---------------------------------------|
| Hardware acceleration            | See notes below          | Reduces CPU load if available         |
| Enable throttling                | Enabled                  | Saves resources during buffering      |
| Transcoding thread count         | Auto                     | Let Jellyfin decide                   |
| Preferred audio codec            | AAC                      | Widest client compatibility           |

**Hardware acceleration selection (pick one based on your GPU):**

| GPU Brand  | Acceleration Type | Notes                                |
|------------|-------------------|--------------------------------------|
| NVIDIA     | NVENC             | Requires GTX 1050+ or equivalent     |
| AMD        | AMF               | Requires RX 400 series+              |
| Intel iGPU | QSV (Quick Sync)  | Most Intel CPUs with integrated graphics |
| None/Other | Software          | CPU-only, works but slow             |

> See `docs/playback-optimization.md` for detailed codec and Direct Play guidance.

### 2.3 Parallax Branding (Netflix-like UI)

Apply the custom theme to make Jellyfin look like a premium cinema app:

1. **Custom CSS** — Dashboard → General → Custom CSS
   - Open `configs/parallax-branding.css`
   - Copy the entire contents
   - Paste into the Custom CSS box → Save

2. **Login Splash** — Dashboard → General → Branding
   - **Server name:** `Parallax`
   - **Login disclaimer:** Open `configs/parallax-splash.html`, copy, paste
   - Save

3. **Result:** Login page shows an animated "PARALLAX — private cinema" splash
   with a glassmorphic login card, Netflix-style card hover zoom on movies,
   staggered load-in animations, and a cinematic dark red theme.

### 2.4 User accounts

Set up two accounts: admin (you) and a shared guest (your viewers).

> See `docs/access-plan.md` for the full details.

**Quick version:**

1. Your admin account was created in Stage 1 — keep this private
2. Create the guest account: Dashboard → Users → Add User
   - Username: `parallax`
   - Password: `YOUR_GUEST_PASSWORD`
   - Disable: media deletion, server management, subtitle/collection management
   - Enable: video playback, audio playback, remote connections
   - Library access: **Parallax (Movies) only**
   - Internet streaming bitrate limit: `20 Mbps` (adjust to your upload)

### 2.4 Validate Stage 2

```
✅ Transcoding settings saved (check Dashboard → Playback)
✅ Hardware acceleration test: play a video, check Dashboard → Activity
    → If HW accel works, you'll see "(HW)" next to the transcode info
✅ Non-admin user can log in and see only their allowed libraries
✅ Non-admin user CANNOT delete media
```

---

## Stage 3: Install and Configure Cloudflare Tunnel

### 3.1 Prerequisites

- Your domain `cuboholic.in` must use Cloudflare's nameservers
- If not already: add the domain at https://dash.cloudflare.com, then update
  your registrar's nameservers to the ones Cloudflare provides

### 3.2 Install cloudflared

1. Download `cloudflared` for Windows:
   https://github.com/cloudflare/cloudflared/releases/latest
   - Get `cloudflared-windows-amd64.msi`
2. Run the MSI installer
3. Verify in a terminal:
   ```powershell
   cloudflared --version
   ```

> Or run `scripts/setup-tunnel.ps1` to automate steps 3.2–3.5.

### 3.3 Authenticate cloudflared

```powershell
cloudflared tunnel login
```

- This opens a browser window
- Select your `cuboholic.in` domain
- A certificate is saved to `%USERPROFILE%\.cloudflared\cert.pem`

### 3.4 Create the tunnel

```powershell
cloudflared tunnel create jellyfin
```

- Note the **Tunnel ID** printed (a UUID like `abcd1234-...`)
- A credentials file is created at:
  `%USERPROFILE%\.cloudflared\<TUNNEL_ID>.json`

### 3.5 Configure the tunnel

Create/edit the config file. A template is provided at `configs/cloudflared-config.yml`.

Copy it to the cloudflared config directory:

```powershell
copy "media-server\configs\cloudflared-config.yml" "%USERPROFILE%\.cloudflared\config.yml"
```

Then edit `%USERPROFILE%\.cloudflared\config.yml`:
- Replace `YOUR_TUNNEL_ID` with your actual Tunnel ID
- Replace `YOUR_TUNNEL_NAME` with `jellyfin` (or whatever you named it)

### 3.6 Create the DNS route

```powershell
cloudflared tunnel route dns jellyfin watch.cuboholic.in
```

This creates a CNAME record: `watch.cuboholic.in → <TUNNEL_ID>.cfargotunnel.com`

### 3.7 Run the tunnel (test)

```powershell
cloudflared tunnel run jellyfin
```

- Leave this terminal open
- Try accessing https://watch.cuboholic.in from another device
- You should see the Jellyfin login page

### 3.8 Install as a Windows service

Once the test works, install as a service so it runs on boot:

```powershell
cloudflared service install
```

This registers `cloudflared` as a Windows service using your config.

### 3.9 Validate Stage 3

```
✅ cloudflared --version returns a version number
✅ cloudflared tunnel list shows your "jellyfin" tunnel
✅ https://watch.cuboholic.in loads Jellyfin login (from any network)
✅ The Cloudflared service appears in services.msc and is set to Automatic
✅ After a PC reboot, https://watch.cuboholic.in still works
```

---

## Stage 4: Secure Access with Cloudflare Access

### 4.1 Set up Cloudflare Access (free tier)

1. Go to https://one.dash.cloudflare.com → Access → Applications
2. Click "Add an application" → **Self-hosted**
3. Configure:
   - **Application name:** Jellyfin
   - **Session duration:** 24 hours
   - **Subdomain:** `watch` | **Domain:** `cuboholic.in`
4. Add a policy:
   - **Policy name:** Approved Users
   - **Action:** Allow
   - **Include rule:** Emails
     - Add each approved user's email address
5. Save

### 4.2 How it works

When a remote user visits `watch.cuboholic.in`:
1. Cloudflare Access shows a login page (email verification)
2. User enters their email → receives a one-time code
3. If their email is on the allowlist → they pass through to Jellyfin
4. Then they log in to Jellyfin with their Jellyfin account

**Two layers of security:**
- Layer 1: Cloudflare Access (email allowlist — blocks unknown users entirely)
- Layer 2: Jellyfin authentication (username + password)

### 4.3 Bypass for local network (optional)

If you want LAN users to skip the Cloudflare Access page:
- They can just use `http://localhost:8096` or `http://YOUR_PC_IP:8096`
- The Cloudflare Access gate only applies to traffic through the tunnel

### 4.4 Validate Stage 4

```
✅ Visiting https://watch.cuboholic.in from a phone (on mobile data) shows
   the Cloudflare Access login first
✅ An approved email can pass through and reach Jellyfin
✅ A non-approved email is blocked
✅ After Cloudflare Access, the Jellyfin login page appears
✅ Local access via http://localhost:8096 still works without Cloudflare Access
```

---

## Stage 5: Windows Firewall Configuration

### 5.1 Why minimal firewall changes

Because Cloudflare Tunnel makes only **outbound** connections, you do NOT need
to open any inbound ports on your router or Windows Firewall for remote access.

You only need a firewall rule if you want **other devices on your LAN** to access
Jellyfin directly (e.g., a TV or tablet on your home Wi-Fi).

### 5.2 LAN access rule (optional)

If you want LAN devices to connect directly:

```powershell
New-NetFirewallRule `
  -DisplayName "Jellyfin (LAN only)" `
  -Direction Inbound `
  -Protocol TCP `
  -LocalPort 8096 `
  -RemoteAddress 192.168.0.0/16,10.0.0.0/8 `
  -Action Allow `
  -Profile Private
```

This allows inbound connections on port 8096 **only from private/LAN IPs**.

### 5.3 Validate Stage 5

```
✅ From another device on your LAN: http://YOUR_PC_IP:8096 loads Jellyfin
✅ Port 8096 is NOT accessible from the public internet
   (test with https://www.yougetsignal.com/tools/open-ports/ → should show closed)
```

---

## Stage 6: Final Validation

Run `scripts/validate.ps1` or manually check:

```
✅ Jellyfin service is running (services.msc → "Jellyfin Server")
✅ Cloudflared service is running (services.msc → "cloudflared")
✅ http://localhost:8096 works locally
✅ https://watch.cuboholic.in works from a different network
✅ Cloudflare Access blocks unapproved emails
✅ A movie plays smoothly via remote access (Direct Play preferred)
✅ Dashboard shows "Direct Play" or "Direct Stream" — not "Transcode"
   for common formats (MP4/MKV with H.264 + AAC)
✅ Both services survive a PC reboot
```

---

## Quick Reference

| Component      | Location / URL                                    |
|----------------|---------------------------------------------------|
| Jellyfin admin | http://localhost:8096                              |
| Remote URL     | https://watch.cuboholic.in                        |
| Jellyfin data  | `C:\ProgramData\Jellyfin\Server\`                 |
| Jellyfin logs  | `C:\ProgramData\Jellyfin\Server\log\`             |
| cloudflared cfg| `%USERPROFILE%\.cloudflared\config.yml`           |
| Movies library | `E:\Movies\Parallax`                              |
| This guide     | `media-server/docs/setup-plan.md`                 |
| Access plan    | `media-server/docs/access-plan.md`                |
| Custom theme   | `media-server/configs/parallax-branding.css`      |
| Login splash   | `media-server/configs/parallax-splash.html`       |

---

## Server Control (Daily Use)

Once everything is set up, use the `parallax` command to manage the server:

```powershell
# From the scripts folder, or add it to your PATH
.\parallax.ps1 start        # Start Jellyfin + Tunnel → go live
.\parallax.ps1 stop         # Kill everything → go offline
.\parallax.ps1 restart      # Restart both services
.\parallax.ps1 status       # Check what's running
.\parallax.ps1 open         # Open admin dashboard in browser
.\parallax.ps1 logs         # Open Jellyfin log folder
.\parallax.ps1 tunnel       # Start only the Cloudflare Tunnel
.\parallax.ps1 kill-tunnel  # Stop only the tunnel (local still works)
```

Or use the batch wrapper from anywhere (if scripts folder is in PATH):
```cmd
parallax start
parallax stop
parallax status
```

### Adding to PATH (one-time)

To use `parallax` from any terminal:

```powershell
# Run once in an elevated PowerShell
$scriptsPath = "FULL_PATH_TO\media-server\scripts"
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
[Environment]::SetEnvironmentVariable("Path", "$currentPath;$scriptsPath", "User")
```

Then restart your terminal. `parallax status` works from anywhere.

---

*See also: `decision-log.md` for rationale, `playback-optimization.md`
for codec/quality tuning, `access-plan.md` for user permissions,
and `troubleshooting.md` for common issues.*
