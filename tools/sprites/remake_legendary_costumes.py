import numpy as np
from PIL import Image

# Load clean master mannequin
base_img = Image.open('portfolio/assets/avatar-priyam-mannequin.png').convert('RGBA')
arr_base = np.array(base_img)
top_arr = arr_base[0:560, :].copy() # 560x348
H, W = top_arr.shape[:2]
alpha = top_arr[:, :, 3] > 0

# Mask definitions
is_head = alpha & (np.arange(H)[:, None] < 265)
is_skin = alpha & (top_arr[:, :, 0] > 140) & (top_arr[:, :, 1] > 80) & (top_arr[:, :, 2] > 50) & (top_arr[:, :, 0] > top_arr[:, :, 2] + 25)
is_chest = alpha & (np.arange(H)[:, None] >= 265) & (np.arange(W)[None, :] >= 65) & (np.arange(W)[None, :] <= 282)
is_sleeves = alpha & (np.arange(H)[:, None] >= 285) & (np.arange(H)[:, None] <= 440) & ((np.arange(W)[None, :] <= 95) | (np.arange(W)[None, :] >= 252))

lum_top = (top_arr[:, :, 0].astype(float)*0.299 + top_arr[:, :, 1].astype(float)*0.587 + top_arr[:, :, 2].astype(float)*0.114) / 255.0

print("Generating remastered, authentic iconic costumes...")

# =========================================================================
# 1. IRON MAN (MARK 85 - HOT ROD CRIMSON, BRUSHED GOLD & TRIANGULAR ARC REACTOR)
# =========================================================================
iron_arr = top_arr.copy()
# Base hot rod crimson body
for y, x in zip(*np.where(is_chest | is_sleeves)):
    b = lum_top[y, x]
    iron_arr[y, x] = [int(185 + b * 60), int(15 + b * 20), int(22 + b * 22), 255]

# Gold Shoulder Pauldrons & Clavicle Armor Plates
for y in range(265, 365):
    for x in range(W):
        if is_chest[y, x] or is_sleeves[y, x]:
            dist_c = abs(x - 174)
            # Gold pauldrons on shoulder caps & upper chest corners
            if (dist_c > 38 and y < 345) or (dist_c > 54 and y < 365):
                b = lum_top[y, x]
                iron_arr[y, x] = [int(220 + b * 35), int(175 + b * 55), int(25 + b * 35), 255]
                # Pauldron armor bevel seams
                if dist_c in [39, 55] or y in [266, 344]:
                    iron_arr[y, x] = [140, 100, 15, 255]

# Armored Clavicle Trap Armor framing Neck
for y in range(265, 310):
    for x in range(142, 206):
        if is_chest[y, x]:
            dist_c = abs(x - 174)
            if dist_c <= (310 - y) * 0.48:
                iron_arr[y, x] = top_arr[min(264, y), x] # Natural skin neck
            elif dist_c <= (310 - y) * 0.48 + 4:
                iron_arr[y, x] = [230, 190, 30, 255] # Gold collar bevel
            elif dist_c <= (310 - y) * 0.48 + 7:
                iron_arr[y, x] = [40, 42, 50, 255] # Dark carbon gasket

# Upper Pectoral Gold V-Chevron & Muscle Contours
for y in range(310, 355):
    for x in range(128, 220):
        if is_chest[y, x]:
            dist_c = abs(x - 174)
            # Gold chest chevron
            if dist_c <= 34 and (y - 310) >= dist_c * 0.55 and (y - 310) <= dist_c * 0.55 + 15:
                iron_arr[y, x] = [230, 190, 30, 255]
            # Pectoral armor panel lines
            if dist_c in [30, 52] or y in [354]:
                iron_arr[y, x] = [105, 12, 18, 255]

