import numpy as np
from PIL import Image, ImageDraw

# Load pristine base mannequin (348 x 962)
mannequin_img = Image.open('portfolio/assets/avatar-priyam-mannequin.png').convert('RGBA')
arr_m = np.array(mannequin_img)
H, W = arr_m.shape[:2] # 962 x 348
alpha = arr_m[:, :, 3] > 0

# Mask definitions based on anatomical coordinates:
# Head/Face/Hair
is_head = (np.arange(H)[:, None] < 280) & alpha
is_hair = is_head & (arr_m[:, :, 0] < 120) & (arr_m[:, :, 1] < 90) & (arr_m[:, :, 2] < 90)
is_skin = (arr_m[:, :, 0] > 140) & (arr_m[:, :, 1] > 80) & (arr_m[:, :, 2] > 50) & (arr_m[:, :, 0] > arr_m[:, :, 2] + 25) & alpha

# Body regions
# Neck
is_neck = is_skin & (np.arange(H)[:, None] >= 260) & (np.arange(H)[:, None] <= 330)
# Arms (Biceps & Forearms)
is_arms = is_skin & (np.arange(H)[:, None] > 330) & (np.arange(H)[:, None] < 700) & ((np.arange(W)[None, :] <= 95) | (np.arange(W)[None, :] >= 250))
# Torso (Shirt in mannequin: y 290 to 570, x 70 to 280)
is_torso_fabric = alpha & (np.arange(H)[:, None] >= 290) & (np.arange(H)[:, None] <= 570) & (np.arange(W)[None, :] > 60) & (np.arange(W)[None, :] < 290)
# Shorts in mannequin: y 560 to 710
is_shorts_fabric = alpha & (np.arange(H)[:, None] >= 560) & (np.arange(H)[:, None] <= 710)
# Legs (Thighs to Ankles)
is_legs_skin = is_skin & (np.arange(H)[:, None] > 680) & (np.arange(H)[:, None] <= 905)
# Feet
is_feet_skin = is_skin & (np.arange(H)[:, None] > 900)

# Luminance map for realistic 32-bit shading
def get_shading_map(mask):
    lum = (arr_m[:, :, 0].astype(float)*0.299 + arr_m[:, :, 1].astype(float)*0.587 + arr_m[:, :, 2].astype(float)*0.114) / 255.0
    vals = lum[mask]
    if len(vals) == 0: return np.zeros((H, W))
    l_min, l_max = np.percentile(vals, 5), np.percentile(vals, 95)
    return np.clip((lum - l_min) / (l_max - l_min + 1e-5), 0.0, 1.0)

lum_torso = get_shading_map(is_torso_fabric)
lum_shorts = get_shading_map(is_shorts_fabric)

# Color Ramp Painter
def paint_ramp(lum, mask, c_dark, c_shadow, c_mid, c_high, c_spec):
    out = np.zeros((H, W, 4), dtype=np.uint8)
    for y, x in zip(*np.where(mask)):
        l = lum[y, x]
        if l < 0.20:
            c = c_dark
        elif l < 0.45:
            t = (l - 0.20) / 0.25
            c = [int(c_dark[i] + t*(c_shadow[i]-c_dark[i])) for i in range(3)]
        elif l < 0.70:
            t = (l - 0.45) / 0.25
            c = [int(c_shadow[i] + t*(c_mid[i]-c_shadow[i])) for i in range(3)]
        elif l < 0.88:
            t = (l - 0.70) / 0.18
            c = [int(c_mid[i] + t*(c_high[i]-c_mid[i])) for i in range(3)]
        else:
            t = (l - 0.88) / 0.12
            c = [int(c_high[i] + t*(c_spec[i]-c_high[i])) for i in range(3)]
        out[y, x] = [c[0], c[1], c[2], 255]
    return out

