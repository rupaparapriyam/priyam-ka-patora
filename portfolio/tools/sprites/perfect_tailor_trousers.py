import numpy as np
from PIL import Image

m_img = Image.open('portfolio/assets/avatar-priyam-mannequin.png').convert('RGBA')
arr_m = np.array(m_img)
H, W = arr_m.shape[:2]
alpha = arr_m[:, :, 3] > 0

is_torso_tshirt = alpha & (np.arange(H)[:, None] >= 265) & (np.arange(H)[:, None] < 555) & (np.arange(W)[None, :] >= 65) & (np.arange(W)[None, :] <= 282)
is_upper_sleeves = alpha & (np.arange(H)[:, None] >= 285) & (np.arange(H)[:, None] <= 440) & ((np.arange(W)[None, :] <= 95) | (np.arange(W)[None, :] >= 252))
is_full_sleeves = alpha & (np.arange(H)[:, None] >= 285) & (np.arange(H)[:, None] <= 570) & ((np.arange(W)[None, :] <= 95) | (np.arange(W)[None, :] >= 252))
is_hands = alpha & (np.arange(H)[:, None] > 570) & (np.arange(H)[:, None] < 720) & ((np.arange(W)[None, :] < 75) | (np.arange(W)[None, :] > 270))
is_trousers = alpha & (np.arange(H)[:, None] >= 555) & (np.arange(H)[:, None] <= 915) & (np.arange(W)[None, :] >= 65) & (np.arange(W)[None, :] <= 282)
is_feet = alpha & (np.arange(H)[:, None] > 915)

lum_m = (arr_m[:, :, 0].astype(float)*0.299 + arr_m[:, :, 1].astype(float)*0.587 + arr_m[:, :, 2].astype(float)*0.114) / 255.0

# ----------------------------------------------------
# 1. FOUNDER CASUAL (Mocha Brown Shirt + Beige Chinos)
# ----------------------------------------------------
casual = arr_m.copy()

# Shirt
for y, x in zip(*np.where(is_torso_tshirt | is_upper_sleeves)):
    b = lum_m[y, x]
    casual[y, x] = [int(68 + b * 55), int(42 + b * 38), int(28 + b * 26), 255]

# Open collar
for y in range(265, 335):
    for x in range(150, 200):
        if is_torso_tshirt[y, x] and abs(x - 174) < (335 - y) * 0.35:
            casual[y, x] = arr_m[min(264, y), x]

# Buttons
for by in [365, 425, 485]:
    for dy in [-2, -1, 0, 1, 2]:
        for dx in [-2, -1, 0, 1, 2]: casual[by + dy, 174 + dx] = [255, 255, 255, 255]

# Pocket
for y in range(380, 435):
    for x in range(205, 235):
        if is_torso_tshirt[y, x] and (y in [380, 434] or x in [205, 234]):
            casual[y, x] = [50, 30, 20, 255]

# Smooth Chinos (Smooth out boxer hem by using vertical gradient + leg anatomy)
for y, x in zip(*np.where(is_trousers)):
    dist_c = abs(x - 174)
    # Natural shading based on curvature
    lum_curve = 0.65 + 0.3 * (1.0 - min(1.0, dist_c / 60.0))
    if y > 670 and dist_c <= 2: lum_curve = 0.45 # Inseam shadow
    casual[y, x] = [int(150 + lum_curve * 75), int(140 + lum_curve * 75), int(125 + lum_curve * 75), 255]

# Shoes
for y, x in zip(*np.where(is_feet)):
    casual[y, x] = [38, 42, 52, 255]
    if y >= 950: casual[y, x] = [22, 25, 32, 255]

Image.fromarray(casual).save('portfolio/assets/avatar-priyam-casual.png')
print('Casual perfected!')

# ----------------------------------------------------
# 2. CYBER TECHWEAR
# ----------------------------------------------------
tech = arr_m.copy()
for y, x in zip(*np.where(is_torso_tshirt | is_full_sleeves)):
    b = lum_m[y, x]
    tech[y, x] = [int(15 + b * 25), int(18 + b * 28), int(26 + b * 35), 255]

for y in range(250, 320):
    for x in range(130, 218):
        if alpha[y, x]:
            tech[y, x] = [22, 26, 36, 255]
            if x % 8 in [0, 1]: tech[y, x] = [38, 45, 62, 255]

for y in range(250, 555):
    for x in range(172, 177):
        if alpha[y, x]:
            tech[y, x] = [0, 240, 255, 255]
            if x == 174: tech[y, x] = [220, 255, 255, 255]

for y in range(370, 390):
    for x in range(80, 268):
        if alpha[y, x] and abs(x - 174) > 15: tech[y, x] = [60, 72, 95, 255]
for y in range(372, 388):
    for x in range(164, 184):
        if alpha[y, x]: tech[y, x] = [200, 215, 230, 255]