# Triangular / Heart-Shaped Nano Arc Reactor (Center Sternum - y: 360-415, x: 148-200)
for y in range(360, 415):
    for x in range(148, 200):
        if is_chest[y, x]:
            # Triangular nanotech housing (wider top, tapering downward)
            dist_c = abs(x - 174)
            t_w = max(0, int((415 - y) * 0.55 + 8))
            if dist_c <= t_w:
                # Outer titanium housing bezel
                if dist_c >= t_w - 3 or y in [360, 361, 414]:
                    iron_arr[y, x] = [45, 48, 58, 255]
                # Inner gold conduit rim
                elif dist_c >= t_w - 6 or y in [362, 363, 412, 413]:
                    iron_arr[y, x] = [225, 185, 30, 255]
                else:
                    # Glowing cyan / white core
                    d_core = np.hypot(x - 174, y - 384)
                    if d_core <= 5:
                        iron_arr[y, x] = [255, 255, 255, 255] # Pure white core
                    elif d_core <= 10:
                        iron_arr[y, x] = [0, 245, 255, 255] # Intense cyan glow
                    else:
                        iron_arr[y, x] = [0, 175, 240, 255] # Deep blue plasma

# Segmented Abdominal Gold Plates & Carbon Seams
for y in range(455, 528):
    for x in range(132, 216):
        if is_chest[y, x]:
            dist_c = abs(x - 174)
            if dist_c <= 36 and (y in range(455, 488) or y in range(498, 528)):
                b = lum_top[y, x]
                iron_arr[y, x] = [int(220 + b * 35), int(175 + b * 55), int(25 + b * 35), 255]
                if dist_c in [18, 35] or y in [455, 487, 498, 527]:
                    iron_arr[y, x] = [135, 95, 15, 255]

# Gold Wrist Gauntlets on Forearms
for y in range(450, 545):
    for x in range(W):
        if is_sleeves[y, x] or (alpha[y, x] and (x < 75 or x > 273)):
            b = lum_top[y, x]
            iron_arr[y, x] = [int(185 + b * 60), int(15 + b * 20), int(22 + b * 22), 255]
            if 480 <= y <= 520:
                iron_arr[y, x] = [int(220 + b * 35), int(175 + b * 55), int(25 + b * 35), 255]

Image.fromarray(iron_arr).save('portfolio/assets/avatar-priyam-ironman.png')
print("1. Remastered Iron Man Mark 85 saved!")

# =========================================================================
# 2. SPIDER-MAN (CLASSIC STARK SUIT - SCARLET RED YOKE, WEB LATTICE & SPIDER)
# =========================================================================
spidey_arr = top_arr.copy()
# Base Royal Blue flanks & sleeves
for y, x in zip(*np.where(is_chest | is_sleeves)):
    b = lum_top[y, x]
    spidey_arr[y, x] = [int(15 + b * 20), int(60 + b * 55), int(195 + b * 60), 255]

# Scarlet Red across full shoulder yoke (y < 350 across whole chest/shoulders) and central torso (y >= 350, abs(x - 174) <= 58)
for y in range(265, 560):
    for x in range(W):
        if is_chest[y, x] or (is_sleeves[y, x] and y < 335):
            dist_c = abs(x - 174)
            is_red = (y < 345) or (y >= 345 and dist_c <= 58)
            if is_red:
                b = lum_top[y, x]
                spidey_arr[y, x] = [int(205 + b * 50), int(18 + b * 20), int(26 + b * 22), 255]

# Web Lattice Lines across all red areas
for y in range(265, 560):
    for x in range(W):
        if is_chest[y, x] or (is_sleeves[y, x] and y < 335):
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

# Iconic Center Spider Insignia (y: 370-430, x: 145-204)
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
print("2. Remastered Spider-Man saved!")

# =========================================================================
# 3. CR7 (CRISTIANO RONALDO - REAL MADRID NO. 7 HOME JERSEY)
# =========================================================================
cr7_arr = top_arr.copy()
# Crisp all-white jersey base
for y, x in zip(*np.where(is_chest | is_sleeves)):
    b = lum_top[y, x]
    cr7_arr[y, x] = [int(232 + b * 23), int(234 + b * 21), int(238 + b * 17), 255]

