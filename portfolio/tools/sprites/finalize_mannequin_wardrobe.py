import numpy as np
from PIL import Image

m_img = Image.open('portfolio/assets/avatar-priyam-mannequin.png').convert('RGBA')
arr_m = np.array(m_img)
H, W = arr_m.shape[:2] # 962 x 348
alpha = arr_m[:, :, 3] > 0

# Accurate Region Masks
is_tshirt = alpha & (np.arange(H)[:, None] >= 265) & (np.arange(H)[:, None] <= 560) & (arr_m[:, :, 0] > 180)
is_shorts = alpha & (np.arange(H)[:, None] > 560) & (np.arange(H)[:, None] <= 710)
is_skin = alpha & (arr_m[:, :, 0] > 140) & (arr_m[:, :, 1] > 80) & (arr_m[:, :, 2] > 50) & (arr_m[:, :, 0] > arr_m[:, :, 2] + 25)
is_upper_arms = is_skin & (np.arange(H)[:, None] > 320) & (np.arange(H)[:, None] <= 450) & ((np.arange(W)[None, :] <= 95) | (np.arange(W)[None, :] >= 250))
is_full_arms = is_skin & (np.arange(H)[:, None] > 320) & (np.arange(H)[:, None] <= 680) & ((np.arange(W)[None, :] <= 95) | (np.arange(W)[None, :] >= 250))
is_lower_body = alpha & (np.arange(H)[:, None] >= 560) & (np.arange(H)[:, None] <= 915)
is_feet = alpha & (np.arange(H)[:, None] > 915)

def get_norm_lum(mask):
    lum = (arr_m[:, :, 0].astype(float)*0.299 + arr_m[:, :, 1].astype(float)*0.587 + arr_m[:, :, 2].astype(float)*0.114) / 255.0
    vals = lum[mask]
    if len(vals) == 0: return np.zeros((H, W))
    min_v, max_v = np.min(vals), np.max(vals)
    return np.clip((lum - min_v) / (max_v - min_v + 1e-5), 0.0, 1.0)

lum_tshirt = get_norm_lum(is_tshirt)
lum_lower = get_norm_lum(is_lower_body)

def apply_shading(mask, lum_map, dark_rgb, light_rgb):
    out = np.zeros((H, W, 4), dtype=np.uint8)
    for y, x in zip(*np.where(mask)):
        l = lum_map[y, x]
        r = int(dark_rgb[0] + (light_rgb[0] - dark_rgb[0]) * l)
        g = int(dark_rgb[1] + (light_rgb[1] - dark_rgb[1]) * l)
        b = int(dark_rgb[2] + (light_rgb[2] - dark_rgb[2]) * l)
        out[y, x] = [np.clip(r, 0, 255), np.clip(g, 0, 255), np.clip(b, 0, 255), 255]
    return out

# ====================================================
# 1. FOUNDER CASUAL
# ====================================================
casual = arr_m.copy()
b_dark, b_light = (65, 38, 25), (145, 95, 70)
brown_torso = apply_shading(is_tshirt, lum_tshirt, b_dark, b_light)
for y, x in zip(*np.where(is_tshirt)): casual[y, x] = brown_torso[y, x]
for y, x in zip(*np.where(is_upper_arms)): casual[y, x] = [105, 68, 50, 255]

# Open collar V-neck
for y in range(265, 330):
    for x in range(150, 200):
        if is_tshirt[y, x] and abs(x - 174) < (330 - y) * 0.35: casual[y, x] = [218, 148, 108, 255]

# Buttons
for by in [360, 420, 480]:
    for dy in [-2, -1, 0, 1, 2]:
        for dx in [-2, -1, 0, 1, 2]: casual[by + dy, 174 + dx] = [255, 255, 255, 255]

# Pocket
for y in range(380, 436):
    for x in range(205, 236):
        if is_tshirt[y, x] and (y in [380, 435] or x in [205, 235]): casual[y, x] = [55, 32, 20, 255]