# ====================================================
# 1. FOUNDER CASUAL (Mocha Brown Shirt + Beige Chinos + Loafers)
# ====================================================
def make_casual():
    res = arr_m.copy()
    
    # Brown Shirt Ramp
    c_dark, c_shadow, c_mid, c_high, c_spec = (75, 45, 32), (105, 68, 52), (138, 92, 70), (170, 120, 95), (205, 160, 135)
    brown_shirt = paint_ramp(lum_torso, is_torso_fabric, c_dark, c_shadow, c_mid, c_high, c_spec)
    
    # Apply Brown Shirt to Torso & Rolled Sleeves (y: 290 to 570)
    for y, x in zip(*np.where(is_torso_fabric)):
        res[y, x] = brown_shirt[y, x]
        
    # Rolled Sleeves covering upper arms (y: 330 to 450)
    for y in range(330, 450):
        for x in range(W):
            if is_arms[y, x]:
                res[y, x] = brown_shirt[min(569, y), min(289, max(61, x))]
                
    # Open Collar V at Neck (y: 290 to 350, x: 145 to 205)
    for y in range(290, 350):
        for x in range(145, 205):
            if is_torso_fabric[y, x] and abs(x - 174) < (350 - y) * 0.35:
                # Exposed skin at collar
                res[y, x] = [218, 148, 108, 255]
                
    # 3 Crisp White Shirt Buttons (y: 370, 430, 490, x: 174)
    for by in [370, 430, 490]:
        for dy in [-2, -1, 0, 1, 2]:
            for dx in [-2, -1, 0, 1, 2]:
                res[by + dy, 174 + dx] = [255, 255, 255, 255]
                
    # Beige / Cream Chinos (Waist y: 565 all the way to ankles y: 915)
    # Entire lower body:
    is_pants = (np.arange(H)[:, None] >= 565) & (np.arange(H)[:, None] <= 915) & alpha
    lum_pants = get_shading_map(is_pants)
    p_dark, p_shadow, p_mid, p_high, p_spec = (165, 155, 142), (195, 185, 170), (225, 218, 205), (242, 238, 230), (255, 255, 250)
    chinos = paint_ramp(lum_pants, is_pants, p_dark, p_shadow, p_mid, p_high, p_spec)
    for y, x in zip(*np.where(is_pants)):
        res[y, x] = chinos[y, x]
        # Inseam crease
        if abs(x - 174) <= 1 and y > 670:
            res[y, x] = [140, 130, 118, 255]
            
    # Dark Casual Loafers / Shoes (y: 915 to 961)
    is_shoes = (np.arange(H)[:, None] > 915) & alpha
    for y, x in zip(*np.where(is_shoes)):
        res[y, x] = [40, 45, 55, 255]
        if y >= 950:
            res[y, x] = [25, 28, 35, 255] # Dark sole
            
    Image.fromarray(res).save('portfolio/assets/avatar-priyam-casual.png')
    print('1. Founder Casual generated!')

