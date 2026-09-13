import numpy as np
from PIL import Image

# Load clean mannequin
m_img = Image.open('portfolio/assets/avatar-priyam-mannequin.png').convert('RGBA')
arr_m = np.array(m_img)
H, W = arr_m.shape[:2] # 962 x 348
alpha = arr_m[:, :, 3] > 0

# T-shirt mask in mannequin
is_tshirt = (arr_m[:, :, 0] > 180) & (arr_m[:, :, 1] > 180) & (arr_m[:, :, 2] > 180) & (np.arange(H)[:, None] >= 265) & (np.arange(H)[:, None] <= 560)
# Shorts mask
is_shorts = (arr_m[:, :, 0] > 180) & (arr_m[:, :, 1] > 180) & (arr_m[:, :, 2] > 180) & (np.arange(H)[:, None] > 560) & (np.arange(H)[:, None] <= 710)
# Skin mask
is_skin = (arr_m[:, :, 0] > 140) & (arr_m[:, :, 1] > 80) & (arr_m[:, :, 2] > 50) & (arr_m[:, :, 0] > arr_m[:, :, 2] + 25) & alpha
# Hair mask
is_hair = (np.arange(H)[:, None] < 260) & (arr_m[:, :, 0] < 120) & (arr_m[:, :, 1] < 95) & (arr_m[:, :, 2] < 95) & alpha

# Arm & leg sections:
is_arms = is_skin & (np.arange(H)[:, None] > 320) & (np.arange(H)[:, None] < 700) & ((np.arange(W)[None, :] <= 95) | (np.arange(W)[None, :] >= 250))
is_upper_arms = is_arms & (np.arange(H)[:, None] <= 450)
is_legs_skin = is_skin & (np.arange(H)[:, None] > 680) & (np.arange(H)[:, None] <= 910)
is_feet = alpha & (np.arange(H)[:, None] > 910)

# Normalized luminance of white cloth (0.0 to 1.0)
def get_norm_lum(mask):
    lum = (arr_m[:, :, 0].astype(float)*0.299 + arr_m[:, :, 1].astype(float)*0.587 + arr_m[:, :, 2].astype(float)*0.114) / 255.0
    vals = lum[mask]
    if len(vals) == 0: return np.zeros((H, W))
    min_v, max_v = np.min(vals), np.max(vals)
    return np.clip((lum - min_v) / (max_v - min_v + 1e-5), 0.0, 1.0)

lum_tshirt = get_norm_lum(is_tshirt)
lum_shorts = get_norm_lum(is_shorts)
lum_legs = get_norm_lum(is_legs_skin)