# Solid Cream/Beige Chinos (y: 560 to 915)
c_dark, c_light = (165, 155, 142), (235, 228, 218)
chinos = apply_shading(is_lower_body, lum_lower, c_dark, c_light)
for y, x in zip(*np.where(is_lower_body)):
    casual[y, x] = chinos[y, x]
    if abs(x - 174) <= 1 and y > 670: casual[y, x] = [135, 125, 115, 255]

# Shoes
for y, x in zip(*np.where(is_feet)):
    casual[y, x] = [38, 42, 52, 255]
    if y >= 950: casual[y, x] = [22, 25, 32, 255]

Image.fromarray(casual).save('portfolio/assets/avatar-priyam-casual.png')
print('Casual finalized!')

# ====================================================
# 2. CYBER TECHWEAR
# ====================================================
tech = arr_m.copy()
o_dark, o_light = (15, 18, 25), (42, 50, 68)
tech_torso = apply_shading(is_tshirt, lum_tshirt, o_dark, o_light)
for y, x in zip(*np.where(is_tshirt)): tech[y, x] = tech_torso[y, x]
for y, x in zip(*np.where(is_full_arms)): tech[y, x] = [28, 34, 46, 255]

# High Cowl Collar
for y in range(250, 320):
    for x in range(130, 218):
        if alpha[y, x]:
            tech[y, x] = [22, 26, 36, 255]
            if x % 8 in [0, 1]: tech[y, x] = [38, 45, 62, 255]

# Neon Cyan Zipper
for y in range(250, 560):
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

# Cargo Pants
cargo = apply_shading(is_lower_body, lum_lower, o_dark, o_light)
for y, x in zip(*np.where(is_lower_body)):
    tech[y, x] = cargo[y, x]
    if abs(x - 174) <= 1 and y > 670: tech[y, x] = [12, 14, 18, 255]
    if 750 <= y <= 760 and (110 <= x <= 135 or 213 <= x <= 238): tech[y, x] = [0, 240, 255, 255]

for y, x in zip(*np.where(is_feet)):
    tech[y, x] = [15, 18, 24, 255]
    if y in [930, 945]: tech[y, x] = [0, 240, 255, 255]

Image.fromarray(tech).save('portfolio/assets/avatar-priyam-techwear.png')
print('Techwear finalized!')

# ====================================================
# 3. CR7 REAL MADRID NO. 7
# ====================================================
cr7 = arr_m.copy()
w_dark, w_light = (210, 218, 228), (255, 255, 255)
white_torso = apply_shading(is_tshirt, lum_tshirt, w_dark, w_light)
for y, x in zip(*np.where(is_tshirt)): cr7[y, x] = white_torso[y, x]
for y, x in zip(*np.where(is_upper_arms)): cr7[y, x] = [245, 248, 252, 255]

# Shoulder 3-Stripes
for y in range(275, 340):
    for x in range(W):
        if is_tshirt[y, x] and ((80 < x < 125) or (223 < x < 268)) and (y % 6 in [0, 1]):
            cr7[y, x] = [230, 185, 25, 255]

# Crown Crest
for y in range(360, 390):
    for x in range(205, 228):
        if is_tshirt[y, x] and np.hypot(x - 216, y - 375) <= 11:
            cr7[y, x] = [235, 190, 30, 255]
            if y == 364: cr7[y, x] = [255, 220, 50, 255]

# Bold "7"
for y in range(410, 495):
    for x in range(152, 198):
        if is_tshirt[y, x]:
            is_top = (410 <= y <= 425) and (152 <= x <= 196)
            is_slash = abs((y - 410) - int((194 - x) * 2.1)) <= 4 and (x >= 158)
            if is_top or is_slash:
                cr7[y, x] = [15, 25, 55, 255]
                if is_top and y == 412: cr7[y, x] = [230, 185, 25, 255]

