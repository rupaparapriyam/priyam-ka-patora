import numpy as np
from PIL import Image, ImageDraw

# Load master mannequin base
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

print("Building authentic, detailed costumes...")

# =========================================================================
# 1. FOUNDER CASUAL (KEEP 100% UNCHANGED AS REQUESTED)
# =========================================================================
# casual is already saved and preserved in portfolio/assets/avatar-priyam-casual.png
print("1. Founder Casual preserved 100%!")

# =========================================================================
# 2. IRON MAN (MARK 85 ARMOR - METALLIC TITANIUM PLATES + DETAILED ARC REACTOR)
# =========================================================================
# Crimson Red Titanium, Brushed Gold Plates, Carbon Fiber Insets, Glowing Arc Reactor
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
            # Gold pauldrons on outer shoulders & upper traps
            if (dist_c > 32 and y < 340) or (dist_c > 50 and y < 360):
                b = lum_top[y, x]
                iron_arr[y, x] = [int(215 + b * 40), int(170 + b * 55), int(25 + b * 35), 255]
                # Pauldron armor bevel line
                if dist_c in [33, 51] or y in [266, 339]:
                    iron_arr[y, x] = [140, 100, 15, 255]

# High-tech armored collar framing neck
for y in range(265, 305):
    for x in range(140, 208):
        if is_chest[y, x]:
            dist_c = abs(x - 174)
            if dist_c <= 28:
                # Dark titanium mechanical neck armor
                iron_arr[y, x] = [35, 38, 45, 255]
                if dist_c == 28 or y == 304:
                    iron_arr[y, x] = [215, 175, 30, 255] # Gold collar trim

# Pectoral Armor Plates & Gold Upper-Chest Inset
for y in range(305, 375):
    for x in range(120, 228):
        if is_chest[y, x]:
            dist_c = abs(x - 174)
            # Gold upper chest chevron
            if 305 <= y <= 335 and dist_c < 30 and (y - 305) > dist_c * 0.6:
                iron_arr[y, x] = [225, 180, 30, 255]
            # Pectoral armor panel lines
            if dist_c in [25, 48] or y in [355, 374]:
                iron_arr[y, x] = [95, 12, 18, 255]

# Abdominal Gold Plates & Carbon Seams
for y in range(450, 530):
    for x in range(125, 223):
        if is_chest[y, x]:
            dist_c = abs(x - 174)
            if dist_c < 38 and (y in range(450, 485) or y in range(495, 530)):
                b = lum_top[y, x]
                iron_arr[y, x] = [int(205 + b * 45), int(160 + b * 60), int(20 + b * 35), 255]
                if dist_c in [18, 37] or y in [450, 484, 495, 529]:
                    iron_arr[y, x] = [135, 95, 15, 255]

# Masterpiece Arc Reactor (Inverted Pentagon / Circular High-Tech Core)
for y in range(355, 415):
    for x in range(144, 204):
        if is_chest[y, x]:
            d = np.hypot(x - 174, y - 385)
            # Outer metallic titanium housing bracket
            if 20 <= d <= 25:
                iron_arr[y, x] = [50, 55, 65, 255]
            elif 16 <= d < 20:
                iron_arr[y, x] = [215, 180, 30, 255] # Gold reactor rim
            elif 11 <= d < 16:
                iron_arr[y, x] = [0, 180, 255, 255] # Intense cyan glow
            elif 6 <= d < 11:
                iron_arr[y, x] = [0, 240, 255, 255] # Bright glowing inner ring
            elif d < 6:
                iron_arr[y, x] = [255, 255, 255, 255] # Pure white core energy

# Gauntlet Repulsors on Forearms
for y in range(450, 545):
    for x in range(W):
        if is_sleeves[y, x] or (alpha[y, x] and (x < 75 or x > 273)):
            dist_c = abs(x - 174)
            b = lum_top[y, x]
            iron_arr[y, x] = [int(175 + b * 65), int(16 + b * 22), int(24 + b * 25), 255]
            if 480 <= y <= 515:
                iron_arr[y, x] = [int(215 + b * 40), int(170 + b * 55), int(25 + b * 35), 255]

