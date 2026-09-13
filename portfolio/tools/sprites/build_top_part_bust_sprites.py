import numpy as np
from PIL import Image

# Load the clean solid mannequin
m_img = Image.open('portfolio/assets/avatar-priyam-mannequin.png').convert('RGBA')
arr_m = np.array(m_img)

# Crop to TOP PART ONLY (Head to waist y: 0 to 560)
top_arr = arr_m[0:560, :].copy()
H, W = top_arr.shape[:2] # 560 x 348
alpha = top_arr[:, :, 3] > 0

# Mask definitions for top part
is_head = alpha & (np.arange(H)[:, None] < 265)
is_hair = is_head & (top_arr[:, :, 0] < 120) & (top_arr[:, :, 1] < 95) & (top_arr[:, :, 2] < 95)
is_skin = alpha & (top_arr[:, :, 0] > 140) & (top_arr[:, :, 1] > 80) & (top_arr[:, :, 2] > 50) & (top_arr[:, :, 0] > top_arr[:, :, 2] + 25)
is_chest = alpha & (np.arange(H)[:, None] >= 265) & (np.arange(W)[None, :] >= 65) & (np.arange(W)[None, :] <= 282)
is_sleeves = alpha & (np.arange(H)[:, None] >= 285) & (np.arange(H)[:, None] <= 440) & ((np.arange(W)[None, :] <= 95) | (np.arange(W)[None, :] >= 252))

lum_top = (top_arr[:, :, 0].astype(float)*0.299 + top_arr[:, :, 1].astype(float)*0.587 + top_arr[:, :, 2].astype(float)*0.114) / 255.0

# ----------------------------------------------------
# 1. FOUNDER CASUAL (Bust)
# ----------------------------------------------------
casual = top_arr.copy()
for y, x in zip(*np.where(is_chest | is_sleeves)):
    b = lum_top[y, x]
    casual[y, x] = [int(68 + b * 55), int(42 + b * 38), int(28 + b * 26), 255]

# Open collar V-neck
for y in range(265, 335):
    for x in range(150, 200):
        if is_chest[y, x] and abs(x - 174) < (335 - y) * 0.35:
            casual[y, x] = top_arr[min(264, y), x]

# Buttons
for by in [365, 435, 505]:
    for dy in [-2, -1, 0, 1, 2]:
        for dx in [-2, -1, 0, 1, 2]:
            casual[by + dy, 174 + dx] = [255, 255, 255, 255]

# Chest Pocket
for y in range(380, 435):
    for x in range(205, 235):
        if is_chest[y, x] and (y in [380, 434] or x in [205, 234]):
            casual[y, x] = [50, 30, 20, 255]

# Bottom hem border
for x in range(W):
    if alpha[H-1, x]: casual[H-1, x] = [50, 30, 20, 255]

Image.fromarray(casual).save('portfolio/assets/avatar-priyam-casual.png')
print('1. Bust Casual saved!')

# ----------------------------------------------------
# 2. SUPER SAIYAN (Bust with True Spiky Golden Anime Hair)
# ----------------------------------------------------
raw_saiyan = Image.open('/Users/priyamrupapara/.gemini/antigravity/brain/63bba458-c2ee-4b74-a116-d2cd7430cc84/priyam_saiyan_sprite_1788255014863.jpg').convert('RGBA')
arr_s = np.array(raw_saiyan)
is_white = (arr_s[:, :, 0] > 230) & (arr_s[:, :, 1] > 230) & (arr_s[:, :, 2] > 230)
arr_s[is_white, 3] = 0
alpha_s = arr_s[:, :, 3] > 0
ys_s, xs_s = np.where(alpha_s)
# Crop top part of saiyan (head + chest)
crop_s = arr_s[ys_s.min():ys_s.min() + int((ys_s.max()-ys_s.min())*0.62), xs_s.min():xs_s.max()+1]
saiyan_img = Image.fromarray(crop_s)