# Match Shorts
white_shorts = apply_shading(is_shorts, get_norm_lum(is_shorts), w_dark, w_light)
for y, x in zip(*np.where(is_shorts)):
    cr7[y, x] = white_shorts[y, x]
    if (x in [95, 253]): cr7[y, x] = [230, 185, 25, 255]

# Socks with gold bands
is_socks = is_skin & (np.arange(H)[:, None] >= 770) & (np.arange(H)[:, None] <= 915)
for y, x in zip(*np.where(is_socks)):
    cr7[y, x] = [245, 248, 252, 255]
    if y in [780, 788]: cr7[y, x] = [230, 185, 25, 255]

for y, x in zip(*np.where(is_feet)):
    cr7[y, x] = [20, 24, 32, 255]
    if y % 8 in [0, 1]: cr7[y, x] = [255, 255, 255, 255]

Image.fromarray(cr7).save('portfolio/assets/avatar-priyam-football.png')
print('CR7 finalized!')

# ====================================================
# 4. F1 SCUDERIA RACER
# ====================================================
f1 = arr_m.copy()
r_dark, r_light = (145, 15, 22), (235, 30, 38)
red_torso = apply_shading(is_tshirt, lum_tshirt, r_dark, r_light)
for y, x in zip(*np.where(is_tshirt)):
    dist_c = abs(x - 174)
    if dist_c > 52: f1[y, x] = [22, 22, 26, 255]
    else: f1[y, x] = red_torso[y, x]

for y in range(330, 560):
    for x in range(W):
        if is_skin[y, x] and (x <= 95 or x >= 250): f1[y, x] = [215, 25, 32, 255]

# Black Gloves
for y in range(560, 700):
    for x in range(W):
        if is_skin[y, x] and (x <= 95 or x >= 250): f1[y, x] = [20, 20, 24, 255]

# Sponsor stripe
for y in range(350, 370):
    for x in range(110, 238):
        if is_tshirt[y, x]: f1[y, x] = [252, 252, 255, 255]

# Ferrari Shield
for y in range(385, 415):
    for x in range(200, 225):
        if is_tshirt[y, x]:
            dc = abs(x - 212)
            if (y < 405 and dc <= 10) or (y >= 405 and dc <= (415 - y)):
                f1[y, x] = [255, 220, 0, 255]
                if dc <= 1 and 392 <= y <= 408: f1[y, x] = [15, 15, 15, 255]

# Race Pants
red_pants = apply_shading(is_lower_body, lum_lower, r_dark, r_light)
for y, x in zip(*np.where(is_lower_body)):
    f1[y, x] = red_pants[y, x]
    if abs(x - 174) <= 1 and y > 670: f1[y, x] = [20, 20, 24, 255]
    if (x in [95, 253]): f1[y, x] = [20, 20, 24, 255]

for y, x in zip(*np.where(is_feet)):
    f1[y, x] = [185, 20, 28, 255]
    if y >= 945: f1[y, x] = [20, 20, 24, 255]

Image.fromarray(f1).save('portfolio/assets/avatar-priyam-f1.png')
print('F1 finalized!')

# ====================================================
# 5. IRON MAN MARK 85
# ====================================================
iron = arr_m.copy()
c_dark, c_light = (130, 10, 16), (225, 25, 32)
crimson_torso = apply_shading(is_tshirt, lum_tshirt, c_dark, c_light)
g_dark, g_light = (165, 115, 10), (255, 215, 35)
gold_torso = apply_shading(is_tshirt, lum_tshirt, g_dark, g_light)

for y, x in zip(*np.where(is_tshirt)):
    dist_c = abs(x - 174)
    is_gold = (y < 350 and dist_c > 28) or (490 <= y <= 530 and dist_c < 45)
    if is_gold: iron[y, x] = gold_torso[y, x]
    else: iron[y, x] = crimson_torso[y, x]

for y in range(330, 700):
    for x in range(W):
        if is_skin[y, x] and (x <= 95 or x >= 250):
            if (420 <= y <= 470) or (620 <= y <= 660): iron[y, x] = [245, 195, 22, 255]
            else: iron[y, x] = [195, 22, 30, 255]

