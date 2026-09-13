import numpy as np
from PIL import Image

# Load base character
base_img = Image.open('portfolio/assets/avatar-priyam-hd.png')
base = np.array(base_img)
H, W = base.shape[:2]
alpha_mask = base[:, :, 3] > 40

# Save exact Casual Founder look
base_img.save('portfolio/assets/avatar-priyam-casual.png')

# Anatomical Masks
# 1. Head / Face / Hair
is_head = (np.arange(H)[:, None] < 185) & alpha_mask
is_face_skin = is_head & (base[:, :, 0] > 160) & (base[:, :, 1] > 100) & (base[:, :, 2] > 70) & (base[:, :, 0] > base[:, :, 2] + 40)
is_hair = is_head & (~is_face_skin) & (np.arange(H)[:, None] < 155)

# 2. Torso (Whole shirt + sleeves + cuffs)
is_torso_region = (np.arange(H)[:, None] >= 180) & (np.arange(H)[:, None] <= 468) & alpha_mask
is_forearm_skin = (np.arange(H)[:, None] >= 370) & ((np.arange(W)[None, :] <= 65) | (np.arange(W)[None, :] >= 215)) & (base[:, :, 0] > 160)
is_neck_skin = (np.arange(H)[:, None] <= 218) & (np.arange(W)[None, :] >= 120) & (np.arange(W)[None, :] <= 165) & (base[:, :, 0] > 160)

# Full shirt (including rolled sleeves):
is_shirt_full = is_torso_region & (~is_forearm_skin) & (~is_neck_skin)

# Trousers / Legs:
is_legs = (np.arange(H)[:, None] > 465) & alpha_mask

# Luminance calculation (0.0 to 1.0)
def get_lum_map(mask):
    lum = (base[:, :, 0].astype(float)*0.299 + base[:, :, 1].astype(float)*0.587 + base[:, :, 2].astype(float)*0.114) / 255.0
    l_min = np.percentile(lum[mask], 5)
    l_max = np.percentile(lum[mask], 95)
    return np.clip((lum - l_min) / (l_max - l_min + 1e-5), 0.0, 1.0)

lum_shirt = get_lum_map(is_shirt_full)
lum_hair  = get_lum_map(is_hair)

# 5-step Ramp Shader for true 32-bit RPG pixel art
def shade_ramp(lum_map, mask, c_dark, c_shadow, c_mid, c_high, c_spec):
    out = np.zeros((H, W, 4), dtype=np.uint8)
    for y, x in zip(*np.where(mask)):
        l = lum_map[y, x]
        if l < 0.20:
            c = c_dark
        elif l < 0.45:
            # Interpolate dark to shadow
            t = (l - 0.20) / 0.25
            c = [int(c_dark[i] + t*(c_shadow[i]-c_dark[i])) for i in range(3)]
        elif l < 0.70:
            # Interpolate shadow to mid
            t = (l - 0.45) / 0.25
            c = [int(c_shadow[i] + t*(c_mid[i]-c_shadow[i])) for i in range(3)]
        elif l < 0.88:
            # Interpolate mid to high
            t = (l - 0.70) / 0.18
            c = [int(c_mid[i] + t*(c_high[i]-c_mid[i])) for i in range(3)]
        else:
            # Specular
            t = (l - 0.88) / 0.12
            c = [int(c_high[i] + t*(c_spec[i]-c_high[i])) for i in range(3)]
        out[y, x] = [c[0], c[1], c[2], 255]
    return out

