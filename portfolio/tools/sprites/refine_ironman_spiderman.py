import numpy as np
from PIL import Image

base_img = Image.open('portfolio/assets/avatar-priyam-mannequin.png').convert('RGBA')
arr_base = np.array(base_img)
top_arr = arr_base[0:560, :].copy()
H, W = top_arr.shape[:2]
alpha = top_arr[:, :, 3] > 0
is_chest = alpha & (np.arange(H)[:, None] >= 265) & (np.arange(W)[None, :] >= 65) & (np.arange(W)[None, :] <= 282)
is_sleeves = alpha & (np.arange(H)[:, None] >= 285) & (np.arange(H)[:, None] <= 440) & ((np.arange(W)[None, :] <= 95) | (np.arange(W)[None, :] >= 252))
lum_top = (top_arr[:, :, 0].astype(float)*0.299 + top_arr[:, :, 1].astype(float)*0.587 + top_arr[:, :, 2].astype(float)*0.114) / 255.0

# ----------------------------------------------------
# REFINED IRON MAN MARK 85
# ----------------------------------------------------
iron_arr = top_arr.copy()
# Base crimson body
for y, x in zip(*np.where(is_chest | is_sleeves)):
    b = lum_top[y, x]
    iron_arr[y, x] = [int(175 + b * 65), int(16 + b * 22), int(24 + b * 25), 255]

# Gold Shoulder Pauldrons & Collar Traps
for y in range(265, 360):
    for x in range(W):
        if is_chest[y, x] or is_sleeves[y, x]:
            dist_c = abs(x - 174)
            if (dist_c > 35 and y < 340) or (dist_c > 52 and y < 360):
                b = lum_top[y, x]
                iron_arr[y, x] = [int(215 + b * 40), int(170 + b * 55), int(25 + b * 35), 255]
                if dist_c in [36, 53] or y in [266, 339]:
                    iron_arr[y, x] = [140, 100, 15, 255]

# Clean skin neck with gold armor collar rim
for y in range(265, 305):
    for x in range(145, 203):
        if is_chest[y, x]:
            dist_c = abs(x - 174)
            if dist_c <= (305 - y) * 0.5:
                iron_arr[y, x] = top_arr[min(264, y), x] # Natural skin neck
            elif dist_c <= (305 - y) * 0.5 + 3:
                iron_arr[y, x] = [225, 185, 30, 255] # Gold collar bevel

# Upper Pectoral Gold Chevron
for y in range(305, 350):
    for x in range(130, 218):
        if is_chest[y, x]:
            dist_c = abs(x - 174)
            if dist_c <= 32 and (y - 305) >= dist_c * 0.55 and (y - 305) <= dist_c * 0.55 + 14:
                iron_arr[y, x] = [225, 185, 30, 255]

# Glowing High-Tech Arc Reactor
for y in range(355, 415):
    for x in range(144, 204):
        if is_chest[y, x]:
            d = np.hypot(x - 174, y - 385)
            if 20 <= d <= 24:
                iron_arr[y, x] = [45, 48, 56, 255] # Titanium outer ring
            elif 15 <= d < 20:
                iron_arr[y, x] = [215, 180, 30, 255] # Gold inner ring
            elif 10 <= d < 15:
                iron_arr[y, x] = [0, 190, 255, 255] # Cyan energy glow
            elif 5 <= d < 10:
                iron_arr[y, x] = [0, 245, 255, 255] # Bright cyan glow
            elif d < 5:
                iron_arr[y, x] = [255, 255, 255, 255] # Pure white nanotech core

# Abdominal Gold Plates
for y in range(455, 525):
    for x in range(135, 213):
        if is_chest[y, x]:
            dist_c = abs(x - 174)
            if dist_c <= 34 and (y in range(455, 485) or y in range(495, 525)):
                b = lum_top[y, x]
                iron_arr[y, x] = [int(215 + b * 40), int(170 + b * 55), int(25 + b * 35), 255]
                if dist_c in [17, 33] or y in [455, 484, 495, 524]:
                    iron_arr[y, x] = [135, 95, 15, 255]

Image.fromarray(iron_arr).save('portfolio/assets/avatar-priyam-ironman.png')
print("Refined Iron Man saved!")

# ----------------------------------------------------
# REFINED SPIDER-MAN SUIT
# ----------------------------------------------------
spidey_arr = top_arr.copy()
# Base Royal Web-Blue for flanks & sleeves
for y, x in zip(*np.where(is_chest | is_sleeves)):
    b = lum_top[y, x]
    spidey_arr[y, x] = [int(18 + b * 25), int(60 + b * 55), int(185 + b * 65), 255]

# Scarlet Red Chest Yoke, Neck & Shoulders
for y in range(265, 560):
    for x in range(W):
        if is_chest[y, x]:
            dist_c = abs(x - 174)
            is_red_yoke = (y < 350 and dist_c <= 85) or (350 <= y <= 560 and dist_c <= 54)
            if is_red_yoke:
                b = lum_top[y, x]
                spidey_arr[y, x] = [int(195 + b * 60), int(18 + b * 22), int(28 + b * 25), 255]

# Web Lattice Lines
for y in range(265, 560):
    for x in range(W):
        if is_chest[y, x]:
            dist_c = abs(x - 174)
            is_red_yoke = (y < 350 and dist_c <= 85) or (350 <= y <= 560 and dist_c <= 54)
            if is_red_yoke:
                # Vertical web lines
                if dist_c in [0, 18, 36, 54, 72]:
                    spidey_arr[y, x] = [20, 20, 25, 255]
                # Concentric curved web arches (curving gently towards center)
                arch_y = (y + int((dist_c ** 1.3) * 0.12)) % 22
                if arch_y == 0:
                    spidey_arr[y, x] = [20, 20, 25, 255]

# Black Spider Insignia on Center Chest
for y in range(375, 428):
    for x in range(148, 200):
        if is_chest[y, x]:
            dist_c = abs(x - 174)
            # Spider abdomen & head
            if (392 <= y <= 414 and dist_c <= 5) or (382 <= y < 392 and dist_c <= 4):
                spidey_arr[y, x] = [15, 15, 20, 255]
            # 4 Upper legs
            if (376 <= y <= 396 and abs(dist_c - (396 - y) * 1.3) <= 1.5 and dist_c <= 22):
                spidey_arr[y, x] = [15, 15, 20, 255]
            if (380 <= y <= 400 and abs(dist_c - (400 - y) * 1.1) <= 1.5 and dist_c <= 20):
                spidey_arr[y, x] = [15, 15, 20, 255]
            # 4 Lower legs
            if (402 <= y <= 424 and abs(dist_c - (y - 402) * 1.2) <= 1.5 and dist_c <= 22):
                spidey_arr[y, x] = [15, 15, 20, 255]
            if (406 <= y <= 426 and abs(dist_c - (y - 406) * 0.9) <= 1.5 and dist_c <= 18):
                spidey_arr[y, x] = [15, 15, 20, 255]

# Crew-neck collar band with web lines
for y in range(265, 290):
    for x in range(145, 203):
        if is_chest[y, x] and abs(x - 174) <= 28:
            spidey_arr[y, x] = [195, 18, 28, 255]
            if abs(x - 174) in [0, 14, 28] or y in [266, 289]:
                spidey_arr[y, x] = [20, 20, 25, 255]

Image.fromarray(spidey_arr).save('portfolio/assets/avatar-priyam-spiderman.png')
print("Refined Spider-Man saved!")