# Scale to target bust height (560px)
target_h = 560
scale = target_h / saiyan_img.height
target_w = int(saiyan_img.width * scale)
saiyan_scaled = saiyan_img.resize((target_w, target_h), Image.Resampling.NEAREST)

canvas_saiyan = Image.new('RGBA', (W, target_h), (0, 0, 0, 0))
paste_x = (W - target_w) // 2
canvas_saiyan.paste(saiyan_scaled, (paste_x, 0), saiyan_scaled)
arr_final_saiyan = np.array(canvas_saiyan)

# Add Priyam's black rectangular glasses on Saiyan eyes
for y in range(275, 305):
    for x in range(125, 225):
        is_left_frame = (y in [276, 277, 303, 304] and 130 <= x <= 170) or (x in [130, 131, 169, 170] and 276 <= y <= 304)
        is_right_frame = (y in [276, 277, 303, 304] and 180 <= x <= 220) or (x in [180, 181, 219, 220] and 276 <= y <= 304)
        is_bridge = (y in [286, 287] and 169 <= x <= 181)
        if is_left_frame or is_right_frame or is_bridge:
            arr_final_saiyan[y, x] = [20, 20, 24, 255]

Image.fromarray(arr_final_saiyan).save('portfolio/assets/avatar-priyam-saiyan.png')
print('2. Bust Super Saiyan saved!')

# ----------------------------------------------------
# 3. CYBER TECHWEAR (Bust)
# ----------------------------------------------------
tech = top_arr.copy()
for y, x in zip(*np.where(is_chest | is_sleeves)):
    b = lum_top[y, x]
    tech[y, x] = [int(15 + b * 25), int(18 + b * 28), int(26 + b * 35), 255]

# Cowl Neck
for y in range(250, 320):
    for x in range(130, 218):
        if alpha[y, x]:
            tech[y, x] = [22, 26, 36, 255]
            if x % 8 in [0, 1]: tech[y, x] = [38, 45, 62, 255]

# Neon Cyan Zipper
for y in range(250, H):
    for x in range(172, 177):
        if alpha[y, x]:
            tech[y, x] = [0, 240, 255, 255]
            if x == 174: tech[y, x] = [220, 255, 255, 255]

# Harness Straps
for y in range(370, 390):
    for x in range(80, 268):
        if alpha[y, x] and abs(x - 174) > 15: tech[y, x] = [60, 72, 95, 255]
for y in range(372, 388):
    for x in range(164, 184):
        if alpha[y, x]: tech[y, x] = [200, 215, 230, 255]

Image.fromarray(tech).save('portfolio/assets/avatar-priyam-techwear.png')
print('3. Bust Techwear saved!')

# ----------------------------------------------------
# 4. CR7 REAL MADRID NO. 7 (Bust)
# ----------------------------------------------------
cr7 = top_arr.copy()
for y, x in zip(*np.where(is_chest | is_sleeves)):
    b = lum_top[y, x]
    cr7[y, x] = [int(215 + b * 40), int(220 + b * 35), int(230 + b * 25), 255]

# Shoulder 3-stripes
for y in range(275, 340):
    for x in range(W):
        if is_chest[y, x] and ((80 < x < 125) or (223 < x < 268)) and (y % 6 in [0, 1]):
            cr7[y, x] = [230, 185, 25, 255]

# Real Madrid Crest
for y in range(360, 390):
    for x in range(205, 228):
        if is_chest[y, x] and np.hypot(x - 216, y - 375) <= 11:
            cr7[y, x] = [235, 190, 30, 255]
            if y == 364: cr7[y, x] = [255, 220, 50, 255]

# Bold "7"
for y in range(410, 495):
    for x in range(152, 198):
        if is_chest[y, x]:
            is_top = (410 <= y <= 425) and (152 <= x <= 196)
            is_slash = abs((y - 410) - int((194 - x) * 2.1)) <= 4 and (x >= 158)
            if is_top or is_slash:
                cr7[y, x] = [15, 25, 55, 255]
                if is_top and y == 412: cr7[y, x] = [230, 185, 25, 255]