# ==========================================
# 1. SUPER SAIYAN (Dramatic DBZ Spiky Hair + Orange & Navy Gi)
# ==========================================
def render_saiyan():
    res = base.copy()
    
    # 1. Draw Spiky Golden Hair
    # Clear old curly top
    for y in range(0, 140):
        for x in range(W):
            if is_hair[y, x]:
                res[y, x] = [0, 0, 0, 0]
                
    # Spiky Golden Silhouette builder:
    spiky_hair_mask = np.zeros((H, W), dtype=bool)
    
    # Center massive crown spike: peak at (141, 5)
    for y in range(5, 140):
        w_half = int((y - 5) * 0.42)
        spiky_hair_mask[y, max(0, 141 - w_half):min(W, 141 + w_half)] = True
        
    # Left sweeping main spike: peak at (80, 15)
    for y in range(15, 140):
        w_half = int((y - 15) * 0.45)
        spiky_hair_mask[y, max(0, 80 - w_half):min(W, 80 + w_half)] = True
        
    # Right sweeping main spike: peak at (202, 15)
    for y in range(15, 140):
        w_half = int((y - 15) * 0.45)
        spiky_hair_mask[y, max(0, 202 - w_half):min(W, 202 + w_half)] = True
        
    # Far left flare spike: peak at (35, 50)
    for y in range(50, 145):
        w_half = int((y - 50) * 0.5)
        spiky_hair_mask[y, max(0, 35 - int((y-50)*0.2)):min(W, 35 + w_half + 25)] = True
        
    # Far right flare spike: peak at (247, 50)
    for y in range(50, 145):
        w_half = int((y - 50) * 0.5)
        spiky_hair_mask[y, max(0, 247 - w_half - 25):min(W, 247 + int((y-50)*0.2))] = True
        
    # Forehead bangs: 2 sharp spikes pointing down towards eyebrows
    for y in range(80, 135):
        # Left bang: tip at (115, 135)
        w_b = int((135 - y) * 0.35)
        spiky_hair_mask[y, max(0, 115 - w_b):min(W, 115 + w_b)] = True
        # Right bang: tip at (167, 135)
        w_b = int((135 - y) * 0.35)
        spiky_hair_mask[y, max(0, 167 - w_b):min(W, 167 + w_b)] = True
        # Center small bang: tip at (141, 120)
        w_b = int((120 - y) * 0.28)
        if y < 120:
            spiky_hair_mask[y, max(0, 141 - w_b):min(W, 141 + w_b)] = True

    # Paint Spiky Golden Hair with rich 3D shading
    for y, x in zip(*np.where(spiky_hair_mask)):
        # Distance from nearest edge / center
        dx = abs(x - 141)
        dy = y
        # Procedural anime highlight
        shading = 0.5 + 0.3 * np.sin(x * 0.15) + 0.2 * np.cos(y * 0.1)
        if shading < 0.35:
            res[y, x] = [175, 115, 0, 255] # Dark Amber Outline
        elif shading < 0.60:
            res[y, x] = [235, 175, 5, 255] # Deep Gold
        elif shading < 0.85:
            res[y, x] = [255, 220, 30, 255] # Bright Lemon Gold
        else:
            res[y, x] = [255, 250, 160, 255] # Specular Highlight

    # Electric Cyan Pupils
    for y in range(112, 126):
        for x in range(92, 110):
            if base[y, x, 0] < 80: res[y, x] = [0, 240, 255, 255]
        for x in range(172, 190):
            if base[y, x, 0] < 80: res[y, x] = [0, 240, 255, 255]

    # 2. Orange Turtle Gi Body with Navy Undershirt
    # Orange Dogi Palette
    c_dark   = (175, 50, 0)
    c_shadow = (220, 80, 0)
    c_mid    = (255, 120, 5)
    c_high   = (255, 160, 35)
    c_spec   = (255, 195, 85)
    gi_shaded = shade_ramp(lum_shirt, is_shirt_full, c_dark, c_shadow, c_mid, c_high, c_spec)

    # Navy Blue Undershirt Palette
    u_dark   = (10, 18, 70)
    u_shadow = (18, 30, 115)
    u_mid    = (25, 45, 155)
    u_high   = (40, 75, 205)
    u_spec   = (80, 125, 245)
    navy_shaded = shade_ramp(lum_shirt, is_shirt_full, u_dark, u_shadow, u_mid, u_high, u_spec)

    # Composite Gi:
    for y, x in zip(*np.where(is_shirt_full)):
        dist_c = abs(x - 141)
        is_v_neck = (y < 265) and (dist_c < (y - 180) * 0.35 + 8)
        is_sash = (y >= 405 and y <= 448) # Navy sash belt
        
        # Sleeveless armhole cut: outer sleeves are bare skin!
        is_bare_arm = (dist_c > 65) and (y > 210) and (y < 365)
        
        if is_bare_arm:
            # Bare muscular arms with skin shading
            l = lum_shirt[y, x]
            res[y, x] = [int(197 + l*30), int(133 + l*35), int(90 + l*35), 255]
        elif is_v_neck or is_sash:
            res[y, x] = navy_shaded[y, x]
        else:
            res[y, x] = gi_shaded[y, x]

    # Blue Wristbands (y: 355 to 388)
    for y in range(355, 388):
        for x in range(W):
            if is_shirt_full[y, x] and (x < 65 or x > 215):
                res[y, x] = [20, 35, 135, 255]
                if y in [356, 387]:
                    res[y, x] = [245, 195, 0, 255] # Gold trim
                    
    Image.fromarray(res).save('portfolio/assets/avatar-priyam-saiyan.png')
    print('Masterpiece Saiyan generated!')

