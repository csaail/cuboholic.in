# Decision Log

> Records each architectural and tooling choice with rationale.

---

## 1. Media Server: Jellyfin

**Chosen over:** Plex, Emby

| Factor         | Jellyfin          | Plex              | Emby               |
|----------------|-------------------|--------------------|---------------------|
| Cost           | Free, open source | Free tier limited  | Paid for mobile     |
| Remote access  | You control it    | Routes through Plex servers | You control it |
| Transcoding    | HW accel support  | HW accel (paid)    | HW accel (paid)     |
| Plugins        | Open ecosystem    | Curated            | Curated             |

**Why Jellyfin:** Fully free, no premium gates for hardware transcoding or
mobile apps, no dependency on a third-party relay service. You own the whole
stack.

---

## 2. Remote Access: Cloudflare Tunnel

**Chosen over:** Port forwarding + reverse proxy (Nginx/Caddy), Tailscale, WireGuard VPN

| Factor              | Cloudflare Tunnel | Port Forward + Nginx | Tailscale       |
|---------------------|-------------------|----------------------|-----------------|
| Port exposure       | None (outbound)   | Inbound port needed  | None            |
| TLS certificates    | Automatic         | Let's Encrypt setup  | Automatic       |
| Auth layer          | Cloudflare Access  | DIY                  | Built-in ACL    |
| Viewer experience   | Normal HTTPS URL  | Normal HTTPS URL     | Must install app|
| Complexity          | Low               | Medium               | Low             |
| Custom domain       | Native            | Manual DNS           | Extra config    |

**Why Cloudflare Tunnel:**
- **Zero inbound ports** — no attack surface on your home network
- **Free HTTPS** with automatic cert management
- **Cloudflare Access** adds email-based authentication for free (up to 50 users)
- **No client app needed** — viewers just open a URL in their browser
- **Works with cuboholic.in** since you already have/can set up Cloudflare DNS
- Tailscale is excellent but requires every viewer to install the Tailscale client,
  which is a non-starter for casual viewers

---

## 3. Authentication: Two-Layer (Cloudflare Access + Jellyfin)

**Why two layers:**
- **Cloudflare Access** (Layer 1): Stops unauthorized users before they even reach
  your PC. Only approved email addresses can pass.
- **Jellyfin accounts** (Layer 2): Per-user permissions, watch history, playback
  preferences. Even if someone bypasses Cloudflare Access, they still need a
  Jellyfin login.

**Why not just Jellyfin auth alone:**
- Jellyfin's login page would be exposed to the entire internet
- Brute force attempts hit your home PC directly
- Cloudflare Access eliminates this entire attack surface

---

## 4. No Reverse Proxy (Nginx/Caddy)

**Why:** Cloudflare Tunnel connects directly to `localhost:8096`. There is no
need for a local reverse proxy when the tunnel handles TLS termination and
routing. Adding Nginx/Caddy would be unnecessary complexity with no benefit.

---

## 5. Transcoding Strategy: Prioritize Direct Play

**Why:** Direct Play streams the file as-is to the client, using zero server
CPU/GPU. Transcoding only happens when a client can't play the format natively.

**Default policy:**
- Store media in widely compatible formats (H.264 + AAC in MP4/MKV)
- Set Jellyfin to prefer Direct Play
- Configure hardware acceleration as a fallback for when transcoding is needed
- Set per-user bitrate limits based on your upload bandwidth

See `playback-optimization.md` for details.

---

## 6. Library Structure: Single Movies Folder

**Why start simple:** One library, one folder. You can add TV shows, music, or
other libraries later. Jellyfin auto-detects new content when files are added
to the watched folder.

**Recommended naming for best metadata matching:**
```
YOUR_MOVIES_FOLDER_PATH/
├── Movie Name (2024)/
│   └── Movie Name (2024).mkv
├── Another Movie (2023)/
│   └── Another Movie (2023).mp4
```

---

## 7. Domain: watch.cuboholic.in

**Why a subdomain:** Keeps the media server separate from your main site.
`watch.` is intuitive and easy to share with viewers. Your main site continues
to serve from the root domain or `www.` without interference.

---

## 8. Windows Host (Not Docker/Linux)

**Why:** You're running Windows 11 as your daily OS. Running Jellyfin natively
on Windows as a service is the simplest path — no WSL, no Docker, no VM overhead.
The Jellyfin Windows installer handles service registration automatically.
