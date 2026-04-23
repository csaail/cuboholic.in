# Parallax — User Access Plan

> Two-tier access: Admin (you) + Guest (shared viewer account)

---

## Account Structure

| Account       | Username            | Role     | Can See          | Can Do                        |
|---------------|---------------------|----------|------------------|-------------------------------|
| **Admin**     | `YOUR_ADMIN_USER`   | Admin    | Everything       | Full control, settings, users |
| **Guest**     | `parallax`          | User     | Movies only      | Browse + Watch only           |

---

## Admin Account (You Only)

- Created during Jellyfin setup wizard (Stage 1)
- Has full dashboard access: libraries, transcoding, users, logs
- **Never share this with anyone**
- Access locally via `http://localhost:8096` for admin tasks

---

## Guest Account Setup

After completing Stage 1 (Jellyfin install), create the shared guest account:

### Step-by-step

1. Log in as admin → Dashboard → Users → **Add User**
2. Configure:

| Setting                                | Value                    |
|----------------------------------------|--------------------------|
| Username                               | `parallax`               |
| Password                               | `YOUR_GUEST_PASSWORD`    |
| Allow audio playback                   | Yes                      |
| Allow video playback                   | Yes                      |
| Allow media downloads                  | No                       |
| Allow media deletion                   | **No**                   |
| Allow remote connections               | Yes                      |
| Allow Live TV access                   | No                       |
| Internet streaming bitrate limit       | 20 Mbps (adjust to your upload) |
| Allow this user to manage the server   | **No**                   |
| Allow access to: Movies (Parallax)     | **Yes**                  |
| Allow access to all other libraries    | **No**                   |

3. Under **Feature Access**, disable:
   - Collection management
   - Subtitle management
   - Lyric management

4. Save the user

### What guests see

- Clean movie library grid (Netflix-style with the Parallax theme)
- Movie detail pages with play button
- Search
- Playback controls

### What guests do NOT see

- Admin dashboard
- Server settings
- User management
- Library management
- Transcoding settings
- Activity logs
- Any system configuration

---

## Sharing Access with Viewers

Send your approved viewers this info:

```
🎬 Parallax — Private Cinema

URL:      https://watch.cuboholic.in
Username: parallax
Password: [the guest password you set]

Use the Jellyfin app for best experience:
- Android: https://play.google.com/store/apps/details?id=org.jellyfin.mobile
- iOS: https://apps.apple.com/app/jellyfin-mobile/id1480732557

Server address (in the app): https://watch.cuboholic.in
```

---

## Security Layers

```
Layer 1: Cloudflare Access
         └─ Only approved emails can reach the site at all

Layer 2: Jellyfin Login
         └─ Username + password required

Layer 3: Permission System
         └─ Guest account has zero admin capabilities
```

### Why this is safe for a shared guest password

- **Cloudflare Access is the real gate.** Even if someone learns the guest
  password, they can't reach the login page without an approved email.
- The guest account has no destructive permissions.
- You can change the guest password anytime without affecting your admin account.
- You can monitor all activity in Dashboard → Activity.

---

## Optional: Multiple Guest Accounts

If you later want per-person accounts (for individual watch history):

1. Create separate accounts with the same restricted permissions as above
2. Each person gets their own username/password
3. Jellyfin tracks watch history per account
4. You can revoke individual access without affecting others

For now, the single shared `parallax` account keeps things simple.

---

## Revoking Access

### Quick lockdown (kill remote access entirely)
```powershell
.\parallax.ps1 kill-tunnel
```
This stops the Cloudflare Tunnel. `watch.cuboholic.in` goes offline immediately.
Local access still works.

### Remove a specific email from Cloudflare Access
1. Go to https://one.dash.cloudflare.com → Access → Applications → Jellyfin
2. Edit the policy → remove the email
3. That person is blocked immediately

### Change guest password
1. Dashboard → Users → parallax → Password
2. Set new password
3. Share the new password with approved viewers

### Disable guest account temporarily
1. Dashboard → Users → parallax → Disable this user
2. Re-enable when ready