# ====================================================
# 2. SUPER SAIYAN (True Spiky Golden Anime Hair + DBZ Gi)
# ====================================================
def make_saiyan():
    res = arr_m.copy()
    
    # 1. Clear original curly hair (y: 0 to 240)
    for y in range(0, 240):
        for x in range(W):
            if is_hair[y, x]:
                res[y, x] = [0, 0, 0, 0]
                
    # 2. Draw Full Bold Spiky Super Saiyan Hair Mass
    spikes_mask = np.zeros((H, W), dtype=bool)
    # Huge Center Crown Spike (peak at 174, 5)
    for y in range(5, 250):
        w_half = int((y - 5) * 0.42)
        spikes_mask[y, max(0, 174 - w_half):min(W, 174 + w_half)] = True
    # Left Sweeping Crown Spike (peak at 95, 20)
    for y in range(20, 250):
        w_half = int((y - 20) * 0.45)
        spikes_mask[y, max(0, 95 - w_half):min(W, 95 + w_half)] = True
    # Right Sweeping Crown Spike (peak at 253, 20)
    for y in range(20, 250):
        w_half = int((y - 20) * 0.45)
        spikes_mask[y, max(0, 253 - w_half):min(W, 253 + w_half)] = True
    # Far Left Outward Flare (peak at 35, 75)
    for y in range(75, 250):
        w_half = int((y - 75) * 0.5)
        spikes_mask[y, max(0, 35 - int((y-75)*0.2)):min(W, 35 + w_half + 35)] = True
    # Far Right Outward Flare (peak at 313, 75)
    for y in range(75, 250):
        w_half = int((y - 75) * 0.5)
        spikes_mask[y, max(0, 313 - w_half - 35):min(W, 313 + int((y-75)*0.2))] = True
        
    # Forehead bangs framing eyebrows
    for y in range(140, 230):
        wb = int((230 - y) * 0.35)
        spikes_mask[y, max(0, 140 - wb):min(W, 140 + wb)] = True
        spikes_mask[y, max(0, 208 - wb):min(W, 208 + wb)] = True
        if y < 210:
            spikes_mask[y, max(0, 174 - int((210-y)*0.25)):min(W, 174 + int((210-y)*0.25))] = True
            
    # Shade Golden Spikes with multi-tonal DBZ gradients
    for y, x in zip(*np.where(spikes_mask)):
        shading = 0.5 + 0.3 * np.sin(x * 0.12) + 0.2 * np.cos(y * 0.08)
        if shading < 0.35:
            res[y, x] = [185, 120, 0, 255] # Dark Amber Outline
        elif shading < 0.60:
            res[y, x] = [245, 185, 5, 255] # Deep Golden
        elif shading < 0.85:
            res[y, x] = [255, 225, 35, 255] # Bright Lemon Gold
        else:
            res[y, x] = [255, 255, 170, 255] # Specular Glow
            
    # Golden Eyebrows & Glowing Cyan Pupils
    for y in range(160, 180):
        for x in range(110, 150):
            if arr_m[y, x, 0] < 120: res[y, x] = [255, 215, 0, 255]
        for x in range(198, 238):
            if arr_m[y, x, 0] < 120: res[y, x] = [255, 215, 0, 255]
    for y in range(185, 205):
        for x in range(125, 145):
            if arr_m[y, x, 0] < 80: res[y, x] = [0, 245, 255, 255]
        for x in range(203, 223):
            if arr_m[y, x, 0] < 80: res[y, x] = [0, 245, 255, 255]

    # 3. DBZ Martial Arts Gi
    # Orange Dogi Ramp
    g_dark, g_shadow, g_mid, g_high, g_spec = (175, 50, 0), (220, 80, 0), (255, 120, 5), (255, 160, 35), (255, 195, 85)
    orange_gi = paint_ramp(lum_torso, is_torso_fabric, g_dark, g_shadow, g_mid, g_high, g_spec)
    
    # Navy Blue Undershirt & Sash Ramp
    u_dark, u_shadow, u_mid, u_high, u_spec = (10, 18, 70), (18, 30, 115), (25, 45, 155), (40, 75, 205), (80, 125, 245)
    navy_gi = paint_ramp(lum_torso, is_torso_fabric, u_dark, u_shadow, u_mid, u_high, u_spec)

    # Torso coverage
    for y, x in zip(*np.where(is_torso_fabric)):
        dist_c = abs(x - 174)
        is_v = (y < 390) and (dist_c < (y - 280) * 0.35 + 10)
        is_sash = (y >= 540 and y <= 585)
        if is_v or is_sash:
            res[y, x] = navy_gi[y, x]
        else:
            res[y, x] = orange_gi[y, x]

    # Blue Wristbands on Bare Arms (y: 500 to 555)
    for y in range(500, 555):
        for x in range(W):
            if is_arms[y, x]:
                res[y, x] = [22, 35, 130, 255]
                if y in [501, 554]: res[y, x] = [245, 195, 0, 255] # Gold band edge

    # Orange Trousers (y: 585 to 905)
    is_dogi_pants = (np.arange(H)[:, None] > 585) & (np.arange(H)[:, None] <= 905) & alpha
    lum_dogi_pants = get_shading_map(is_dogi_pants)
    dogi_pants = paint_ramp(lum_dogi_pants, is_dogi_pants, g_dark, g_shadow, g_mid, g_high, g_spec)
    for y, x in zip(*np.where(is_dogi_pants)):
        res[y, x] = dogi_pants[y, x]
        if abs(x - 174) <= 1 and y > 670:
            res[y, x] = [175, 50, 0, 255]

    # Navy Blue Martial Arts Boots with Red Laces (y: 905 to 961)
    is_boots = (np.arange(H)[:, None] > 905) & alpha
    for y, x in zip(*np.where(is_boots)):
        res[y, x] = [20, 32, 110, 255]
        if y in [920, 935, 950]:
            res[y, x] = [225, 25, 30, 255] # Red ropes

    Image.fromarray(res).save('portfolio/assets/avatar-priyam-saiyan.png')
    print('2. Super Saiyan generated!')

