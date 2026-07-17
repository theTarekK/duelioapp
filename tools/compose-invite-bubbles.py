#!/usr/bin/env python3
"""Compose Duelio's real fresh-invite bubble artwork (16:9) for the website,
following the app's own composition rules (DuelioMessagePreviewArtwork et al):

  8ball:    cream floor + table.webp rotated to landscape + cast shadow +
            racked 15 balls + cue ball on a dashed break line
  snooker:  same treatment with snookerTable.webp + snooker rack (15 reds,
            6 colours on spots, cue in the D) + baulk line & dashed D
  cards:    showdowngofishperfect21.webp cover as-is (Showdown & Go Fish share it)
  wordtiles: warm off-white field + wood card + empty premium-square grid + 1/2 chip
  wordhunt: WordHuntBackground + icy-glow dark board of "?" tiles + red 0 chip
"""
import math
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

SRC = "/private/tmp/claude-501/-Users-tarekhalifa-Downloads-Duelio/4e3493a7-976f-4aff-9bdc-1b291b7a7f60/scratchpad/bubble-src"
OUT = "/Users/tarekhalifa/Downloads/duelioapp.com/assets/img/covers"
FONTS = "/Users/tarekhalifa/Downloads/duelioapp.com/assets/fonts"
W, H = 1280, 720

nunito_b = lambda s: ImageFont.truetype(f"{FONTS}/Nunito-Bold.ttf", s)
nunito_blk = lambda s: ImageFont.truetype(f"{FONTS}/Nunito-Black.ttf", s)


# ---------------------------------------------------------------- helpers
def felt_bbox(img):
    """Bounding box of green felt pixels."""
    px = img.convert("RGB").load()
    w, h = img.size
    minx, miny, maxx, maxy = w, h, 0, 0
    for y in range(0, h, 4):
        for x in range(0, w, 4):
            r, g, b = px[x, y]
            if g > 90 and g > r + 25 and g > b + 25:
                minx, miny = min(minx, x), min(miny, y)
                maxx, maxy = max(maxx, x), max(maxy, y)
    return (minx, miny, maxx, maxy)