# Glowing Arc Reactor
for y in range(358, 402):
    for x in range(154, 194):
        if is_tshirt[y, x]:
            d = np.hypot(x - 174, y - 380)
            if d <= 7: iron[y, x] = [255, 255, 255, 255]
            elif d <= 13: iron[y, x] = [0, 240, 255, 255]
            elif d <= 17: iron[y, x] = [0, 140, 210, 255]

# Armored Greaves
crimson_legs = apply_shading(is_lower_body, lum_lower, c_dark, c_light)
for y, x in zip(*np.where(is_lower_body)):
    dist_c = abs(x - 174)
    if 720 <= y <= 770 and 18 < dist_c < 65: iron[y, x] = [245, 195, 22, 255]
    else: iron[y, x] = crimson_legs[y, x]

for y, x in zip(*np.where(is_feet)):
    iron[y, x] = [185, 20, 28, 255]
    if y >= 948: iron[y, x] = [245, 195, 22, 255]

Image.fromarray(iron).save('portfolio/assets/avatar-priyam-ironman.png')
print('Iron Man finalized!')

# ====================================================
# 6. SPIDER-MAN
# ====================================================
spidey = arr_m.copy()
r_dark, r_light = (140, 12, 20), (235, 30, 40)
red_torso = apply_shading(is_tshirt, lum_tshirt, r_dark, r_light)
b_dark, b_light = (12, 45, 140), (30, 95, 225)
blue_torso = apply_shading(is_tshirt, lum_tshirt, b_dark, b_light)

for y, x in zip(*np.where(is_tshirt)):
    dist_c = abs(x - 174)
    if dist_c > 48: spidey[y, x] = blue_torso[y, x]
    else:
        spidey[y, x] = red_torso[y, x]
        if (x % 14 in [0, 1]) or (y % 16 in [0, 1]): spidey[y, x] = [int(spidey[y, x, 0]*0.35), int(spidey[y, x, 1]*0.35), int(spidey[y, x, 2]*0.35), 255]

for y in range(330, 700):
    for x in range(W):
        if is_skin[y, x] and (x <= 95 or x >= 250):
            if y >= 530:
                spidey[y, x] = [215, 28, 38, 255]
                if (x % 14 in [0, 1]) or (y % 16 in [0, 1]): spidey[y, x] = [75, 10, 15, 255]
            else: spidey[y, x] = [22, 85, 215, 255]

# Center Spider
for y in range(380, 425):
    for x in range(160, 188):
        if is_tshirt[y, x]:
            if np.hypot(x - 174, y - 395) <= 5 or np.hypot(x - 174, y - 407) <= 6: spidey[y, x] = [15, 15, 20, 255]
            if (abs(x - 174) == int(abs(y - 395)*1.4) and 382 <= y <= 412) or (abs(x - 174) == int(abs(y - 404)*1.6) and 394 <= y <= 422):
                spidey[y, x] = [15, 15, 20, 255]

blue_pants = apply_shading(is_lower_body, lum_lower, b_dark, b_light)
for y, x in zip(*np.where(is_lower_body)):
    dist_c = abs(x - 174)
    if dist_c < 30 and y < 680:
        spidey[y, x] = [215, 28, 38, 255]
        if (x % 14 in [0, 1]) or (y % 16 in [0, 1]): spidey[y, x] = [75, 10, 15, 255]
    else:
        spidey[y, x] = blue_pants[y, x]
        if abs(x - 174) <= 1 and y > 670: spidey[y, x] = [8, 35, 110, 255]

for y, x in zip(*np.where(is_feet)):
    spidey[y, x] = [215, 28, 38, 255]
    if (x % 14 in [0, 1]) or (y % 16 in [0, 1]): spidey[y, x] = [75, 10, 15, 255]

Image.fromarray(spidey).save('portfolio/assets/avatar-priyam-spiderman.png')
print('Spider-Man finalized!')