# ====================================================
# 3. CYBER TECHWEAR
# ====================================================
def make_techwear():
    res = arr_m.copy()
    
    # Obsidian Techwear Palette
    o_dark, o_shadow, o_mid, o_high, o_spec = (12, 14, 18), (18, 22, 30), (28, 34, 46), (45, 55, 75), (85, 105, 140)
    tech_torso = paint_ramp(lum_torso, is_torso_fabric, o_dark, o_shadow, o_mid, o_high, o_spec)
    
    # Full Torso & Full Sleeves (y: 290 to 570)
    for y, x in zip(*np.where(is_torso_fabric)):
        res[y, x] = tech_torso[y, x]
    for y in range(330, 600):
        for x in range(W):
            if is_arms[y, x]:
                res[y, x] = tech_torso[min(569, y), min(289, max(61, x))]

    # High Ninja Snood Cowl Neck (y: 250 to 330, x: 130 to 218)
    for y in range(250, 330):
        for x in range(130, 218):
            if alpha[y, x]:
                res[y, x] = [22, 26, 36, 255]
                if x % 8 in [0, 1]: res[y, x] = [38, 45, 62, 255]

    # Neon Cyan Central Cyber Zipper (x: 172 to 176, y: 250 to 570)
    for y in range(250, 570):
        for x in range(172, 177):
            if alpha[y, x]:
                res[y, x] = [0, 240, 255, 255]
                if x == 174: res[y, x] = [220, 255, 255, 255]

    # Tactical Harness Straps with Chrome Buckles
    for y in range(370, 390):
        for x in range(80, 268):
            if alpha[y, x] and abs(x - 174) > 15:
                res[y, x] = [60, 72, 95, 255]
    for y in range(372, 388):
        for x in range(164, 184):
            if alpha[y, x]: res[y, x] = [200, 215, 230, 255]

    # Tactical Dark Cargo Pants (y: 565 to 915)
    is_cargo = (np.arange(H)[:, None] >= 565) & (np.arange(H)[:, None] <= 915) & alpha
    lum_cargo = get_shading_map(is_cargo)
    cargo_pants = paint_ramp(lum_cargo, is_cargo, o_dark, o_shadow, o_mid, o_high, o_spec)
    for y, x in zip(*np.where(is_cargo)):
        res[y, x] = cargo_pants[y, x]
        if abs(x - 174) <= 1 and y > 670: res[y, x] = [12, 14, 18, 255]
        # Cyan pocket accent
        if (750 <= y <= 760 and (110 <= x <= 135 or 213 <= x <= 238)):
            res[y, x] = [0, 240, 255, 255]

    # High-Top Cyber Boots (y: 915 to 961)
    is_shoes = (np.arange(H)[:, None] > 915) & alpha
    for y, x in zip(*np.where(is_shoes)):
        res[y, x] = [15, 18, 24, 255]
        if y in [930, 945]: res[y, x] = [0, 240, 255, 255]

    Image.fromarray(res).save('portfolio/assets/avatar-priyam-techwear.png')
    print('3. Cyber Techwear generated!')