def ball(draw, x, y, r, color, stripe=None):
    """Top-down ball: solid disc (or white with a colour band), rim shade, spec."""
    if stripe:  # white ball with a horizontal colour band
        draw.ellipse([x - r, y - r, x + r, y + r], fill=(246, 244, 238))
        band = Image.new("RGBA", (2 * r, 2 * r), (0, 0, 0, 0))
        bd = ImageDraw.Draw(band)
        bd.rectangle([0, int(r * 0.55), 2 * r, int(r * 1.45)], fill=stripe)
        mask = Image.new("L", (2 * r, 2 * r), 0)
        ImageDraw.Draw(mask).ellipse([0, 0, 2 * r, 2 * r], fill=255)
        draw._image.paste(band, (int(x - r), int(y - r)), Image.composite(band, Image.new("RGBA", band.size, (0,0,0,0)), mask).split()[3])
    else:
        draw.ellipse([x - r, y - r, x + r, y + r], fill=color)
    # rim shadow + specular
    draw.ellipse([x - r, y - r, x + r, y + r], outline=(0, 0, 0, 90), width=max(1, r // 6))
    sr = max(1, int(r * 0.34))
    draw.ellipse([x - r * 0.45 - sr, y - r * 0.45 - sr, x - r * 0.45 + sr, y - r * 0.45 + sr],
                 fill=(255, 255, 255, 200))


def table_scene(table_file, out_name, mode):
    """Cream floor + rotated table + shadow + balls/markings. mode: '8ball'|'snooker'"""
    canvas = Image.new("RGBA", (W, H), (245, 242, 235, 255))

    table = Image.open(f"{SRC}/{table_file}").convert("RGBA")
    table = table.rotate(90, expand=True)  # portrait -> landscape
    th = int(H * 0.86)
    tw = int(table.width * th / table.height)
    table = table.resize((tw, th), Image.LANCZOS)
    tx, ty = (W - tw) // 2, (H - th) // 2

    # cast shadow: black silhouette, spread, blurred, nudged down
    sil = Image.new("RGBA", table.size, (0, 0, 0, 0))
    sil.paste((0, 0, 0, 108), (0, 0), table.split()[3])
    spread = sil.resize((int(tw * 1.045), int(th * 1.045)), Image.LANCZOS)
    spread = spread.filter(ImageFilter.GaussianBlur(18))
    canvas.alpha_composite(spread, (tx - int(tw * 0.0225), ty - int(th * 0.0225) + int(H * 0.025)))
    canvas.alpha_composite(table, (tx, ty))

    fx0, fy0, fx1, fy1 = felt_bbox(table)
    fx0 += tx; fx1 += tx; fy0 += ty; fy1 += ty
    fw, fh = fx1 - fx0, fy1 - fy0

    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    r = max(6, int(fw / 80))

    if mode == "8ball":
        # dashed break line (kitchen) on the left quarter
        lx = fx0 + int(fw * 0.235)
        yy = fy0 + int(fh * 0.04)
        while yy < fy1 - int(fh * 0.04):
            d.line([(lx, yy), (lx, min(yy + 14, fy1))], fill=(255, 255, 255, 210), width=3)
            yy += 14 + 10
        # cue ball centered on the line
        ball(d, lx, (fy0 + fy1) // 2, r, (246, 244, 238))
        # 15-ball rack, apex facing the cue ball, expanding right
        solids = [(255, 205, 0), (0, 80, 200), (210, 30, 40), (90, 40, 140),
                  (255, 120, 0), (0, 130, 70), (130, 30, 45)]
        order = [solids[0], None, solids[1], solids[2], (papa := None) or solids[3],
                 None, solids[4], (16, 16, 18), solids[5], None,
                 solids[6], None, solids[0], solids[1], None]
        stripes = [solids[2], solids[3], solids[4], solids[5], solids[6]]
        ax = fx0 + int(fw * 0.72)
        ay = (fy0 + fy1) // 2
        dx = int(r * 1.78)
        idx = si = 0
        for col in range(5):
            for k in range(col + 1):
                x = ax + col * dx
                y = ay + int((k - col / 2) * r * 2.06)
                c = order[idx]
                if col == 2 and k == 1:
                    ball(d, x, y, r, (16, 16, 18))            # the 8 ball dead centre
                elif c is None:
                    ball(d, x, y, r, None, stripe=stripes[si % 5]); si += 1
                else:
                    ball(d, x, y, r, c)
                idx += 1
    else:  # snooker
        white = (255, 255, 255, 200)
        # baulk line
        bx = fx0 + int(fw * 0.26)
        d.line([(bx, fy0 + 6), (bx, fy1 - 6)], fill=white, width=3)
        # dashed D bulging toward the baulk cushion (left)
        dr = int(fh * 0.18)
        cy = (fy0 + fy1) // 2
        steps = 26
        for i in range(steps):
            a0 = math.pi / 2 + (i / steps) * math.pi
            a1 = math.pi / 2 + ((i + 0.55) / steps) * math.pi
            d.line([(bx + int(math.cos(a0) * dr), cy - int(math.sin(a0) * dr)),
                    (bx + int(math.cos(a1) * dr), cy - int(math.sin(a1) * dr))],
                   fill=white, width=3)
        rr = max(5, int(fw / 95))  # snooker balls slightly smaller
        # spots: yellow/brown/green on baulk line, blue centre, pink, black
        ball(d, bx, cy - dr, rr, (240, 200, 0))
        ball(d, bx, cy, rr, (125, 78, 40))
        ball(d, bx, cy + dr, rr, (0, 130, 60))
        ball(d, (fx0 + fx1) // 2, cy, rr, (25, 70, 190))
        pink_x = fx0 + int(fw * 0.755)
        ball(d, pink_x, cy, rr, (240, 120, 160))
        ball(d, fx0 + int(fw * 0.94), cy, rr, (18, 18, 20))
        # cue ball in the D
        ball(d, bx - int(dr * 0.45), cy + int(dr * 0.3), rr, (246, 244, 238))
        # 15 reds, apex just right of the pink
        ax = pink_x + int(rr * 2.4)
        dx = int(rr * 1.8)
        for col in range(5):
            for k in range(col + 1):
                ball(d, ax + col * dx, cy + int((k - col / 2) * rr * 2.08), rr, (196, 24, 32))

    canvas.alpha_composite(overlay)
    canvas.convert("RGB").save(f"{OUT}/{out_name}", quality=90)
    print("wrote", out_name)


# ---------------------------------------------------------------- word tiles
def word_tiles():
    canvas = Image.new("RGB", (W, H), (248, 246, 243))
    d = ImageDraw.Draw(canvas, "RGBA")
    # faint drifting dots
    for i, (x, y, rr) in enumerate([(150, 120, 90), (1100, 160, 70), (240, 580, 80),
                                    (1010, 560, 95), (660, 90, 60)]):
        dot = Image.new("RGBA", (rr * 2, rr * 2), (0, 0, 0, 0))
        ImageDraw.Draw(dot).ellipse([0, 0, rr * 2, rr * 2], fill=(205, 198, 188, 26))
        canvas.paste(Image.new("RGB", dot.size, (243, 240, 236)), (x - rr, y - rr), dot)

    size = int(H * 0.88)
    bx, by = (W - size) // 2, (H - size) // 2
    # wood card with vertical grain
    wood = Image.new("RGB", (size, size))
    wd = ImageDraw.Draw(wood)
    for yy in range(size):
        t = yy / size
        wd.line([(0, yy), (size, yy)],
                fill=(int(196 - 40 * t), int(148 - 40 * t), int(92 - 30 * t)))
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, size - 1, size - 1], 18, fill=255)
    canvas.paste(wood, (bx, by), mask)
    d.rounded_rectangle([bx, by, bx + size - 1, by + size - 1], 18,
                        outline=(250, 244, 230, 200), width=3)

    # 15x15 premium grid (the standard layout the app keeps)
    n = 15
    pad = int(size * 0.045)
    cell = (size - 2 * pad) / n
    TW = {(0,0),(0,7),(0,14),(7,0),(7,14),(14,0),(14,7),(14,14)}
    DW = {(i,i) for i in range(1,5)} | {(i,i) for i in range(10,14)} | \
         {(1,13),(2,12),(3,11),(4,10),(10,4),(11,3),(12,2),(13,1),(7,7)}
    TL = {(1,5),(1,9),(5,1),(5,5),(5,9),(5,13),(9,1),(9,5),(9,9),(9,13),(13,5),(13,9)}
    DL = {(0,3),(0,11),(2,6),(2,8),(3,0),(3,7),(3,14),(6,2),(6,6),(6,8),(6,12),
          (7,3),(7,11),(8,2),(8,6),(8,8),(8,12),(11,0),(11,7),(11,14),(12,6),(12,8),
          (14,3),(14,11)}
    f = nunito_blk(max(9, int(cell * 0.42)))
    for row in range(n):
        for col in range(n):
            x0 = bx + pad + col * cell + 1
            y0 = by + pad + row * cell + 1
            x1, y1 = x0 + cell - 2, y0 + cell - 2
            key = (row, col)
            if key in TW: fill, lbl, lc = (148, 31, 36), "TW", (255, 244, 240)
            elif key == (7, 7): fill, lbl, lc = (240, 184, 194), None, None
            elif key in DW: fill, lbl, lc = (240, 184, 194), "DW", (110, 42, 52)
            elif key in TL: fill, lbl, lc = (166, 209, 194), "TL", (32, 84, 66)
            elif key in DL: fill, lbl, lc = (189, 212, 235), "DL", (40, 74, 116)
            else:
                fill = (240, 209, 153) if (row + col) % 2 == 0 else (233, 197, 138)
                lbl, lc = None, None
            d.rounded_rectangle([x0, y0, x1, y1], 4, fill=fill)
            if lbl:
                tb = d.textbbox((0, 0), lbl, font=f)
                d.text(((x0 + x1 - tb[2]) / 2, (y0 + y1 - tb[3]) / 2 - 1), lbl, font=f, fill=lc)
    # centre dot
    ccx, ccy = bx + pad + 7.5 * cell, by + pad + 7.5 * cell
    d.ellipse([ccx - 5, ccy - 5, ccx + 5, ccy + 5], fill=(90, 52, 30))

    # players chip 1/2 top-right
    chip_f = nunito_blk(30)
    d.rounded_rectangle([W - 128, 26, W - 30, 76], 12, fill=(30, 30, 34, 215))
    d.text((W - 118, 34), "1/2", font=chip_f, fill=(255, 255, 255))

    canvas.save(f"{OUT}/wordtiles.png", quality=92)
    print("wrote wordtiles.png")


# ---------------------------------------------------------------- word hunt
def word_hunt():
    bg = Image.open(f"{SRC}/WordHuntBackground.webp").convert("RGB")
    canvas = ImageOps.fit(bg, (W, H), Image.LANCZOS)
    # vignette + centre icy glow
    vig = Image.new("L", (W, H), 0)
    vd = ImageDraw.Draw(vig)
    vd.ellipse([-W * 0.25, -H * 0.35, W * 1.25, H * 1.35], fill=110)
    vig = vig.filter(ImageFilter.GaussianBlur(120))
    dark = Image.new("RGB", (W, H), (0, 0, 8))
    canvas = Image.composite(canvas, dark, vig.point(lambda p: 145 + p))
    canvas = canvas.convert("RGBA")

    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([W/2 - 330, H/2 - 300, W/2 + 330, H/2 + 300], fill=(120, 200, 255, 46))
    canvas.alpha_composite(glow.filter(ImageFilter.GaussianBlur(90)))

    size = int(H * 0.78)
    bx, by = (W - size) // 2, (H - size) // 2
    d = ImageDraw.Draw(canvas, "RGBA")

    # outer glow of the board outline
    halo = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(halo).rounded_rectangle([bx - 6, by - 6, bx + size + 6, by + size + 6],
                                           26, outline=(168, 224, 255, 190), width=14)
    canvas.alpha_composite(halo.filter(ImageFilter.GaussianBlur(14)))

    d.rounded_rectangle([bx, by, bx + size, by + size], 22, fill=(42, 42, 44, 255))
    d.rounded_rectangle([bx, by, bx + size, by + size], 22,
                        outline=(168, 224, 255, 255), width=7)

    n = 4
    pad = int(size * 0.055)
    gap = int(size * 0.02)
    cell = (size - 2 * pad - (n - 1) * gap) / n
    qf = nunito_blk(int(cell * 0.52))
    for row in range(n):
        for col in range(n):
            x0 = bx + pad + col * (cell + gap)
            y0 = by + pad + row * (cell + gap)
            # tile with vertical falloff + sheen
            d.rounded_rectangle([x0, y0, x0 + cell, y0 + cell], 12, fill=(18, 18, 19))
            d.rounded_rectangle([x0, y0, x0 + cell, y0 + cell], 12,
                                outline=(60, 64, 70, 160), width=2)
            tb = d.textbbox((0, 0), "?", font=qf)
            d.text((x0 + (cell - tb[2]) / 2, y0 + (cell - tb[3]) / 2 - 4), "?",
                   font=qf, fill=(240, 246, 252))

    # red completion chip "0" top-right
    cf = nunito_blk(30)
    d.rounded_rectangle([W - 108, 26, W - 30, 76], 12, fill=(196, 40, 40, 230))
    d.text((W - 76, 33), "0", font=cf, fill=(255, 255, 255))

    canvas.convert("RGB").save(f"{OUT}/wordhunt.png", quality=92)
    print("wrote wordhunt.png")


# ---------------------------------------------------------------- cards cover
def cards():
    img = Image.open(f"{SRC}/showdowngofishperfect21.webp").convert("RGB")
    img = ImageOps.fit(img, (W, H), Image.LANCZOS)
    img.save(f"{OUT}/cards.webp", quality=88)
    print("wrote cards.webp")


table_scene("table.webp", "pool.png", "8ball")
table_scene("snookerTable.webp", "snooker.png", "snooker")
word_tiles()
word_hunt()
cards()