Image.fromarray(iron_arr).save('portfolio/assets/avatar-priyam-ironman.png')
print("2. Authentic Iron Man Mark 85 saved!")

# =========================================================================
# 3. SPIDER-MAN (AUTHENTIC SCARLET RED & ROYAL WEB-BLUE + WEB LATTICE & SPIDER)
# =========================================================================
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
            is_red_yoke = (y < 350 and dist_c <= 85) or (350 <= y <= 560 and dist_c <= 52)
            if is_red_yoke:
                b = lum_top[y, x]
                spidey_arr[y, x] = [int(195 + b * 60), int(18 + b * 22), int(28 + b * 25), 255]

# Authentic Web Lattice Grid (Radiating Vertical Web Spokes + Curved Horizontal Arches)
# Vertical spokes radiating from center
for y in range(265, 560):
    for x in range(W):
        if is_chest[y, x]:
            dist_c = abs(x - 174)
            is_red_yoke = (y < 350 and dist_c <= 85) or (350 <= y <= 560 and dist_c <= 52)
            if is_red_yoke:
                # Vertical spokes
                if dist_c in [0, 18, 36, 54, 72]:
                    spidey_arr[y, x] = [25, 20, 28, 255]
                # Curved horizontal web rings (every 18 pixels)
                elif (y % 18 == 0):
                    spidey_arr[y, x] = [25, 20, 28, 255]

# Black Spider Insignia on Center Chest
# Body: Oval abdomen + diamond head + 8 distinct angled legs spreading over chest
for y in range(375, 425):
    for x in range(150, 198):
        if is_chest[y, x]:
            dist_c = abs(x - 174)
            # Spider abdomen
            if (390 <= y <= 412 and dist_c <= 5) or (382 <= y < 390 and dist_c <= 4):
                spidey_arr[y, x] = [15, 15, 20, 255]
            # Spider legs (4 left, 4 right)
            # Upper legs reaching up & out
            if (376 <= y <= 396 and abs(dist_c - (396 - y) * 1.3) <= 1.5 and dist_c <= 22):
                spidey_arr[y, x] = [15, 15, 20, 255]
            if (380 <= y <= 400 and abs(dist_c - (400 - y) * 1.1) <= 1.5 and dist_c <= 20):
                spidey_arr[y, x] = [15, 15, 20, 255]
            # Lower legs reaching down & out
            if (402 <= y <= 422 and abs(dist_c - (y - 402) * 1.2) <= 1.5 and dist_c <= 22):
                spidey_arr[y, x] = [15, 15, 20, 255]
            if (406 <= y <= 424 and abs(dist_c - (y - 406) * 0.9) <= 1.5 and dist_c <= 18):
                spidey_arr[y, x] = [15, 15, 20, 255]

# Red crew-neck collar band
for y in range(265, 290):
    for x in range(145, 203):
        if is_chest[y, x] and abs(x - 174) <= 28:
            spidey_arr[y, x] = [195, 18, 28, 255]
            if abs(x - 174) in [0, 14, 28] or y in [266, 289]:
                spidey_arr[y, x] = [25, 20, 28, 255]

Image.fromarray(spidey_arr).save('portfolio/assets/avatar-priyam-spiderman.png')
print("3. Authentic Spider-Man Suit saved!")

# =========================================================================
# 4. CR7 (CRISTIANO RONALDO - REAL MADRID NO. 7 HOME KIT)
# =========================================================================
cr7_arr = top_arr.copy()
# Crisp all-white jersey base
for y, x in zip(*np.where(is_chest | is_sleeves)):
    b = lum_top[y, x]
    cr7_arr[y, x] = [int(228 + b * 27), int(230 + b * 25), int(236 + b * 19), 255]

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
            # 3 distinct stripes
            if 70 <= dist_c <= 125:
                stripe_idx = (dist_c - 70) // 18
                offset_in_stripe = (dist_c - 70) % 18
                if stripe_idx in [0, 1, 2] and offset_in_stripe < 7:
                    cr7_arr[y, x] = [215, 175, 25, 255]