# Linear shade interpolator
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
# 1. FOUNDER CASUAL (Mocha Brown Shirt + Beige Chinos)
# ====================================================
def make_casual():
    res = arr_m.copy()
    
    # Brown shirt
    b_dark, b_light = (65, 38, 25), (145, 95, 70)
    brown_torso = apply_shading(is_tshirt, lum_tshirt, b_dark, b_light)
    for y, x in zip(*np.where(is_tshirt)):
        res[y, x] = brown_torso[y, x]
        
    # Rolled sleeves on upper arms
    for y in range(330, 445):
        for x in range(W):
            if is_upper_arms[y, x]:
                res[y, x] = [105, 68, 50, 255]
                if y in [440, 441, 442, 443, 444]:
                    res[y, x] = [80, 50, 36, 255] # Sleeve cuff fold
                    
    # Open collar V-neck at top (y: 265 to 330, x: 150 to 200)
    for y in range(265, 330):
        for x in range(150, 200):
            if is_tshirt[y, x] and abs(x - 174) < (330 - y) * 0.35:
                res[y, x] = [218, 148, 108, 255] # Exposed skin
                
    # 3 White Buttons (y: 360, 420, 480, x: 174)
    for by in [360, 420, 480]:
        for dy in [-2, -1, 0, 1, 2]:
            for dx in [-2, -1, 0, 1, 2]:
                res[by + dy, 174 + dx] = [255, 255, 255, 255]
                
    # Left Chest Pocket (x: 205 to 235, y: 380 to 435)
    for y in range(380, 436):
        for x in range(205, 236):
            if is_tshirt[y, x]:
                if y == 380 or y == 435 or x == 205 or x == 235:
                    res[y, x] = [55, 32, 20, 255]
                    
    # Cream / Beige Chinos (Shorts + Legs down to y: 915)
    c_dark, c_light = (165, 155, 142), (235, 228, 218)
    chinos_shorts = apply_shading(is_shorts, lum_shorts, c_dark, c_light)
    for y, x in zip(*np.where(is_shorts)):
        res[y, x] = chinos_shorts[y, x]
        
    chinos_legs = apply_shading(is_legs_skin, lum_legs, c_dark, c_light)
    for y, x in zip(*np.where(is_legs_skin)):
        res[y, x] = chinos_legs[y, x]
        if abs(x - 174) <= 1 and y > 670:
            res[y, x] = [135, 125, 115, 255]
            
    # Dark Casual Loafers (y: 915 to 961)
    for y, x in zip(*np.where(is_feet)):
        res[y, x] = [38, 42, 52, 255]
        if y >= 950: res[y, x] = [22, 25, 32, 255]
        
    Image.fromarray(res).save('portfolio/assets/avatar-priyam-casual.png')
    print('Casual saved!')

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
            res[y, x] = [185, 120, 0, 255]
        elif shading < 0.60:
            res[y, x] = [245, 185, 5, 255]
        elif shading < 0.85:
            res[y, x] = [255, 225, 35, 255]
        else:
            res[y, x] = [255, 255, 170, 255]
            
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

    # Orange Gi Body
    g_dark, g_light = (195, 60, 0), (255, 150, 20)
    orange_torso = apply_shading(is_tshirt, lum_tshirt, g_dark, g_light)
    for y, x in zip(*np.where(is_tshirt)):
        dist_c = abs(x - 174)
        is_v = (y < 390) and (dist_c < (y - 275) * 0.35 + 10)
        is_sash = (y >= 525 and y <= 560)
        if is_v or is_sash:
            res[y, x] = [20, 35, 130, 255] # Navy Blue Undershirt & Sash
        else:
            res[y, x] = orange_torso[y, x]

    # Blue Wristbands on Bare Arms (y: 500 to 555)
    for y in range(500, 555):
        for x in range(W):
            if is_arms[y, x]:
                res[y, x] = [20, 35, 130, 255]
                if y in [501, 554]: res[y, x] = [245, 195, 0, 255]

    # Orange Martial Arts Pants (Shorts + Legs y: 560 to 905)
    orange_shorts = apply_shading(is_shorts, lum_shorts, g_dark, g_light)
    for y, x in zip(*np.where(is_shorts)):
        if y < 580:
            res[y, x] = [20, 35, 130, 255] # Belt sash continuation
        else:
            res[y, x] = orange_shorts[y, x]
            
    orange_legs = apply_shading(is_legs_skin, lum_legs, g_dark, g_light)
    for y, x in zip(*np.where(is_legs_skin)):
        res[y, x] = orange_legs[y, x]
        if abs(x - 174) <= 1 and y > 670: res[y, x] = [170, 45, 0, 255]

    # Navy Blue Boots with Red Laces (y: 905 to 961)
    for y, x in zip(*np.where(is_feet)):
        res[y, x] = [20, 32, 110, 255]
        if y in [920, 935, 950]: res[y, x] = [225, 25, 30, 255]

    Image.fromarray(res).save('portfolio/assets/avatar-priyam-saiyan.png')
    print('Saiyan saved!')