# ====================================================
# 4. CR7 REAL MADRID NO. 7
# ====================================================
def make_cr7():
    res = arr_m.copy()
    
    # Crisp Athletic White Jersey Palette
    w_dark, w_shadow, w_mid, w_high, w_spec = (185, 192, 202), (215, 222, 232), (242, 246, 250), (255, 255, 255), (255, 255, 255)
    white_jersey = paint_ramp(lum_torso, is_torso_fabric, w_dark, w_shadow, w_mid, w_high, w_spec)
    
    for y, x in zip(*np.where(is_torso_fabric)):
        res[y, x] = white_jersey[y, x]
    for y in range(330, 440):
        for x in range(W):
            if is_arms[y, x]:
                res[y, x] = white_jersey[min(569, y), min(289, max(61, x))]

    # Golden Madrid 3-Stripes on Shoulders (y: 290 to 350)
    for y in range(290, 350):
        for x in range(W):
            if is_torso_fabric[y, x] and ((80 < x < 125) or (223 < x < 268)) and (y % 6 in [0, 1]):
                res[y, x] = [230, 185, 25, 255]

    # Golden Real Madrid Crest over Heart (Left chest: x 205 to 228, y 360 to 390)
    for y in range(360, 390):
        for x in range(205, 228):
            if is_torso_fabric[y, x] and np.hypot(x - 216, y - 375) <= 11:
                res[y, x] = [235, 190, 30, 255]
                if y == 364: res[y, x] = [255, 220, 50, 255]

    # Bold CR7 Iconic "7" in Center Chest (x: 152 to 196, y: 410 to 495)
    for y in range(410, 495):
        for x in range(152, 198):
            if is_torso_fabric[y, x]:
                is_top = (410 <= y <= 425) and (152 <= x <= 196)
                is_slash = abs((y - 410) - int((194 - x) * 2.1)) <= 4 and (x >= 158)
                if is_top or is_slash:
                    res[y, x] = [15, 25, 55, 255] # Deep Madrid Navy
                    if is_top and y == 412: res[y, x] = [230, 185, 25, 255] # Gold trim

    # Athletic White Match Shorts (y: 565 to 705)
    is_match_shorts = (np.arange(H)[:, None] >= 565) & (np.arange(H)[:, None] <= 705) & alpha
    lum_match_shorts = get_shading_map(is_match_shorts)
    white_shorts = paint_ramp(lum_match_shorts, is_match_shorts, w_dark, w_shadow, w_mid, w_high, w_spec)
    for y, x in zip(*np.where(is_match_shorts)):
        res[y, x] = white_shorts[y, x]
        if (x in [95, 253]): res[y, x] = [230, 185, 25, 255] # Gold side stripe

    # White Socks & Black Cleats (Socks y: 770 to 915, Cleats y: 915 to 961)
    is_socks = (np.arange(H)[:, None] >= 770) & (np.arange(H)[:, None] <= 915) & alpha
    for y, x in zip(*np.where(is_socks)):
        res[y, x] = [245, 248, 252, 255]
        if y in [780, 788]: res[y, x] = [230, 185, 25, 255]

    is_cleats = (np.arange(H)[:, None] > 915) & alpha
    for y, x in zip(*np.where(is_cleats)):
        res[y, x] = [20, 24, 32, 255]
        if y % 8 in [0, 1]: res[y, x] = [255, 255, 255, 255]

    Image.fromarray(res).save('portfolio/assets/avatar-priyam-football.png')
    print('4. CR7 Real Madrid generated!')

# ====================================================
# 5. F1 SCUDERIA RACER
# ====================================================
def make_f1():
    res = arr_m.copy()
    
    # Rosso Corsa Red Palette
    r_dark, r_shadow, r_mid, r_high, r_spec = (130, 12, 18), (180, 18, 25), (225, 22, 30), (255, 55, 65), (255, 120, 130)
    red_suit = paint_ramp(lum_torso, is_torso_fabric, r_dark, r_shadow, r_mid, r_high, r_spec)
    k_dark, k_shadow, k_mid, k_high, k_spec = (10, 10, 12), (18, 18, 22), (28, 28, 34), (45, 45, 55), (80, 80, 95)
    black_suit = paint_ramp(lum_torso, is_torso_fabric, k_dark, k_shadow, k_mid, k_high, k_spec)

    # Torso & Sleeves
    for y, x in zip(*np.where(is_torso_fabric)):
        dist_c = abs(x - 174)
        if dist_c > 52:
            res[y, x] = black_suit[y, x]
        else:
            res[y, x] = red_suit[y, x]
    for y in range(330, 560):
        for x in range(W):
            if is_arms[y, x]:
                res[y, x] = red_suit[min(569, y), min(289, max(61, x))]

    # Black Racing Gloves (y: 560 to 700 on arms)
    for y in range(560, 700):
        for x in range(W):
            if is_arms[y, x]: res[y, x] = [20, 20, 24, 255]

    # White Chest Sponsor Bar (y: 350 to 370, x: 110 to 238)
    for y in range(350, 370):
        for x in range(110, 238):
            if is_torso_fabric[y, x]: res[y, x] = [252, 252, 255, 255]

    # Ferrari Yellow Cavallino Shield (Left chest: x 200 to 225, y 385 to 415)
    for y in range(385, 415):
        for x in range(200, 225):
            if is_torso_fabric[y, x]:
                dc = abs(x - 212)
                if (y < 405 and dc <= 10) or (y >= 405 and dc <= (415 - y)):
                    res[y, x] = [255, 220, 0, 255]
                    if dc <= 1 and 392 <= y <= 408: res[y, x] = [15, 15, 15, 255]

    # Red Race Pants (y: 565 to 915)
    is_race_pants = (np.arange(H)[:, None] >= 565) & (np.arange(H)[:, None] <= 915) & alpha
    lum_race_pants = get_shading_map(is_race_pants)
    race_pants = paint_ramp(lum_race_pants, is_race_pants, r_dark, r_shadow, r_mid, r_high, r_spec)
    for y, x in zip(*np.where(is_race_pants)):
        res[y, x] = race_pants[y, x]
        if abs(x - 174) <= 1 and y > 670: res[y, x] = [20, 20, 24, 255]
        if (x in [95, 253]): res[y, x] = [20, 20, 24, 255] # Black racing stripe

    # Red/Black Race Boots (y: 915 to 961)
    is_race_boots = (np.arange(H)[:, None] > 915) & alpha
    for y, x in zip(*np.where(is_race_boots)):
        res[y, x] = [185, 20, 28, 255]
        if y >= 945: res[y, x] = [20, 20, 24, 255]

    Image.fromarray(res).save('portfolio/assets/avatar-priyam-f1.png')
    print('5. F1 Scuderia generated!')