for y, x in zip(*np.where(is_trousers)):
    dist_c = abs(x - 174)
    lum_curve = 0.65 + 0.3 * (1.0 - min(1.0, dist_c / 60.0))
    if y > 670 and dist_c <= 2: lum_curve = 0.45
    tech[y, x] = [int(12 + lum_curve * 25), int(15 + lum_curve * 28), int(22 + lum_curve * 35), 255]
    if 750 <= y <= 760 and (110 <= x <= 135 or 213 <= x <= 238): tech[y, x] = [0, 240, 255, 255]

for y, x in zip(*np.where(is_hands)): tech[y, x] = [15, 18, 24, 255]
for y, x in zip(*np.where(is_feet)):
    tech[y, x] = [15, 18, 24, 255]
    if y in [930, 945]: tech[y, x] = [0, 240, 255, 255]

Image.fromarray(tech).save('portfolio/assets/avatar-priyam-techwear.png')
print('Techwear perfected!')

# ----------------------------------------------------
# 3. CR7 REAL MADRID NO. 7
# ----------------------------------------------------
cr7 = arr_m.copy()
for y, x in zip(*np.where(is_torso_tshirt | is_upper_sleeves)):
    b = lum_m[y, x]
    cr7[y, x] = [int(215 + b * 40), int(220 + b * 35), int(230 + b * 25), 255]

for y in range(275, 340):
    for x in range(W):
        if is_torso_tshirt[y, x] and ((80 < x < 125) or (223 < x < 268)) and (y % 6 in [0, 1]):
            cr7[y, x] = [230, 185, 25, 255]

for y in range(360, 390):
    for x in range(205, 228):
        if is_torso_tshirt[y, x] and np.hypot(x - 216, y - 375) <= 11:
            cr7[y, x] = [235, 190, 30, 255]
            if y == 364: cr7[y, x] = [255, 220, 50, 255]

for y in range(410, 495):
    for x in range(152, 198):
        if is_torso_tshirt[y, x]:
            is_top = (410 <= y <= 425) and (152 <= x <= 196)
            is_slash = abs((y - 410) - int((194 - x) * 2.1)) <= 4 and (x >= 158)
            if is_top or is_slash:
                cr7[y, x] = [15, 25, 55, 255]
                if is_top and y == 412: cr7[y, x] = [230, 185, 25, 255]

# Match Shorts (y: 555 to 705)
for y in range(555, 706):
    for x in range(65, 283):
        if alpha[y, x]:
            dist_c = abs(x - 174)
            lum_curve = 0.75 + 0.25 * (1.0 - min(1.0, dist_c / 60.0))
            if y > 670 and dist_c <= 2: lum_curve = 0.55
            cr7[y, x] = [int(195 + lum_curve * 60), int(200 + lum_curve * 55), int(210 + lum_curve * 45), 255]
            if x in [95, 253]: cr7[y, x] = [230, 185, 25, 255]

# White Athletic Socks with Gold Bands (y: 770 to 915)
for y in range(770, 916):
    for x in range(65, 283):
        if alpha[y, x]:
            cr7[y, x] = [245, 248, 252, 255]
            if y in [780, 788]: cr7[y, x] = [230, 185, 25, 255]

for y, x in zip(*np.where(is_feet)):
    cr7[y, x] = [20, 24, 32, 255]
    if y % 8 in [0, 1]: cr7[y, x] = [255, 255, 255, 255]

Image.fromarray(cr7).save('portfolio/assets/avatar-priyam-football.png')
print('CR7 perfected!')

# ----------------------------------------------------
# 4. F1 SCUDERIA RACER
# ----------------------------------------------------
f1 = arr_m.copy()
for y, x in zip(*np.where(is_torso_tshirt)):
    dist_c = abs(x - 174)
    b = lum_m[y, x]
    if dist_c > 52: f1[y, x] = [22, 22, 26, 255]
    else: f1[y, x] = [int(155 + b * 75), int(15 + b * 20), int(22 + b * 20), 255]

for y, x in zip(*np.where(is_full_sleeves)): f1[y, x] = [215, 25, 32, 255]
for y, x in zip(*np.where(is_hands)): f1[y, x] = [20, 20, 24, 255]

for y in range(350, 370):
    for x in range(110, 238):
        if is_torso_tshirt[y, x]: f1[y, x] = [252, 252, 255, 255]

for y in range(385, 415):
    for x in range(200, 225):
        if is_torso_tshirt[y, x]:
            dc = abs(x - 212)
            if (y < 405 and dc <= 10) or (y >= 405 and dc <= (415 - y)):
                f1[y, x] = [255, 220, 0, 255]
                if dc <= 1 and 392 <= y <= 408: f1[y, x] = [15, 15, 15, 255]

for y, x in zip(*np.where(is_trousers)):
    dist_c = abs(x - 174)
    lum_curve = 0.65 + 0.3 * (1.0 - min(1.0, dist_c / 60.0))
    if y > 670 and dist_c <= 2: lum_curve = 0.45
    f1[y, x] = [int(135 + lum_curve * 85), int(12 + lum_curve * 20), int(18 + lum_curve * 20), 255]
    if x in [95, 253]: f1[y, x] = [20, 20, 24, 255]

for y, x in zip(*np.where(is_feet)):
    f1[y, x] = [185, 20, 28, 255]
    if y >= 945: f1[y, x] = [20, 20, 24, 255]