# ====================================================
# 3. CYBER TECHWEAR
# ====================================================
def make_techwear():
    res = arr_m.copy()
    
    o_dark, o_light = (15, 18, 25), (42, 50, 68)
    tech_torso = apply_shading(is_tshirt, lum_tshirt, o_dark, o_light)
    for y, x in zip(*np.where(is_tshirt)):
        res[y, x] = tech_torso[y, x]
        
    # Full sleeves on arms
    for y in range(330, 600):
        for x in range(W):
            if is_arms[y, x]: res[y, x] = [28, 34, 46, 255]

    # High Ninja Snood Cowl Neck (y: 250 to 320, x: 130 to 218)
    for y in range(250, 320):
        for x in range(130, 218):
            if alpha[y, x]:
                res[y, x] = [22, 26, 36, 255]
                if x % 8 in [0, 1]: res[y, x] = [38, 45, 62, 255]

    # Neon Cyan Central Cyber Zipper (x: 172 to 176, y: 250 to 560)
    for y in range(250, 560):
        for x in range(172, 177):
            if alpha[y, x]:
                res[y, x] = [0, 240, 255, 255]
                if x == 174: res[y, x] = [220, 255, 255, 255]

    # Tactical Harness Straps with Chrome Buckles
    for y in range(370, 390):
        for x in range(80, 268):
            if alpha[y, x] and abs(x - 174) > 15: res[y, x] = [60, 72, 95, 255]
    for y in range(372, 388):
        for x in range(164, 184):
            if alpha[y, x]: res[y, x] = [200, 215, 230, 255]

    # Tactical Dark Cargo Pants (Shorts + Legs y: 560 to 915)
    tech_shorts = apply_shading(is_shorts, lum_shorts, o_dark, o_light)
    for y, x in zip(*np.where(is_shorts)): res[y, x] = tech_shorts[y, x]
    
    tech_legs = apply_shading(is_legs_skin, lum_legs, o_dark, o_light)
    for y, x in zip(*np.where(is_legs_skin)):
        res[y, x] = tech_legs[y, x]
        if abs(x - 174) <= 1 and y > 670: res[y, x] = [12, 14, 18, 255]
        if (750 <= y <= 760 and (110 <= x <= 135 or 213 <= x <= 238)):
            res[y, x] = [0, 240, 255, 255]

    # Cyber Boots (y: 915 to 961)
    for y, x in zip(*np.where(is_feet)):
        res[y, x] = [15, 18, 24, 255]
        if y in [930, 945]: res[y, x] = [0, 240, 255, 255]

    Image.fromarray(res).save('portfolio/assets/avatar-priyam-techwear.png')
    print('Techwear saved!')

# ====================================================
# 4. CR7 REAL MADRID NO. 7
# ====================================================
def make_cr7():
    res = arr_m.copy()
    
    # White Jersey
    w_dark, w_light = (210, 218, 228), (255, 255, 255)
    white_torso = apply_shading(is_tshirt, lum_tshirt, w_dark, w_light)
    for y, x in zip(*np.where(is_tshirt)): res[y, x] = white_torso[y, x]
    for y in range(330, 440):
        for x in range(W):
            if is_arms[y, x]: res[y, x] = [245, 248, 252, 255]

    # Golden Madrid 3-Stripes on Shoulders
    for y in range(275, 340):
        for x in range(W):
            if is_tshirt[y, x] and ((80 < x < 125) or (223 < x < 268)) and (y % 6 in [0, 1]):
                res[y, x] = [230, 185, 25, 255]

    # Golden Crown Crest over Heart (Left chest: x 205 to 228, y 360 to 390)
    for y in range(360, 390):
        for x in range(205, 228):
            if is_tshirt[y, x] and np.hypot(x - 216, y - 375) <= 11:
                res[y, x] = [235, 190, 30, 255]
                if y == 364: res[y, x] = [255, 220, 50, 255]

    # Bold CR7 "7" on Chest (x: 152 to 196, y: 410 to 495)
    for y in range(410, 495):
        for x in range(152, 198):
            if is_tshirt[y, x]:
                is_top = (410 <= y <= 425) and (152 <= x <= 196)
                is_slash = abs((y - 410) - int((194 - x) * 2.1)) <= 4 and (x >= 158)
                if is_top or is_slash:
                    res[y, x] = [15, 25, 55, 255]
                    if is_top and y == 412: res[y, x] = [230, 185, 25, 255]

    # Match Shorts
    white_shorts = apply_shading(is_shorts, lum_shorts, w_dark, w_light)
    for y, x in zip(*np.where(is_shorts)):
        res[y, x] = white_shorts[y, x]
        if (x in [95, 253]): res[y, x] = [230, 185, 25, 255]

    # White Socks with Gold Bands (y: 770 to 915)
    for y in range(770, 915):
        for x in range(W):
            if is_legs_skin[y, x]:
                res[y, x] = [245, 248, 252, 255]
                if y in [780, 788]: res[y, x] = [230, 185, 25, 255]

    # Black Cleats (y: 915 to 961)
    for y, x in zip(*np.where(is_feet)):
        res[y, x] = [20, 24, 32, 255]
        if y % 8 in [0, 1]: res[y, x] = [255, 255, 255, 255]

    Image.fromarray(res).save('portfolio/assets/avatar-priyam-football.png')
    print('CR7 saved!')