# ====================================================
# 6. IRON MAN MARK 85
# ====================================================
def make_ironman():
    res = arr_m.copy()
    
    c_dark, c_shadow, c_mid, c_high, c_spec = (110, 8, 14), (160, 15, 24), (210, 24, 32), (245, 55, 65), (255, 130, 140)
    crimson_armor = paint_ramp(lum_torso, is_torso_fabric, c_dark, c_shadow, c_mid, c_high, c_spec)
    
    g_dark, g_shadow, g_mid, g_high, g_spec = (140, 95, 5), (195, 145, 12), (245, 195, 22), (255, 225, 75), (255, 250, 175)
    gold_armor = paint_ramp(lum_torso, is_torso_fabric, g_dark, g_shadow, g_mid, g_high, g_spec)

    for y, x in zip(*np.where(is_torso_fabric)):
        dist_c = abs(x - 174)
        is_gold = (y < 350 and dist_c > 28) or (490 <= y <= 530 and dist_c < 45)
        if is_gold:
            res[y, x] = gold_armor[y, x]
        else:
            res[y, x] = crimson_armor[y, x]

    # Armored Gauntlet Sleeves (y: 330 to 700)
    for y in range(330, 700):
        for x in range(W):
            if is_arms[y, x]:
                if (420 <= y <= 470) or (620 <= y <= 660):
                    res[y, x] = [245, 195, 22, 255] # Gold plate
                else:
                    res[y, x] = [195, 22, 30, 255] # Crimson plate

    # Glowing Circular Arc Reactor (y: 360 to 400, x: 156 to 192)
    for y in range(358, 402):
        for x in range(154, 194):
            if is_torso_fabric[y, x]:
                d = np.hypot(x - 174, y - 380)
                if d <= 7:
                    res[y, x] = [255, 255, 255, 255] # Pure white core
                elif d <= 13:
                    res[y, x] = [0, 240, 255, 255] # Bright cyan
                elif d <= 17:
                    res[y, x] = [0, 140, 210, 255] # Outer metallic ring

    # Crimson Armored Greaves with Gold Knees (y: 565 to 915)
    is_armored_legs = (np.arange(H)[:, None] >= 565) & (np.arange(H)[:, None] <= 915) & alpha
    lum_armored_legs = get_shading_map(is_armored_legs)
    crimson_legs = paint_ramp(lum_armored_legs, is_armored_legs, c_dark, c_shadow, c_mid, c_high, c_spec)
    for y, x in zip(*np.where(is_armored_legs)):
        dist_c = abs(x - 174)
        if (720 <= y <= 770 and 18 < dist_c < 65):
            res[y, x] = [245, 195, 22, 255] # Gold knees
        else:
            res[y, x] = crimson_legs[y, x]

    # Armored Boots (y: 915 to 961)
    is_iron_boots = (np.arange(H)[:, None] > 915) & alpha
    for y, x in zip(*np.where(is_iron_boots)):
        res[y, x] = [185, 20, 28, 255]
        if y >= 948: res[y, x] = [245, 195, 22, 255]

    Image.fromarray(res).save('portfolio/assets/avatar-priyam-ironman.png')
    print('6. Iron Man Mark 85 generated!')

