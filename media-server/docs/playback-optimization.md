# Playback Optimization Guide

> Goal: Maximize Direct Play, minimize transcoding, ensure smooth remote streaming.

---

## Direct Play vs Transcode — Why It Matters

| Mode           | Server CPU/GPU | Quality  | Bandwidth       |
|----------------|----------------|----------|-----------------|
| Direct Play    | ~0%            | Original | File bitrate    |
| Direct Stream  | Minimal        | Original | File bitrate    |
| Transcode      | High           | Reduced  | Configurable    |

**Direct Play** = the server sends the file byte-for-byte to the client.
Zero processing. Best quality. This is what we want 95% of the time.

**Direct Stream** = the video/audio is compatible but the container isn't
(e.g., client wants MP4 but file is MKV). Server re-wraps without re-encoding.
Negligible CPU cost.

**Transcode** = server decodes and re-encodes the video. Heavy CPU/GPU use,
quality loss, and delay. Only needed when the client truly can't play the format.

---

## Store Media in Compatible Formats

The single most impactful optimization: **store your files in formats that
clients can Direct Play.**

### The "universal" format

```
Container:  MP4 or MKV
Video:      H.264 (AVC), 1080p, 8-bit
Audio:      AAC stereo (or AAC 5.1)
Subtitles:  SRT (external) or embedded text-based (SRT/ASS)
```

This combination Direct Plays on virtually every client:
- Web browsers (Chrome, Firefox, Edge, Safari)
- Jellyfin mobile apps (Android, iOS)
- Smart TVs, Fire Stick, Chromecast, Roku

### Formats that often force transcoding

| Format        | Issue                                     | Fix                        |
|---------------|-------------------------------------------|----------------------------|
| H.265 (HEVC)  | Many browsers can't decode it             | Keep H.264 for broad compat, or accept transcoding |
| DTS / TrueHD  | No browser supports these audio codecs    | Include an AAC audio track |
| PGS subtitles  | Image-based, must be burned in           | Use SRT subtitles instead  |
| AVI container  | Ancient, poor seeking support            | Re-mux to MKV/MP4         |
| 4K + HDR       | Needs client support + bandwidth         | Have a 1080p version too   |

### Recommended: dual audio tracks

If your files have DTS/TrueHD audio, remux them to include an AAC track:

```powershell
# Example using ffmpeg (add AAC track while keeping original)
ffmpeg -i input.mkv -map 0 -c copy -c:a:1 aac -b:a:1 256k output.mkv
```

This way, capable clients (like a TV with DTS) get Direct Play with DTS,
while browsers fall back to the AAC track — still Direct Play, no transcode.

---

## Jellyfin Transcoding Settings

Dashboard → Settings → Playback → Transcoding:

### Hardware Acceleration

Pick based on your GPU:

#### NVIDIA GPU (NVENC)
- Hardware acceleration: **NVIDIA NVENC**
- Enable: H.264, HEVC encoding
- Requires: GTX 1050+ or any RTX card
- Driver: Latest Game Ready or Studio driver

#### Intel iGPU (Quick Sync)
- Hardware acceleration: **Intel Quick Sync Video (QSV)**
- Enable: H.264, HEVC encoding
- Requires: Intel CPU with integrated graphics (most 6th gen+)
- Note: Works even if you have a discrete GPU — just ensure iGPU is enabled in BIOS

#### AMD GPU (AMF)
- Hardware acceleration: **Video Acceleration API (VA-API)** — note: on Windows
  Jellyfin uses AMF natively
- Enable: H.264, HEVC encoding
- Requires: RX 400 series+

#### No compatible GPU
- Hardware acceleration: **None**
- Jellyfin will use software (CPU) transcoding
- Limit simultaneous transcodes to 1-2 to avoid overloading your system

### Other transcoding settings

| Setting                            | Recommended Value |
|------------------------------------|-------------------|
| Transcoding thread count           | Auto              |
| Enable throttling                  | Yes               |
| Throttle delay (seconds)           | 60                |
| Hardware decoding codecs           | All available     |
| Enable tone-mapping               | Yes (if HDR content) |
| Tone-mapping algorithm            | BT.2390           |
| Fallback font                     | Leave default     |

---

## Bandwidth Planning

Your upload speed determines how many simultaneous remote streams you can serve.

### Typical bitrates

| Quality       | Bitrate     | Per-stream upload needed |
|---------------|-------------|--------------------------|
| 1080p Direct Play (typical) | 5-15 Mbps | 5-15 Mbps upload   |
| 1080p Transcode (8 Mbps)   | 8 Mbps    | 8 Mbps upload       |
| 720p Transcode (4 Mbps)    | 4 Mbps    | 4 Mbps upload       |
| 4K Direct Play              | 20-60 Mbps | 20-60 Mbps upload  |

### Calculate your capacity

```
Simultaneous streams = Your upload speed (Mbps) ÷ Average bitrate per stream
```

**Example:** 50 Mbps upload ÷ 10 Mbps per stream = ~5 simultaneous 1080p streams

### Per-user bitrate limits

If your upload is limited, set per-user streaming bitrate caps:

Dashboard → Users → [User] → Playback:
- **Internet streaming bitrate limit:** Set based on your upload / expected viewers
- Example: 20 Mbps limit if you have 50 Mbps upload and expect 2 concurrent viewers

---

## Client Recommendations for Best Direct Play

| Client                | Direct Play Success | Notes                          |
|-----------------------|--------------------|--------------------------------|
| Jellyfin Android app  | Excellent          | Uses ExoPlayer, wide codec support |
| Jellyfin iOS app      | Good               | Some HEVC limits on older devices  |
| Chrome / Edge browser | Good               | No HEVC without extension          |
| Firefox               | Fair               | Limited codec support              |
| Jellyfin for Fire TV  | Excellent          | Native app, hardware decoding      |
| Smart TV apps         | Varies             | Check your TV's codec support      |

**Tip for remote viewers:** Recommend the Jellyfin app (Android/iOS) over
the web browser. Apps have better codec support and are more likely to
Direct Play without triggering a transcode.

---

## Monitoring Playback

Dashboard → Activity → Now Playing:

- **Direct Play:** Shows source format, no transcode indicator
- **Direct Stream:** Shows "Direct Stream" — container remux only
- **Transcode:** Shows "(HW)" for hardware or CPU icon for software
  - Note the reason: video codec, audio codec, or subtitle burn-in

If you see unexpected transcoding:
1. Check the format against the compatibility table above
2. Check if subtitles are the cause (PGS/VOBSUB force burn-in → transcode)
3. Check the client's maximum bitrate setting
4. Check user's "Maximum streaming bitrate" in their profile
5. See `troubleshooting.md` for more diagnostic steps

---

## Quick Wins Checklist

- [ ] Store movies as H.264 + AAC in MKV/MP4
- [ ] Use SRT subtitles instead of PGS/VOBSUB
- [ ] Enable hardware acceleration matching your GPU
- [ ] Set reasonable per-user bitrate limits
- [ ] Tell viewers to use the Jellyfin app, not a browser
- [ ] Monitor the dashboard after each new viewer starts streaming