# ====================================================
# 5. F1 SCUDERIA RACER
# ====================================================
def make_f1():
    res = arr_m.copy()
    
    r_dark, r_light = (145, 15, 22), (235, 30, 38)
    red_torso = apply_shading(is_tshirt, lum_tshirt, r_dark, r_light)
    for y, x in zip(*np.where(is_tshirt)):
        dist_c = abs(x - 174)
        if dist_c > 52:
            res[y, x] = [22, 22, 26, 255] # Black side panels
        else:
            res[y, x] = red_torso[y, x]
            
    for y in range(330, 560):
        for x in range(W):
            if is_arms[y, x]: res[y, x] = [215, 25, 32, 255]

    # Black Racing Gloves
    for y in range(560, 700):
        for x in range(W):
            if is_arms[y, x]: res[y, x] = [20, 20, 24, 255]

    # White Chest Sponsor Bar (y: 350 to 370, x: 110 to 238)
    for y in range(350, 370):
        for x in range(110, 238):
            if is_tshirt[y, x]: res[y, x] = [252, 252, 255, 255]

    # Ferrari Yellow Cavallino Shield (Left chest: x 200 to 225, y 385 to 415)
    for y in range(385, 415):
        for x in range(200, 225):
            if is_tshirt[y, x]:
                dc = abs(x - 212)
                if (y < 405 and dc <= 10) or (y >= 405 and dc <= (415 - y)):
                    res[y, x] = [255, 220, 0, 255]
                    if dc <= 1 and 392 <= y <= 408: res[y, x] = [15, 15, 15, 255]

    # Red Race Pants (Shorts + Legs y: 560 to 915)
    red_shorts = apply_shading(is_shorts, lum_shorts, r_dark, r_light)
    for y, x in zip(*np.where(is_shorts)):
        res[y, x] = red_shorts[y, x]
        if (x in [95, 253]): res[y, x] = [20, 20, 24, 255]
        
    red_legs = apply_shading(is_legs_skin, lum_legs, r_dark, r_light)
    for y, x in zip(*np.where(is_legs_skin)):
        res[y, x] = red_legs[y, x]
        if abs(x - 174) <= 1 and y > 670: res[y, x] = [20, 20, 24, 255]
        if (x in [95, 253]): res[y, x] = [20, 20, 24, 255]

    # Race Boots (y: 915 to 961)
    for y, x in zip(*np.where(is_feet)):
        res[y, x] = [185, 20, 28, 255]
        if y >= 945: res[y, x] = [20, 20, 24, 255]

    Image.fromarray(res).save('portfolio/assets/avatar-priyam-f1.png')
    print('F1 saved!')

# ====================================================
# 6. IRON MAN MARK 85
# ====================================================
def make_ironman():
    res = arr_m.copy()
    
    c_dark, c_light = (130, 10, 16), (225, 25, 32)
    crimson_torso = apply_shading(is_tshirt, lum_tshirt, c_dark, c_light)
    g_dark, g_light = (165, 115, 10), (255, 215, 35)
    gold_torso = apply_shading(is_tshirt, lum_tshirt, g_dark, g_light)

    for y, x in zip(*np.where(is_tshirt)):
        dist_c = abs(x - 174)
        is_gold = (y < 350 and dist_c > 28) or (490 <= y <= 530 and dist_c < 45)
        if is_gold:
            res[y, x] = gold_torso[y, x]
        else:
            res[y, x] = crimson_torso[y, x]

    # Armored Gauntlet Sleeves (y: 330 to 700)
    for y in range(330, 700):
        for x in range(W):
            if is_arms[y, x]:
                if (420 <= y <= 470) or (620 <= y <= 660):
                    res[y, x] = [245, 195, 22, 255]
                else:
                    res[y, x] = [195, 22, 30, 255]

    # Glowing Circular Arc Reactor (y: 360 to 400, x: 156 to 192)
    for y in range(358, 402):
        for x in range(154, 194):
            if is_tshirt[y, x]:
                d = np.hypot(x - 174, y - 380)
                if d <= 7:
                    res[y, x] = [255, 255, 255, 255]
                elif d <= 13:
                    res[y, x] = [0, 240, 255, 255]
                elif d <= 17:
                    res[y, x] = [0, 140, 210, 255]

    # Crimson Armored Legs (Shorts + Legs y: 560 to 915)
    crimson_shorts = apply_shading(is_shorts, lum_shorts, c_dark, c_light)
    for y, x in zip(*np.where(is_shorts)): res[y, x] = crimson_shorts[y, x]
    
    crimson_legs = apply_shading(is_legs_skin, lum_legs, c_dark, c_light)
    for y, x in zip(*np.where(is_legs_skin)):
        dist_c = abs(x - 174)
        if (720 <= y <= 770 and 18 < dist_c < 65):
            res[y, x] = [245, 195, 22, 255] # Gold knees
        else:
            res[y, x] = crimson_legs[y, x]

    # Iron Boots (y: 915 to 961)
    for y, x in zip(*np.where(is_feet)):
        res[y, x] = [185, 20, 28, 255]
        if y >= 948: res[y, x] = [245, 195, 22, 255]

    Image.fromarray(res).save('portfolio/assets/avatar-priyam-ironman.png')
    print('Iron Man saved!')

