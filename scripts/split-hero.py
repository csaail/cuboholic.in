"""Cut the hero illustration (assets-src/hero.png) into animatable pieces for the
live hero (src/components/LiveHero.jsx). Nothing is erased or redrawn:

  • letters are found as thick dark strokes (an image "opening" removes thin line art)
  • each letter becomes a piece, together with any character sitting on it
  • free characters (robot, reader, boy, dog, drone, notes, heart) are cut by box
  • whatever is left (the grass line) becomes the static 'ground' piece
  • background = light pixels connected to the border -> transparent

Run:  python scripts/split-hero.py assets-src/hero.png public/hero
Then: copy public/hero/manifest.json to src/data/hero-pieces.json
(The rider/character boxes below are in source-image pixels; adjust them if the
 illustration changes.)

Needs Pillow + numpy.
"""
import sys, json
from collections import deque
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB')
W, H = im.size
rgb = np.asarray(im)
L = np.asarray(im.convert('L')).astype(np.int16)

# 1) Letters = thick dark strokes. Opening (erode then dilate) of the dark mask keeps
#    only regions thicker than the kernel, i.e. letter bodies, not line-art outlines.
dark = Image.fromarray(((L < 120) * 255).astype(np.uint8))
# close small grain holes in the letter texture first
closed = dark.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(5))
k = 27
opened = closed.filter(ImageFilter.MinFilter(k)).filter(ImageFilter.MaxFilter(k))
letters = np.asarray(opened) > 0

# restrict to the lettering band (keeps the robot visor / hair out)
band = np.zeros_like(letters)
band[300:800, 330:1370] = True
letters &= band


L = L.astype(np.uint8)
# --- background (copy(): fromarray images share numpy memory and break floodfill)
fill = Image.fromarray(L.copy()).copy()
for seed in [(0, 0), (W - 1, 0), (0, H - 1), (W - 1, H - 1)]:
    if fill.getpixel(seed) > 200:
        ImageDraw.floodfill(fill, seed, 3, thresh=55)
bg = np.asarray(fill) == 3
ink = ~bg

# --- letter components
letters[540:700, 380:545] = False  # reading girl's hair is not a letter

def label_components(mask, min_area):
    lab = np.zeros(mask.shape, np.int32)
    h, w = mask.shape
    n = 0
    comps = []
    for y in range(h):
        row = mask[y]
        for x in np.nonzero(row & (lab[y] == 0))[0]:
            if lab[y, x]:
                continue
            n += 1
            q = deque([(y, x)]); lab[y, x] = n; pts = 0; xs = [x]
            while q:
                cy, cx = q.popleft(); pts += 1
                for ny, nx in ((cy + 1, cx), (cy - 1, cx), (cy, cx + 1), (cy, cx - 1)):
                    if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not lab[ny, nx]:
                        lab[ny, nx] = n; q.append((ny, nx))
            comps.append((n, pts))
    keep = [c for c, p in comps if p >= min_area]
    return lab, keep

lab, keep = label_components(letters, 3000)
# order letters: top row (SAAIL) then bottom row (CHAVAN), left to right
info = []
for c in keep:
    ys, xs = np.nonzero(lab == c)
    info.append((c, xs.min(), ys.min()))
info.sort(key=lambda t: (0 if t[2] < 450 else 1, t[1]))
NAMES = ['S', 'A', 'A', 'I', 'L', 'C', 'H', 'A', 'V', 'A', 'N']
assert len(info) == 11, len(info)