# ==========================================
# 2. SPIDER-MAN SUIT
# ==========================================
def render_spiderman():
    res = base.copy()
    
    # Spider-Man Lenses
    for y in range(104, 128):
        for x in range(78, 122):
            if abs(x - 100) < (y - 98) * 0.8 and y < 125:
                res[y, x] = [255, 255, 255, 255]
                if abs(x - 100) >= (y - 98) * 0.75 - 1 or y >= 123:
                    res[y, x] = [15, 15, 20, 255] # Black rim
        for x in range(160, 204):
            if abs(x - 182) < (y - 98) * 0.8 and y < 125:
                res[y, x] = [255, 255, 255, 255]
                if abs(x - 182) >= (y - 98) * 0.75 - 1 or y >= 123:
                    res[y, x] = [15, 15, 20, 255]

    # Scarlet Red Shading
    r_dark, r_shadow, r_mid, r_high, r_spec = (120, 10, 18), (175, 18, 28), (225, 28, 38), (255, 60, 70), (255, 120, 130)
    red_shaded = shade_ramp(lum_shirt, is_shirt_full, r_dark, r_shadow, r_mid, r_high, r_spec)
    
    # Royal Web Blue Shading
    b_dark, b_shadow, b_mid, b_high, b_spec = (8, 35, 110), (14, 55, 160), (22, 85, 215), (45, 125, 245), (110, 180, 255)
    blue_shaded = shade_ramp(lum_shirt, is_shirt_full, b_dark, b_shadow, b_mid, b_high, b_spec)

    for y, x in zip(*np.where(is_shirt_full)):
        dist_c = abs(x - 141)
        # Blue ribs and bicep sleeves
        is_blue = (dist_c > 38 and y > 225 and y < 355) or (dist_c > 52 and y >= 355)
        if is_blue:
            res[y, x] = blue_shaded[y, x]
        else:
            # Red chest & red gauntlets
            res[y, x] = red_shaded[y, x]
            # Web lattice grid
            if (x % 16 in [0, 1]) or (y % 18 in [0, 1]):
                res[y, x] = [int(res[y, x, 0]*0.35), int(res[y, x, 1]*0.35), int(res[y, x, 2]*0.35), 255]

    # Iconic Spider Emblem on Chest (y: 270 to 305)
    for y in range(270, 305):
        for x in range(128, 154):
            if is_shirt_full[y, x]:
                # Spider body
                if np.hypot(x - 141, y - 286) <= 5 or np.hypot(x - 141, y - 296) <= 6:
                    res[y, x] = [15, 15, 20, 255]
                # Legs
                if (abs(x - 141) == int(abs(y - 286)*1.5) and 272 <= y <= 300) or (abs(x - 141) == int(abs(y - 292)*1.8) and 280 <= y <= 304):
                    res[y, x] = [15, 15, 20, 255]

    Image.fromarray(res).save('portfolio/assets/avatar-priyam-spiderman.png')
    print('Masterpiece Spider-Man generated!')