# ====================================================
# 7. SPIDER-MAN
# ====================================================
def make_spiderman():
    res = arr_m.copy()
    
    r_dark, r_shadow, r_mid, r_high, r_spec = (120, 10, 18), (175, 18, 28), (225, 28, 38), (255, 60, 70), (255, 120, 130)
    red_spidey = paint_ramp(lum_torso, is_torso_fabric, r_dark, r_shadow, r_mid, r_high, r_spec)
    b_dark, b_shadow, b_mid, b_high, b_spec = (8, 35, 110), (14, 55, 160), (22, 85, 215), (45, 125, 245), (110, 180, 255)
    blue_spidey = paint_ramp(lum_torso, is_torso_fabric, b_dark, b_shadow, b_mid, b_high, b_spec)

    for y, x in zip(*np.where(is_torso_fabric)):
        dist_c = abs(x - 174)
        if dist_c > 48:
            res[y, x] = blue_spidey[y, x]
        else:
            res[y, x] = red_spidey[y, x]
            if (x % 14 in [0, 1]) or (y % 16 in [0, 1]):
                res[y, x] = [int(res[y, x, 0]*0.35), int(res[y, x, 1]*0.35), int(res[y, x, 2]*0.35), 255]

    # Arms (Blue Sleeves with Red Web Gauntlets)
    for y in range(330, 700):
        for x in range(W):
            if is_arms[y, x]:
                if y >= 530:
                    res[y, x] = [215, 28, 38, 255]
                    if (x % 14 in [0, 1]) or (y % 16 in [0, 1]): res[y, x] = [75, 10, 15, 255]
                else:
                    res[y, x] = [22, 85, 215, 255]

    # Center Spider Emblem (y: 380 to 425)
    for y in range(380, 425):
        for x in range(160, 188):
            if is_torso_fabric[y, x]:
                if np.hypot(x - 174, y - 395) <= 5 or np.hypot(x - 174, y - 407) <= 6:
                    res[y, x] = [15, 15, 20, 255]
                if (abs(x - 174) == int(abs(y - 395)*1.4) and 382 <= y <= 412) or (abs(x - 174) == int(abs(y - 404)*1.6) and 394 <= y <= 422):
                    res[y, x] = [15, 15, 20, 255]

    # Spider-Man Blue Legs & Red Boots (y: 565 to 961)
    is_spidey_legs = (np.arange(H)[:, None] >= 565) & (np.arange(H)[:, None] <= 915) & alpha
    lum_spidey_legs = get_shading_map(is_spidey_legs)
    blue_legs = paint_ramp(lum_spidey_legs, is_spidey_legs, b_dark, b_shadow, b_mid, b_high, b_spec)
    for y, x in zip(*np.where(is_spidey_legs)):
        dist_c = abs(x - 174)
        if dist_c < 30 and y < 680:
            res[y, x] = [215, 28, 38, 255]
            if (x % 14 in [0, 1]) or (y % 16 in [0, 1]): res[y, x] = [75, 10, 15, 255]
        else:
            res[y, x] = blue_legs[y, x]
            if abs(x - 174) <= 1 and y > 670: res[y, x] = [8, 35, 110, 255]

    is_spidey_boots = (np.arange(H)[:, None] > 915) & alpha
    for y, x in zip(*np.where(is_spidey_boots)):
        res[y, x] = [215, 28, 38, 255]
        if (x % 14 in [0, 1]) or (y % 16 in [0, 1]): res[y, x] = [75, 10, 15, 255]

    Image.fromarray(res).save('portfolio/assets/avatar-priyam-spiderman.png')
    print('7. Spider-Man generated!')

make_casual()
make_saiyan()
make_techwear()
make_cr7()
make_f1()
make_ironman()
make_spiderman()
print('ALL 7 CHARACTERS BUILT MASTERFULLY ON THE OFFICIAL MANNEQUIN!')