# ====================================================
# 7. SPIDER-MAN
# ====================================================
def make_spiderman():
    res = arr_m.copy()
    
    r_dark, r_light = (140, 12, 20), (235, 30, 40)
    red_torso = apply_shading(is_tshirt, lum_tshirt, r_dark, r_light)
    b_dark, b_light = (12, 45, 140), (30, 95, 225)
    blue_torso = apply_shading(is_tshirt, lum_tshirt, b_dark, b_light)

    for y, x in zip(*np.where(is_tshirt)):
        dist_c = abs(x - 174)
        if dist_c > 48:
            res[y, x] = blue_torso[y, x]
        else:
            res[y, x] = red_torso[y, x]
            if (x % 14 in [0, 1]) or (y % 16 in [0, 1]):
                res[y, x] = [int(res[y, x, 0]*0.35), int(res[y, x, 1]*0.35), int(res[y, x, 2]*0.35), 255]

    # Blue Sleeves with Red Web Gauntlets
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
            if is_tshirt[y, x]:
                if np.hypot(x - 174, y - 395) <= 5 or np.hypot(x - 174, y - 407) <= 6:
                    res[y, x] = [15, 15, 20, 255]
                if (abs(x - 174) == int(abs(y - 395)*1.4) and 382 <= y <= 412) or (abs(x - 174) == int(abs(y - 404)*1.6) and 394 <= y <= 422):
                    res[y, x] = [15, 15, 20, 255]

    # Blue Legs with Red Inserts & Boots (y: 560 to 961)
    blue_shorts = apply_shading(is_shorts, lum_shorts, b_dark, b_light)
    for y, x in zip(*np.where(is_shorts)):
        dist_c = abs(x - 174)
        if dist_c < 30:
            res[y, x] = [215, 28, 38, 255]
            if (x % 14 in [0, 1]) or (y % 16 in [0, 1]): res[y, x] = [75, 10, 15, 255]
        else:
            res[y, x] = blue_shorts[y, x]
            
    blue_legs = apply_shading(is_legs_skin, lum_legs, b_dark, b_light)
    for y, x in zip(*np.where(is_legs_skin)):
        dist_c = abs(x - 174)
        if dist_c < 30 and y < 680:
            res[y, x] = [215, 28, 38, 255]
            if (x % 14 in [0, 1]) or (y % 16 in [0, 1]): res[y, x] = [75, 10, 15, 255]
        else:
            res[y, x] = blue_legs[y, x]
            if abs(x - 174) <= 1 and y > 670: res[y, x] = [8, 35, 110, 255]

    for y, x in zip(*np.where(is_feet)):
        res[y, x] = [215, 28, 38, 255]
        if (x % 14 in [0, 1]) or (y % 16 in [0, 1]): res[y, x] = [75, 10, 15, 255]

    Image.fromarray(res).save('portfolio/assets/avatar-priyam-spiderman.png')
    print('Spider-Man saved!')

make_casual()
make_saiyan()
make_techwear()
make_cr7()
make_f1()
make_ironman()
make_spiderman()
print('ALL 7 HEROES MASTERFULLY CRAFTED ON BASE MANNEQUIN!')