# ==========================================
# 3. IRON MAN MARK 85
# ==========================================
def render_ironman():
    res = base.copy()
    
    # Crimson Metallic Armor Palette
    c_dark, c_shadow, c_mid, c_high, c_spec = (110, 8, 14), (160, 15, 24), (210, 24, 32), (245, 55, 65), (255, 130, 140)
    crimson_shaded = shade_ramp(lum_shirt, is_shirt_full, c_dark, c_shadow, c_mid, c_high, c_spec)

    # Gold Metallic Pauldrons & Gauntlets Palette
    g_dark, g_shadow, g_mid, g_high, g_spec = (140, 95, 5), (195, 145, 12), (245, 195, 22), (255, 225, 75), (255, 250, 175)
    gold_shaded = shade_ramp(lum_shirt, is_shirt_full, g_dark, g_shadow, g_mid, g_high, g_spec)

    for y, x in zip(*np.where(is_shirt_full)):
        dist_c = abs(x - 141)
        # Gold shoulder pauldrons & bicep bands
        is_gold_pauldron = (y < 235 and dist_c > 22)
        is_gold_gauntlet = (y >= 320 and y <= 355 and dist_c > 45)
        is_gold_ab = (y >= 365 and y <= 385 and dist_c < 35) or (y >= 395 and y <= 415 and dist_c < 30)

        if is_gold_pauldron or is_gold_gauntlet or is_gold_ab:
            res[y, x] = gold_shaded[y, x]
        else:
            res[y, x] = crimson_shaded[y, x]

    # Glowing Circular Arc Reactor (y: 260 to 290, x: 128 to 154)
    for y in range(258, 292):
        for x in range(126, 156):
            if is_shirt_full[y, x]:
                d = np.hypot(x - 141, y - 275)
                if d <= 7:
                    res[y, x] = [255, 255, 255, 255] # Pure white core
                elif d <= 12:
                    res[y, x] = [0, 240, 255, 255] # Glowing cyan
                elif d <= 15:
                    res[y, x] = [0, 140, 200, 255] # Outer housing

    Image.fromarray(res).save('portfolio/assets/avatar-priyam-ironman.png')
    print('Masterpiece Iron Man generated!')

# ==========================================
# 4. CYBER TECHWEAR
# ==========================================
def render_techwear():
    res = base.copy()
    
    # Obsidian Fabric Palette
    o_dark, o_shadow, o_mid, o_high, o_spec = (12, 14, 18), (18, 22, 30), (28, 34, 46), (45, 55, 75), (85, 105, 140)
    tech_shaded = shade_ramp(lum_shirt, is_shirt_full, o_dark, o_shadow, o_mid, o_high, o_spec)

    for y, x in zip(*np.where(is_shirt_full)):
        res[y, x] = tech_shaded[y, x]

    # High Ninja Snood Cowl Neck (y: 175 to 220, x: 105 to 177)
    for y in range(175, 222):
        for x in range(105, 177):
            if alpha_mask[y, x]:
                res[y, x] = [18, 22, 30, 255]
                if (x % 6 in [0, 1]):
                    res[y, x] = [32, 38, 52, 255]

    # Neon Cyan Central Waterproof Cyber Zipper (x: 139 to 143)
    for y in range(175, 465):
        for x in range(139, 144):
            if is_shirt_full[y, x] or (y < 222 and alpha_mask[y, x]):
                res[y, x] = [0, 240, 255, 255]
                if x == 141:
                    res[y, x] = [220, 255, 255, 255]

    # Tactical Harness Straps with Chrome Buckles
    for y in range(250, 265):
        for x in range(75, 207):
            if is_shirt_full[y, x] and abs(x - 141) > 10:
                res[y, x] = [60, 72, 95, 255]
    for y in range(252, 263):
        for x in range(132, 150):
            if is_shirt_full[y, x]:
                res[y, x] = [200, 215, 230, 255] # Chrome buckle

    Image.fromarray(res).save('portfolio/assets/avatar-priyam-techwear.png')
    print('Masterpiece Techwear generated!')