Image.fromarray(f1).save('portfolio/assets/avatar-priyam-f1.png')
print('F1 perfected!')

# ----------------------------------------------------
# 5. IRON MAN MARK 85
# ----------------------------------------------------
iron = arr_m.copy()
for y, x in zip(*np.where(is_torso_tshirt)):
    dist_c = abs(x - 174)
    b = lum_m[y, x]
    is_gold = (y < 350 and dist_c > 28) or (490 <= y <= 530 and dist_c < 45)
    if is_gold: iron[y, x] = [int(185 + b * 65), int(145 + b * 80), int(15 + b * 40), 255]
    else: iron[y, x] = [int(155 + b * 75), int(12 + b * 20), int(18 + b * 20), 255]

for y, x in zip(*np.where(is_full_sleeves)):
    if (420 <= y <= 470) or (620 <= y <= 660): iron[y, x] = [245, 195, 22, 255]
    else: iron[y, x] = [195, 22, 30, 255]

for y, x in zip(*np.where(is_hands)): iron[y, x] = [245, 195, 22, 255]

for y in range(358, 402):
    for x in range(154, 194):
        if is_torso_tshirt[y, x]:
            d = np.hypot(x - 174, y - 380)
            if d <= 7: iron[y, x] = [255, 255, 255, 255]
            elif d <= 13: iron[y, x] = [0, 240, 255, 255]
            elif d <= 17: iron[y, x] = [0, 140, 210, 255]

for y, x in zip(*np.where(is_trousers)):
    dist_c = abs(x - 174)
    lum_curve = 0.65 + 0.3 * (1.0 - min(1.0, dist_c / 60.0))
    if 720 <= y <= 770 and 18 < dist_c < 65: iron[y, x] = [245, 195, 22, 255]
    else: iron[y, x] = [int(135 + lum_curve * 85), int(12 + lum_curve * 20), int(18 + lum_curve * 20), 255]

for y, x in zip(*np.where(is_feet)):
    iron[y, x] = [185, 20, 28, 255]
    if y >= 948: iron[y, x] = [245, 195, 22, 255]

Image.fromarray(iron).save('portfolio/assets/avatar-priyam-ironman.png')
print('Iron Man perfected!')

# ----------------------------------------------------
# 6. SPIDER-MAN
# ----------------------------------------------------
spidey = arr_m.copy()
for y, x in zip(*np.where(is_torso_tshirt)):
    dist_c = abs(x - 174)
    b = lum_m[y, x]
    if dist_c > 48: spidey[y, x] = [int(15 + b * 20), int(65 + b * 65), int(185 + b * 65), 255]
    else:
        spidey[y, x] = [int(165 + b * 70), int(15 + b * 20), int(22 + b * 20), 255]
        if (x % 14 in [0, 1]) or (y % 16 in [0, 1]):
            spidey[y, x] = [int(spidey[y, x, 0]*0.35), int(spidey[y, x, 1]*0.35), int(spidey[y, x, 2]*0.35), 255]

for y, x in zip(*np.where(is_full_sleeves)): spidey[y, x] = [22, 85, 215, 255]
for y, x in zip(*np.where(is_hands)):
    spidey[y, x] = [215, 28, 38, 255]
    if (x % 14 in [0, 1]) or (y % 16 in [0, 1]): spidey[y, x] = [75, 10, 15, 255]

for y in range(380, 425):
    for x in range(160, 188):
        if is_torso_tshirt[y, x]:
            if np.hypot(x - 174, y - 395) <= 5 or np.hypot(x - 174, y - 407) <= 6: spidey[y, x] = [15, 15, 20, 255]
            if (abs(x - 174) == int(abs(y - 395)*1.4) and 382 <= y <= 412) or (abs(x - 174) == int(abs(y - 404)*1.6) and 394 <= y <= 422):
                spidey[y, x] = [15, 15, 20, 255]

for y, x in zip(*np.where(is_trousers)):
    dist_c = abs(x - 174)
    lum_curve = 0.65 + 0.3 * (1.0 - min(1.0, dist_c / 60.0))
    if dist_c < 30 and y < 680:
        spidey[y, x] = [215, 28, 38, 255]
        if (x % 14 in [0, 1]) or (y % 16 in [0, 1]): spidey[y, x] = [75, 10, 15, 255]
    else:
        spidey[y, x] = [int(15 + lum_curve * 20), int(55 + lum_curve * 70), int(165 + lum_curve * 80), 255]
        if abs(x - 174) <= 1 and y > 670: spidey[y, x] = [8, 35, 110, 255]

for y, x in zip(*np.where(is_feet)):
    spidey[y, x] = [215, 28, 38, 255]
    if (x % 14 in [0, 1]) or (y % 16 in [0, 1]): spidey[y, x] = [75, 10, 15, 255]

Image.fromarray(spidey).save('portfolio/assets/avatar-priyam-spiderman.png')
print('Spider-Man perfected!')
print('ALL 6 MANNEQUIN CHARACTERS SAVED!')