Image.fromarray(cr7).save('portfolio/assets/avatar-priyam-football.png')
print('4. Bust CR7 saved!')

# ----------------------------------------------------
# 5. F1 SCUDERIA RACER (Bust)
# ----------------------------------------------------
f1 = top_arr.copy()
for y, x in zip(*np.where(is_chest | is_sleeves)):
    dist_c = abs(x - 174)
    b = lum_top[y, x]
    if dist_c > 52 and y > 300: f1[y, x] = [22, 22, 26, 255]
    else: f1[y, x] = [int(155 + b * 75), int(15 + b * 20), int(22 + b * 20), 255]

# Sponsor stripe
for y in range(350, 370):
    for x in range(110, 238):
        if is_chest[y, x]: f1[y, x] = [252, 252, 255, 255]

# Ferrari Shield
for y in range(385, 415):
    for x in range(200, 225):
        if is_chest[y, x]:
            dc = abs(x - 212)
            if (y < 405 and dc <= 10) or (y >= 405 and dc <= (415 - y)):
                f1[y, x] = [255, 220, 0, 255]
                if dc <= 1 and 392 <= y <= 408: f1[y, x] = [15, 15, 15, 255]

Image.fromarray(f1).save('portfolio/assets/avatar-priyam-f1.png')
print('5. Bust F1 saved!')

# ----------------------------------------------------
# 6. IRON MAN MARK 85 (Bust)
# ----------------------------------------------------
iron = top_arr.copy()
for y, x in zip(*np.where(is_chest | is_sleeves)):
    dist_c = abs(x - 174)
    b = lum_top[y, x]
    is_gold = (y < 350 and dist_c > 28) or (490 <= y <= 530 and dist_c < 45)
    if is_gold: iron[y, x] = [int(185 + b * 65), int(145 + b * 80), int(15 + b * 40), 255]
    else: iron[y, x] = [int(155 + b * 75), int(12 + b * 20), int(18 + b * 20), 255]

# Glowing Arc Reactor
for y in range(358, 402):
    for x in range(154, 194):
        if is_chest[y, x]:
            d = np.hypot(x - 174, y - 380)
            if d <= 7: iron[y, x] = [255, 255, 255, 255]
            elif d <= 13: iron[y, x] = [0, 240, 255, 255]
            elif d <= 17: iron[y, x] = [0, 140, 210, 255]

Image.fromarray(iron).save('portfolio/assets/avatar-priyam-ironman.png')
print('6. Bust Iron Man saved!')

# ----------------------------------------------------
# 7. SPIDER-MAN (Bust)
# ----------------------------------------------------
spidey = top_arr.copy()
for y, x in zip(*np.where(is_chest | is_sleeves)):
    dist_c = abs(x - 174)
    b = lum_top[y, x]
    if dist_c > 48: spidey[y, x] = [int(15 + b * 20), int(65 + b * 65), int(185 + b * 65), 255]
    else:
        spidey[y, x] = [int(165 + b * 70), int(15 + b * 20), int(22 + b * 20), 255]
        if (x % 14 in [0, 1]) or (y % 16 in [0, 1]):
            spidey[y, x] = [int(spidey[y, x, 0]*0.35), int(spidey[y, x, 1]*0.35), int(spidey[y, x, 2]*0.35), 255]

# Center Spider
for y in range(380, 425):
    for x in range(160, 188):
        if is_chest[y, x]:
            if np.hypot(x - 174, y - 395) <= 5 or np.hypot(x - 174, y - 407) <= 6: spidey[y, x] = [15, 15, 20, 255]
            if (abs(x - 174) == int(abs(y - 395)*1.4) and 382 <= y <= 412) or (abs(x - 174) == int(abs(y - 404)*1.6) and 394 <= y <= 422):
                spidey[y, x] = [15, 15, 20, 255]

Image.fromarray(spidey).save('portfolio/assets/avatar-priyam-spiderman.png')
print('7. Bust Spider-Man saved!')
print('ALL 7 TOP-PART BUST SPRITES SAVED!')