# ==========================================
# 5. CR7 REAL MADRID NO. 7
# ==========================================
def render_cr7():
    res = base.copy()
    
    # Crisp Athletic White Jersey Palette
    w_dark, w_shadow, w_mid, w_high, w_spec = (185, 192, 202), (215, 222, 232), (242, 246, 250), (255, 255, 255), (255, 255, 255)
    white_shaded = shade_ramp(lum_shirt, is_shirt_full, w_dark, w_shadow, w_mid, w_high, w_spec)

    for y, x in zip(*np.where(is_shirt_full)):
        res[y, x] = white_shaded[y, x]

    # Golden Madrid 3-Stripes on Shoulders
    for y in range(185, 235):
        for x in range(W):
            if is_shirt_full[y, x] and ((62 < x < 98) or (184 < x < 220)) and (y % 5 in [0, 1]):
                res[y, x] = [230, 185, 25, 255]

    # Golden Real Madrid Crest over Heart (Left chest: x 160 to 178, y 245 to 268)
    for y in range(245, 268):
        for x in range(160, 178):
            if is_shirt_full[y, x] and np.hypot(x - 169, y - 256) <= 9:
                res[y, x] = [235, 190, 30, 255]
                if y == 247:
                    res[y, x] = [255, 220, 50, 255] # Crown top

    # Bold CR7 Iconic "7" in Center Chest (x: 122 to 160, y: 285 to 365)
    for y in range(285, 365):
        for x in range(122, 162):
            if is_shirt_full[y, x]:
                is_top_bar = (285 <= y <= 298) and (122 <= x <= 160)
                is_slash = abs((y - 285) - int((158 - x) * 2.3)) <= 3 and (x >= 128)
                if is_top_bar or is_slash:
                    res[y, x] = [15, 25, 55, 255] # Deep Madrid Navy
                    if is_top_bar and y == 286:
                        res[y, x] = [230, 185, 25, 255] # Gold top trim

    Image.fromarray(res).save('portfolio/assets/avatar-priyam-football.png')
    print('Masterpiece CR7 generated!')

# ==========================================
# 6. F1 SCUDERIA RACER
# ==========================================
def render_f1():
    res = base.copy()
    
    # Rosso Corsa Red Racing Suit Palette
    r_dark, r_shadow, r_mid, r_high, r_spec = (130, 12, 18), (180, 18, 25), (225, 22, 30), (255, 55, 65), (255, 120, 130)
    red_shaded = shade_ramp(lum_shirt, is_shirt_full, r_dark, r_shadow, r_mid, r_high, r_spec)

    # Black Nomex Flanks & Collar Palette
    k_dark, k_shadow, k_mid, k_high, k_spec = (10, 10, 12), (18, 18, 22), (28, 28, 34), (45, 45, 55), (80, 80, 95)
    black_shaded = shade_ramp(lum_shirt, is_shirt_full, k_dark, k_shadow, k_mid, k_high, k_spec)

    for y, x in zip(*np.where(is_shirt_full)):
        dist_c = abs(x - 141)
        # Black racing side flanks
        if dist_c > 42:
            res[y, x] = black_shaded[y, x]
        else:
            res[y, x] = red_shaded[y, x]

    # White Chest Sponsor Bar (y: 238 to 254, x: 92 to 190)
    for y in range(238, 254):
        for x in range(92, 190):
            if is_shirt_full[y, x]:
                res[y, x] = [250, 252, 255, 255]

    # Ferrari Yellow Cavallino Shield Badge (x: 158 to 178, y: 268 to 292)
    for y in range(268, 292):
        for x in range(158, 178):
            if is_shirt_full[y, x]:
                d_c = abs(x - 168)
                if (y < 282 and d_c <= 8) or (y >= 282 and d_c <= (292 - y) * 0.8):
                    res[y, x] = [255, 220, 0, 255]
                    if d_c <= 1 and 272 <= y <= 286:
                        res[y, x] = [15, 15, 15, 255] # Black horse emblem

    Image.fromarray(res).save('portfolio/assets/avatar-priyam-f1.png')
    print('Masterpiece F1 generated!')

render_saiyan()
render_spiderman()
render_ironman()
render_techwear()
render_cr7()
render_f1()
print('ALL 6 MASTERPIECE PIXEL-ART COSTUMES RENDERED WITH AUTHENTIC SHADING!')