# Ribbed V-Neck Collar with Gold & Navy Trim
for y in range(265, 325):
    for x in range(142, 206):
        if is_chest[y, x]:
            dist_c = abs(x - 174)
            if dist_c <= (325 - y) * 0.45:
                cr7_arr[y, x] = top_arr[min(264, y), x] # Skin V-neck
            elif dist_c <= (325 - y) * 0.45 + 3:
                cr7_arr[y, x] = [215, 175, 25, 255] # Gold collar trim
            elif dist_c <= (325 - y) * 0.45 + 6:
                cr7_arr[y, x] = [12, 25, 55, 255] # Navy collar trim

# Authentic Gold 3-Stripes on Shoulders
for y in range(275, 345):
    for x in range(W):
        if is_chest[y, x] or is_sleeves[y, x]:
            dist_c = abs(x - 174)
            if 70 <= dist_c <= 125:
                stripe_idx = (dist_c - 70) // 18
                offset_in_stripe = (dist_c - 70) % 18
                if stripe_idx in [0, 1, 2] and offset_in_stripe < 7:
                    cr7_arr[y, x] = [215, 175, 25, 255]

# Real Madrid Crown Crest (Left Chest over Heart - x: 205-232, y: 345-385)
for y in range(345, 385):
    for x in range(205, 232):
        if is_chest[y, x]:
            if 345 <= y <= 356:
                if y in [345, 346] and (x in [207, 218, 229]):
                    cr7_arr[y, x] = [255, 215, 0, 255]
                elif 348 <= y <= 356 and 206 <= x <= 230:
                    cr7_arr[y, x] = [235, 185, 25, 255]
                    if y == 352 and (x % 4 in [0, 1]):
                        cr7_arr[y, x] = [200, 25, 35, 255]
            elif 357 <= y <= 385:
                d = np.hypot(x - 218, y - 370)
                if d <= 12:
                    if d >= 10:
                        cr7_arr[y, x] = [215, 175, 25, 255]
                    elif abs((x - 218) + (y - 370)) <= 3:
                        cr7_arr[y, x] = [18, 45, 120, 255]
                    else:
                        cr7_arr[y, x] = [250, 250, 255, 255]

# Gold FIFA World Champions Badge (Upper Center Chest - y: 348-370, x: 164-184)
for y in range(348, 370):
    for x in range(164, 184):
        if is_chest[y, x]:
            dist_c = abs(x - 174)
            if (y < 364 and dist_c <= 9) or (y >= 364 and dist_c <= (370 - y) * 1.5):
                cr7_arr[y, x] = [235, 190, 30, 255]
                if y == 348 or dist_c == 9: cr7_arr[y, x] = [255, 225, 60, 255]

# Dark Navy "Fly Emirates" Sponsor Bar
for y in range(388, 408):
    for x in range(115, 233):
        if is_chest[y, x]:
            if (y in [388, 407] or x in [115, 232]) or (392 <= y <= 404 and (x % 9 in [0, 1])):
                cr7_arr[y, x] = [12, 25, 55, 255]

# Iconic Bold "7" (y: 420-520, x: 148-200)
for y in range(420, 520):
    for x in range(148, 202):
        if is_chest[y, x]:
            is_top = (420 <= y <= 438) and (148 <= x <= 200)
            is_stem = abs((y - 420) - int((198 - x) * 2.2)) <= 7 and (x >= 154)
            if is_top or is_stem:
                cr7_arr[y, x] = [12, 25, 55, 255]
                if (is_top and y == 420) or (is_stem and abs((y - 420) - int((198 - x) * 2.2)) == 7):
                    cr7_arr[y, x] = [215, 175, 25, 255]

# Captain's Armband ("C") on Left Bicep
for y in range(365, 410):
    for x in range(250, 282):
        if is_sleeves[y, x] or alpha[y, x]:
            cr7_arr[y, x] = [20, 20, 25, 255]
            if y in [365, 409]: cr7_arr[y, x] = [215, 175, 25, 255]
            if 378 <= y <= 396 and 260 <= x <= 272:
                if (y in [378, 379, 395, 396] and 262 <= x <= 272) or (x in [260, 261] and 378 <= y <= 396):
                    cr7_arr[y, x] = [255, 255, 255, 255]

Image.fromarray(cr7_arr).save('portfolio/assets/avatar-priyam-football.png')
print("3. Remastered CR7 Real Madrid No. 7 saved!")