owner = np.full((H, W), -1, np.int32)  # -1 = ground
pieces = []  # (key, kind, char)
for idx, (c, _, _) in enumerate(info):
    if NAMES[idx] == 'C':
        # The C is mostly hidden behind the reading girl and her cat, so it stays
        # static as part of the 'reader' piece instead of being its own letter.
        pieces.append((f'letter-{idx}', 'letter', NAMES[idx]))  # left empty, skipped
        continue
    m = Image.fromarray(((lab == c) * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(9))
    mm = (np.asarray(m) > 0) & ink & (owner == -1)
    owner[mm] = idx
    pieces.append((f'letter-{idx}', 'letter', NAMES[idx]))

# the S's dilated mask reaches the reading girl's hair — give that back to her
S_IDX = NAMES.index('S')
zone = owner[536:, 395:545]
zone[zone == S_IDX] = -1
# ...but the S itself reaches a little lower: per column, everything down to the first
# light gap after its bottom edge is still S (her hair starts just below that gap)
for x in range(395, 545):
    col = L[536:600, x]
    gap = np.argmax(col >= 150) if (col >= 150).any() else 0
    seg = owner[536:536 + gap, x]
    seg[(seg == -1) & ink[536:536 + gap, x]] = S_IDX

# characters riding a letter join that letter's piece
RIDERS = [
    (0, (320, 70, 575, 420)),     # kid on the S
    (2, (785, 110, 1095, 362)),   # kid peeking over the 2nd A
    (4, (1125, 105, 1312, 470)),  # guitar girl on the L
    (4, (1312, 262, 1420, 470)),  # ...her guitar neck / shoes
]
for li, (x0, y0, x1, y1) in RIDERS:
    sub = owner[y0:y1, x0:x1]
    sub_ink = ink[y0:y1, x0:x1]
    sub[(sub == -1) & sub_ink] = li

FREE = {
    'notes':  (1312, 180, 1420, 262),
    'drone':  (1428, 250, W, 392),
    # robot/reader border steps left where the open book's corner reaches x≈383
    'robot':  [(20, 325, 395, 640), (20, 640, 380, H)],
    'reader': [(395, 520, 694, 640), (380, 640, 694, H)],  # girl + cat + the whole C
    # boy/dog border steps: the dog's cheek reaches x≈1543, the boy's shoe x≈1538
    'boy':    [(1345, 490, 1532, 750), (1345, 750, 1541, H)],  # starts above the cap
    'dog':    [(1532, 612, W, 750), (1541, 750, W, H)],
    'heart':  (1595, 565, 1655, 612),
}
base = len(pieces)
for k, (name, rects) in enumerate(FREE.items()):
    for (x0, y0, x1, y1) in (rects if isinstance(rects, list) else [rects]):
        sub = owner[y0:y1, x0:x1]
        sub_ink = ink[y0:y1, x0:x1]
        sub[(sub == -1) & sub_ink] = base + k
    pieces.append((name, 'free', None))

# Grass below the characters' feet stays with the ground, so nothing bare is left
# behind when a character hops.
FEET_LINE = 793
for name in ('robot', 'reader', 'boy', 'dog'):
    k = base + list(FREE).index(name)
    band = owner[FEET_LINE:, :]
    band[band == k] = -1

# Unclaimed pixels inside a letter's box (edge fragments, enclosed counters) belong to
# that letter, so nothing static sits on top of a moving letter.
GRASS_TOP = 762
for idx in range(len(info)):
    ys, xs = np.nonzero(owner == idx)
    if len(ys) == 0:
        continue
    y0, y1 = max(ys.min() - 6, 0), min(ys.max() + 7, GRASS_TOP)
    x0, x1 = max(xs.min() - 6, 0), min(xs.max() + 7, W)
    sub = owner[y0:y1, x0:x1]
    sub[(sub == -1) & ink[y0:y1, x0:x1]] = idx

# the grass line stays put; keep only its ink (no white fill on top of the letters)
GROUND = len(pieces)
owner[(owner == -1) & ink & (L < 215)] = GROUND
pieces.append(('ground', 'ground', None))

SOFT_WHITE = {'reader'}
manifest = {'width': W, 'height': H, 'pieces': []}
for i, (key, kind, ch) in enumerate(pieces):
    ys, xs = np.nonzero(owner == i)
    if len(ys) == 0:
        print('empty piece', key); continue
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    tile = np.zeros((y1 - y0, x1 - x0, 4), np.uint8)
    sel = owner[y0:y1, x0:x1] == i
    tile[..., :3] = rgb[y0:y1, x0:x1]
    if key in SOFT_WHITE:
        # white is see-through here (ink alpha), so enclosed white patches can't
        # cover a moving letter
        ink_alpha = np.clip((242 - L[y0:y1, x0:x1].astype(np.int16)) * 4, 0, 255).astype(np.uint8)
        tile[..., 3] = np.where(sel, ink_alpha, 0)
    else:
        tile[..., 3] = np.where(sel, 255, 0)
    Image.fromarray(tile, 'RGBA').save(f'{out}/{key}.webp', 'WEBP', quality=90, method=6)
    manifest['pieces'].append({'key': key, 'kind': kind, 'char': ch,
                               'x': int(x0), 'y': int(y0), 'w': int(x1 - x0), 'h': int(y1 - y0)})
json.dump(manifest, open(f'{out}/manifest.json', 'w'), indent=1)

# preview: reassemble with every piece nudged, on colour, to expose seams
prev = Image.new('RGBA', (W, H), (255, 214, 120, 255))
for p in manifest['pieces']:
    t = Image.open(f"{out}/{p['key']}.webp").convert('RGBA')
    dy = -25 if p['kind'] == 'letter' and p['key'] in ('letter-0', 'letter-2', 'letter-4', 'letter-6') else 0
    prev.alpha_composite(t, (p['x'], p['y'] + dy))
prev.convert('RGB').resize((W // 2, H // 2)).save(f'{out}/_preview.png')
print('pieces:', [p['key'] for p in manifest['pieces']])
