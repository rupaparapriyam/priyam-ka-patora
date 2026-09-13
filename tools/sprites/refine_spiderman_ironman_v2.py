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
# 1. AUTHENTIC SPIDER-MAN (Full Red Shoulder Yoke + Blue Torso + Web Grid + Spider)
# ----------------------------------------------------
spidey_arr = top_arr.copy()
# Base Royal Blue for lower flanks & sleeves
for y, x in zip(*np.where(is_chest | is_sleeves)):
    b = lum_top[y, x]
    spidey_arr[y, x] = [int(15 + b * 20), int(60 + b * 55), int(195 + b * 60), 255]

# Scarlet Red across full shoulder yoke (y < 350 across whole chest/shoulders) and central torso (y >= 350, abs(x - 174) <= 58)
for y in range(265, 560):
    for x in range(W):
        if is_chest[y, x] or (is_sleeves[y, x] and y < 330):
            dist_c = abs(x - 174)
            is_red = (y < 345) or (y >= 345 and dist_c <= 58)
            if is_red:
                b = lum_top[y, x]
                spidey_arr[y, x] = [int(205 + b * 50), int(18 + b * 20), int(26 + b * 22), 255]

# Web Lattice Lines across all red areas
for y in range(265, 560):
    for x in range(W):
        if is_chest[y, x] or (is_sleeves[y, x] and y < 330):
            dist_c = abs(x - 174)
            is_red = (y < 345) or (y >= 345 and dist_c <= 58)
            if is_red:
                # Vertical web lines
                if dist_c in [0, 18, 36, 54, 72, 90, 108]:
                    spidey_arr[y, x] = [20, 20, 25, 255]
                # Concentric curved web arches
                arch_y = (y + int((dist_c ** 1.25) * 0.12)) % 20
                if arch_y == 0:
                    spidey_arr[y, x] = [20, 20, 25, 255]

# Iconic Center Spider Emblem
for y in range(370, 430):
    for x in range(145, 204):
        if is_chest[y, x]:
            dist_c = abs(x - 174)
            # Spider body
            if (390 <= y <= 414 and dist_c <= 5) or (382 <= y < 390 and dist_c <= 4):
                spidey_arr[y, x] = [15, 15, 20, 255]
            # 4 Upper legs reaching outward and upward
            if (374 <= y <= 396 and abs(dist_c - (396 - y) * 1.3) <= 1.5 and dist_c <= 24):
                spidey_arr[y, x] = [15, 15, 20, 255]
            if (378 <= y <= 400 and abs(dist_c - (400 - y) * 1.1) <= 1.5 and dist_c <= 22):
                spidey_arr[y, x] = [15, 15, 20, 255]
            # 4 Lower legs reaching outward and downward
            if (402 <= y <= 425 and abs(dist_c - (y - 402) * 1.3) <= 1.5 and dist_c <= 24):
                spidey_arr[y, x] = [15, 15, 20, 255]
            if (406 <= y <= 428 and abs(dist_c - (y - 406) * 1.0) <= 1.5 and dist_c <= 20):
                spidey_arr[y, x] = [15, 15, 20, 255]

# Web crew-neck collar band
for y in range(265, 290):
    for x in range(145, 203):
        if is_chest[y, x] and abs(x - 174) <= 28:
            spidey_arr[y, x] = [205, 18, 26, 255]
            if abs(x - 174) in [0, 14, 28] or y in [266, 289]:
                spidey_arr[y, x] = [20, 20, 25, 255]

Image.fromarray(spidey_arr).save('portfolio/assets/avatar-priyam-spiderman.png')
print("Masterpiece Spider-Man saved!")