# =========================================================================
# 4. CYBER TECHWEAR (URBAN NINJA - HIGH COWL COLLAR, CYBER ZIP, TACTICAL HARNESS)
# =========================================================================
tech_arr = top_arr.copy()
# Matte obsidian darkwear fabric
for y, x in zip(*np.where(is_chest | is_sleeves)):
    b = lum_top[y, x]
    tech_arr[y, x] = [int(18 + b * 22), int(20 + b * 25), int(28 + b * 32), 255]

# High Ninja Funnel-Neck Cowl Collar (Covering throat & lower chin, y: 245-315)
for y in range(245, 315):
    for x in range(128, 220):
        if alpha[y, x]:
            tech_arr[y, x] = [24, 28, 38, 255]
            # Ribbed vertical ninja cowl stitching
            if x % 6 in [0, 1]:
                tech_arr[y, x] = [38, 45, 60, 255]

# Central Glowing Neon Cyan Cyber Zipper
for y in range(245, H):
    for x in range(172, 177):
        if alpha[y, x]:
            tech_arr[y, x] = [0, 240, 255, 255] # Neon Cyan
            if x == 174: tech_arr[y, x] = [220, 255, 255, 255] # White hot center

# Tactical Cross-Body Harness Straps with Chrome Cobra Buckles
for y in range(350, 395):
    for x in range(75, 273):
        if alpha[y, x] and abs(x - 174) > 12:
            # Tactical strap webbing
            tech_arr[y, x] = [45, 52, 68, 255]
            if y in [350, 394]: tech_arr[y, x] = [20, 24, 32, 255] # Black border

# Chrome Quick-Release Cobra Buckles (x: 130-148, y: 362-382 and x: 200-218, y: 362-382)
for by, bx in [(372, 139), (372, 209)]:
    for dy in range(-8, 9):
        for dx in range(-8, 9):
            if alpha[by + dy, bx + dx]:
                if abs(dx) == 8 or abs(dy) == 8:
                    tech_arr[by + dy, bx + dx] = [15, 18, 24, 255]
                elif abs(dx) == 7 or abs(dy) == 7:
                    tech_arr[by + dy, bx + dx] = [220, 230, 245, 255] # Chrome metallic
                else:
                    tech_arr[by + dy, bx + dx] = [140, 155, 175, 255]

# Utility Chest Rig Pockets with Molle Loops & Cyan HUD Indicator LEDs
for y in range(430, 490):
    for x in range(95, 150):
        if alpha[y, x]:
            tech_arr[y, x] = [28, 33, 44, 255]
            if (y in [430, 489] or x in [95, 149]) or (y % 14 == 0):
                tech_arr[y, x] = [55, 65, 85, 255] # Molle loops
            # Cyan Status LED on pocket
            if 442 <= y <= 446 and 105 <= x <= 112:
                tech_arr[y, x] = [0, 240, 255, 255]

for y in range(430, 490):
    for x in range(198, 253):
        if alpha[y, x]:
            tech_arr[y, x] = [28, 33, 44, 255]
            if (y in [430, 489] or x in [198, 252]) or (y % 14 == 0):
                tech_arr[y, x] = [55, 65, 85, 255]
            if 442 <= y <= 446 and 236 <= x <= 243:
                tech_arr[y, x] = [0, 240, 255, 255]

Image.fromarray(tech_arr).save('portfolio/assets/avatar-priyam-techwear.png')
print("4. Remastered Cyber Techwear saved!")

# =========================================================================
# 5. F1 SCUDERIA RACER (PRESERVED ROSSO CORSA & FERRARI SHIELD)
# =========================================================================
print("5. F1 Scuderia Ferrari Racer preserved!")

# =========================================================================
# 6. SUPER SAIYAN (PRESERVED SPIKY GOLDEN HAIR & DBZ GI)
# =========================================================================
print("6. Super Saiyan preserved!")

# =========================================================================
# 7. FOUNDER CASUAL (PRESERVED 100% UNCHANGED)
# =========================================================================
print("7. Founder Casual preserved 100%!")

print("ALL SPRITES REMASTERED AND SAVED!")