# Real Madrid Crown Crest (Left Chest over Heart - x: 205-230, y: 345-385)
for y in range(345, 385):
    for x in range(205, 232):
        if is_chest[y, x]:
            # Gold Royal Crown on top
            if 345 <= y <= 356:
                if y in [345, 346] and (x in [207, 218, 229]): # Crown peaks
                    cr7_arr[y, x] = [255, 215, 0, 255]
                elif 348 <= y <= 356 and 206 <= x <= 230:
                    cr7_arr[y, x] = [235, 185, 25, 255]
                    if y == 352 and (x % 4 in [0, 1]):
                        cr7_arr[y, x] = [200, 25, 35, 255] # Ruby jewels in crown
            # Circular Crest Shield with Diagonal Sash
            elif 357 <= y <= 385:
                d = np.hypot(x - 218, y - 370)
                if d <= 12:
                    # Gold border
                    if d >= 10:
                        cr7_arr[y, x] = [215, 175, 25, 255]
                    # Blue diagonal sash
                    elif abs((x - 218) + (y - 370)) <= 3:
                        cr7_arr[y, x] = [18, 45, 120, 255]
                    else:
                        cr7_arr[y, x] = [250, 250, 255, 255]

# Adidas Gold Brand Badge (Right Chest - x: 120-138, y: 358-372)
for y in range(358, 372):
    for x in range(120, 138):
        if is_chest[y, x]:
            # 3 slanted gold bars
            if (368 <= y <= 371 and 120 <= x <= 125) or \
               (363 <= y <= 371 and 126 <= x <= 131) or \
               (358 <= y <= 371 and 132 <= x <= 137):
                cr7_arr[y, x] = [215, 175, 25, 255]

# Bold "Fly Emirates" / "7" Center Sponsor & Iconic Number
# Navy Fly Emirates sponsor bar
for y in range(390, 408):
    for x in range(115, 233):
        if is_chest[y, x]:
            # Clean dark navy Fly Emirates badge
            if (y in [390, 407] or x in [115, 232]) or (393 <= y <= 404 and (x % 9 in [0, 1])):
                cr7_arr[y, x] = [12, 25, 55, 255]

# Iconic Bold "7" (y: 420-520, x: 148-200)
for y in range(420, 520):
    for x in range(148, 202):
        if is_chest[y, x]:
            # Top horizontal bar of "7"
            is_top = (420 <= y <= 438) and (148 <= x <= 200)
            # Diagonal stem of "7"
            is_stem = abs((y - 420) - int((198 - x) * 2.2)) <= 7 and (x >= 154)
            if is_top or is_stem:
                cr7_arr[y, x] = [12, 25, 55, 255] # Solid Dark Navy
                # Gold highlight edge on 7
                if (is_top and y == 420) or (is_stem and abs((y - 420) - int((198 - x) * 2.2)) == 7):
                    cr7_arr[y, x] = [215, 175, 25, 255]

# Black & Gold Captain's Armband ("C") on Left Bicep
for y in range(365, 410):
    for x in range(250, 282):
        if is_sleeves[y, x] or alpha[y, x]:
            cr7_arr[y, x] = [20, 20, 25, 255] # Black band
            if y in [365, 409]: cr7_arr[y, x] = [215, 175, 25, 255] # Gold rim
            # White "C"
            if 378 <= y <= 396 and 260 <= x <= 272:
                if (y in [378, 379, 395, 396] and 262 <= x <= 272) or (x in [260, 261] and 378 <= y <= 396):
                    cr7_arr[y, x] = [255, 255, 255, 255]

Image.fromarray(cr7_arr).save('portfolio/assets/avatar-priyam-football.png')
print("4. Authentic CR7 Real Madrid No. 7 saved!")

# =========================================================================
# 5. F1 SCUDERIA RACER (ROSSO CORSA FIRE-SUIT + FERRARI SHIELD + SPONSORS)
# =========================================================================
f1_arr = top_arr.copy()
# Base Rosso Corsa Red fire-suit
for y, x in zip(*np.where(is_chest | is_sleeves)):
    b = lum_top[y, x]
    f1_arr[y, x] = [int(195 + b * 60), int(14 + b * 18), int(20 + b * 20), 255]

