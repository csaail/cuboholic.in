# Troubleshooting Guide

> Common issues and how to resolve them.

---

## Jellyfin Won't Start

### Symptom: http://localhost:8096 doesn't load

1. **Check the service:**
   ```powershell
   Get-Service JellyfinServer
   ```
   - If stopped: `Start-Service JellyfinServer`
   - If missing: reinstall Jellyfin using the installer

2. **Check if port 8096 is in use:**
   ```powershell
   netstat -ano | findstr :8096
   ```
   - If another process is using the port, either stop it or change Jellyfin's
     port in Dashboard → Networking

3. **Check Jellyfin logs:**
   ```
   C:\ProgramData\Jellyfin\Server\log\
   ```
   Look at the most recent `log_*.log` file for errors.

---

## Cloudflare Tunnel Issues

### watch.cuboholic.in shows "502 Bad Gateway"

The tunnel is running but can't reach Jellyfin locally.

1. **Verify Jellyfin is running:**
   ```powershell
   curl http://localhost:8096
   ```
   If this fails, fix Jellyfin first (see above).

2. **Check cloudflared service:**
   ```powershell
   Get-Service cloudflared
   ```
   Restart if needed: `Restart-Service cloudflared`

3. **Check cloudflared config points to correct URL:**
   Open `%USERPROFILE%\.cloudflared\config.yml` and verify:
   ```yaml
   ingress:
     - hostname: watch.cuboholic.in
       service: http://localhost:8096
   ```

### watch.cuboholic.in shows "DNS resolution error"

The DNS record doesn't exist or isn't propagated yet.

1. **Check the CNAME record exists:**
   ```powershell
   nslookup watch.cuboholic.in
   ```
   Should return a CNAME pointing to `*.cfargotunnel.com`

2. **If missing, recreate it:**
   ```powershell
   cloudflared tunnel route dns jellyfin watch.cuboholic.in
   ```

3. **Wait for propagation** — can take up to 5 minutes.

### watch.cuboholic.in shows "1033 Argo Tunnel error"

The tunnel is not running.

```powershell
# Check service status
Get-Service cloudflared

# If stopped, start it
Start-Service cloudflared

# If failing to start, check logs
cloudflared tunnel run jellyfin 2>&1
```

---

## Cloudflare Access Issues

### Approved user can't get past the access page

1. **Verify their email is in the policy:**
   - Go to https://one.dash.cloudflare.com → Access → Applications → Jellyfin
   - Check the policy includes their exact email address
2. **Check they're entering the right email** (case-sensitive for some providers)
3. **Check their spam folder** for the one-time code email

### Want to bypass Access for LAN users

LAN users should use `http://YOUR_PC_IP:8096` instead of the public URL.
Cloudflare Access only applies to traffic through the tunnel.

---

## Playback Issues

### Video buffers constantly for remote users

1. **Check your upload speed:** Run a speed test (https://speed.cloudflare.com)
   - You need at least the bitrate of the video as upload speed
2. **Lower the user's streaming bitrate:**
   Dashboard → Users → [User] → Playback → Internet streaming bitrate limit
3. **Check if transcoding is happening** (Dashboard → Activity → Now Playing)
   - Transcoding adds latency. Ensure files are in Direct Play-friendly formats

### Video plays locally but not remotely

1. **Test the tunnel:** Can you reach the Jellyfin login page remotely?
   - Yes → the issue is playback, not connectivity
   - No → fix the tunnel first (see above)
2. **Check Cloudflare's upload size limits:**
   - Free plan: 100 MB per request — this shouldn't matter for streaming
     as Jellyfin uses chunked transfer, but very large initial requests
     might be affected
3. **Try a different client:** Browser vs Jellyfin app. Apps handle more codecs.

### Unexpected transcoding

Check Dashboard → Activity → Now Playing to see WHY:

| Reason shown              | Fix                                           |
|---------------------------|------------------------------------------------|
| Video codec not supported | Re-encode to H.264, or accept HW transcode    |
| Audio codec not supported | Add an AAC audio track to the file             |
| Subtitle burn-in          | Switch to SRT subtitles (text-based)           |
| Bitrate exceeds limit     | Raise the user's bitrate limit or lower file bitrate |
| Container not supported   | Remux to MP4/MKV                               |

### Hardware transcoding not working

1. **Verify GPU drivers are up to date**
2. **Check Jellyfin logs** for HW accel errors:
   ```
   C:\ProgramData\Jellyfin\Server\log\
   ```
   Search for "hardware" or "acceleration" or "nvenc"/"qsv"/"amf"
3. **Verify the GPU supports the codec:**
   - NVIDIA: https://developer.nvidia.com/video-encode-and-decode-gpu-support-matrix-new
   - Intel QSV: check your CPU generation
4. **Try toggling HW accel off and on** in Dashboard → Playback → Transcoding

---

## Service Recovery After Reboot

Both Jellyfin and cloudflared should auto-start. If they don't:

### Jellyfin not starting on boot

```powershell
# Check startup type
Get-Service JellyfinServer | Select-Object Name, StartType

# Set to automatic if needed
Set-Service JellyfinServer -StartupType Automatic
```

### cloudflared not starting on boot

```powershell
# Check startup type
Get-Service cloudflared | Select-Object Name, StartType

# If not installed as service
cloudflared service install

# Set to automatic
Set-Service cloudflared -StartupType Automatic
```

---

## Logs Reference

| Component   | Log Location                                     |
|-------------|--------------------------------------------------|
| Jellyfin    | `C:\ProgramData\Jellyfin\Server\log\`            |
| cloudflared | Windows Event Viewer → Application → cloudflared |
| Firewall    | Event Viewer → Windows Logs → Security           |

### Reading Jellyfin logs

The most useful log file is the most recent `log_*.log`. Key things to search for:

```
"error"        — errors
"warn"         — warnings
"transcode"    — transcoding activity
"direct play"  — successful direct play
"hardware"     — HW acceleration messages
```

---

## Nuclear Options (Last Resort)

### Reset Jellyfin completely

```powershell
# Stop the service
Stop-Service JellyfinServer

# Delete data (THIS ERASES ALL SETTINGS, USERS, AND METADATA)
Remove-Item -Recurse -Force "C:\ProgramData\Jellyfin\Server\*"

# Restart — will show the setup wizard again
Start-Service JellyfinServer
```

### Recreate the Cloudflare Tunnel

```powershell
# Delete the old tunnel
cloudflared tunnel delete jellyfin

# Create a new one
cloudflared tunnel create jellyfin

# Re-route DNS
cloudflared tunnel route dns jellyfin watch.cuboholic.in

# Update config.yml with new tunnel ID
# Reinstall service
cloudflared service install
```

> **Warning:** These are destructive actions. Try the targeted fixes above first.