# Black Aerodynamic Side Panels & Epaulets
for y in range(265, 560):
    for x in range(W):
        if is_chest[y, x] or is_sleeves[y, x]:
            dist_c = abs(x - 174)
            # Black shoulder epaulets with Italian Tricolore
            if y < 310 and dist_c > 45:
                f1_arr[y, x] = [22, 22, 26, 255]
                # Italian flag strip (Green, White, Red)
                if 280 <= y <= 295:
                    if 46 <= dist_c <= 54: f1_arr[y, x] = [0, 146, 70, 255] # Green
                    elif 55 <= dist_c <= 63: f1_arr[y, x] = [255, 255, 255, 255] # White
                    elif 64 <= dist_c <= 72: f1_arr[y, x] = [206, 43, 55, 255] # Red
            # Black torso flanks
            elif y >= 340 and dist_c > 52:
                f1_arr[y, x] = [22, 22, 26, 255]
                if dist_c == 53: f1_arr[y, x] = [255, 255, 255, 255] # White piping

# High Nomex Collar
for y in range(265, 305):
    for x in range(144, 204):
        if is_chest[y, x]:
            f1_arr[y, x] = [170, 10, 15, 255]
            if y == 304: f1_arr[y, x] = [22, 22, 26, 255] # Black Velcro belt

# White Horizontal Sponsor Band across Chest (y: 335-365)
for y in range(335, 365):
    for x in range(124, 224):
        if is_chest[y, x]:
            f1_arr[y, x] = [255, 255, 255, 255]
            # Santander / Shell black sponsor text marks
            if (y in [345, 355] and x % 10 in [0, 1, 2]) or (345 <= y <= 355 and x in [140, 174, 205]):
                f1_arr[y, x] = [15, 15, 20, 255]

# Authentic Ferrari Cavallino Rampante Shield (Left Chest - x: 200-226, y: 380-418)
for y in range(380, 418):
    for x in range(200, 226):
        if is_chest[y, x]:
            dist_s = abs(x - 213)
            # Yellow Shield shape (Canary Yellow #FFE000)
            if (y < 406 and dist_s <= 11) or (y >= 406 and dist_s <= (418 - y)):
                # Italian tricolore flag on top of shield
                if y in [380, 381, 382]:
                    if x <= 207: f1_arr[y, x] = [0, 146, 70, 255]
                    elif x <= 218: f1_arr[y, x] = [255, 255, 255, 255]
                    else: f1_arr[y, x] = [206, 43, 55, 255]
                # Canary Yellow Body
                else:
                    f1_arr[y, x] = [255, 224, 0, 255]
                    # Black Prancing Horse (Cavallino) Silhouette
                    # Head, arched body, rearing front hooves, and tail
                    if (388 <= y <= 408 and dist_s <= 2) or \
                       (386 <= y <= 392 and 212 <= x <= 217) or \
                       (398 <= y <= 404 and 209 <= x <= 215) or \
                       (406 <= y <= 412 and 211 <= x <= 216):
                        f1_arr[y, x] = [15, 15, 15, 255]

Image.fromarray(f1_arr).save('portfolio/assets/avatar-priyam-f1.png')
print("5. Authentic Scuderia Ferrari F1 saved!")

# =========================================================================
# 6. SUPER SAIYAN (PRESERVE ICONIC SPIKY GOLDEN HAIR + DBZ TURTLE GI)
# =========================================================================
# saiyan is preserved with true spiky golden anime hair
print("6. Super Saiyan preserved with spiky hair & Gi!")

# =========================================================================
# 7. CYBER TECHWEAR (PRESERVE NINJA COWL & NEON ZIPPER)
# =========================================================================
print("7. Cyber Techwear preserved!")

print("ALL COSTUMES SUCCESSFULLY TAILORED TO ICONIC PERFECTION!")
