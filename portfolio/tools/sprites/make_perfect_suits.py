import numpy as np
from PIL import Image

# Load raw F1 JPG
raw_f1 = Image.open('/Users/priyamrupapara/.gemini/antigravity/brain/63bba458-c2ee-4b74-a116-d2cd7430cc84/priyam_f1_sprite_1788255355383.jpg').convert('RGBA')
arr_f1 = np.array(raw_f1)
H_raw, W_raw = arr_f1.shape[:2]

# Remove white background cleanly
white_bg = (arr_f1[:, :, 0] > 230) & (arr_f1[:, :, 1] > 230) & (arr_f1[:, :, 2] > 230)
# Also bottom 10% ground shadow
ground_mask = (np.arange(H_raw)[:, None] > H_raw * 0.88) & (arr_f1[:, :, 0] < 120) & (arr_f1[:, :, 1] < 120) & (arr_f1[:, :, 2] < 120)
arr_f1[white_bg | ground_mask, 3] = 0

# Crop bounding box
alpha = arr_f1[:, :, 3] > 0
ys, xs = np.where(alpha)
cropped = Image.fromarray(arr_f1[ys.min():ys.max()+1, xs.min():xs.max()+1])

# Scale to height 521
base_img = Image.open('portfolio/assets/avatar-priyam-hd.png')
TARGET_H = base_img.height # 521
TARGET_W = base_img.width  # 283
scale = TARGET_H / cropped.height
new_w = int(cropped.width * scale)
f1_scaled = cropped.resize((new_w, TARGET_H), Image.Resampling.NEAREST)

# Center in 283 x 521 canvas
canvas_f1 = Image.new('RGBA', (TARGET_W, TARGET_H), (0, 0, 0, 0))
paste_x = (TARGET_W - new_w) // 2
canvas_f1.paste(f1_scaled, (paste_x, 0), f1_scaled)

base_suit = np.array(canvas_f1)
alpha_suit = base_suit[:, :, 3] > 0

# Save F1
canvas_f1.save('portfolio/assets/avatar-priyam-f1.png')
print('F1 saved!')

# ====================================================
# 1. IRON MAN MARK 85
# ====================================================
iron = base_suit.copy()

# Torso & Arms (y >= 155 to feet)
for y in range(155, TARGET_H):
    for x in range(TARGET_W):
        if alpha_suit[y, x]:
            dist_c = abs(x - 141)
            # Gold Shoulders / Pauldrons / Biceps / Knees:
            is_gold = (165 <= y <= 245 and dist_c > 24) or (400 <= y <= 430 and dist_c < 32)
            
            # Shading factor from red channel of F1 suit
            # If it was the white stripe / sponsor box, replace with smooth chest luminance
            is_sponsor = (200 <= y <= 255 and dist_c < 55)
            if is_sponsor:
                rad_c = np.hypot(x - 141, y - 275)
                lum = 0.5 + 0.35 * (1.0 - min(1.0, rad_c / 140.0))
            else:
                lum = (int(base_suit[y, x, 0]) + int(base_suit[y, x, 1]) + int(base_suit[y, x, 2])) / 3.0 / 255.0
            
            if is_gold:
                iron[y, x, 0] = np.clip(int(205 + lum * 45), 0, 255)
                iron[y, x, 1] = np.clip(int(155 + lum * 80), 0, 255)
                iron[y, x, 2] = np.clip(int(15 + lum * 40), 0, 255)
            else:
                # Hot Rod Crimson Metallic
                iron[y, x, 0] = np.clip(int(165 + lum * 75), 0, 255)
                iron[y, x, 1] = np.clip(int(12 + lum * 28), 0, 255)
                iron[y, x, 2] = np.clip(int(18 + lum * 32), 0, 255)

# Center Glowing Circular Arc Reactor (y: 250 to 276, x: 128 to 154)
for y in range(248, 276):
    for x in range(128, 154):
        if alpha_suit[y, x]:
            d = np.hypot(x - 141, y - 262)
            if d <= 6:
                iron[y, x] = [255, 255, 255, 255] # White core
            elif d <= 11:
                iron[y, x] = [0, 240, 255, 255] # Bright cyan
            elif d <= 14:
                iron[y, x] = [0, 140, 210, 255] # Metallic blue rim

Image.fromarray(iron).save('portfolio/assets/avatar-priyam-ironman.png')
print('Iron Man saved!')

# ====================================================
# 2. SPIDER-MAN
# ====================================================
spidey = base_suit.copy()

for y in range(155, TARGET_H):
    for x in range(TARGET_W):
        if alpha_suit[y, x]:
            dist_c = abs(x - 141)
            # Center chest & gauntlets: Scarlet Red
            is_red = (y < 460 and dist_c < 42) or (340 <= y <= 430 and dist_c > 45) or (y >= 485)
            
            is_sponsor = (200 <= y <= 255 and dist_c < 55)
            if is_sponsor:
                rad_c = np.hypot(x - 141, y - 275)
                lum = 0.5 + 0.35 * (1.0 - min(1.0, rad_c / 140.0))
            else:
                lum = (int(base_suit[y, x, 0]) + int(base_suit[y, x, 1]) + int(base_suit[y, x, 2])) / 3.0 / 255.0
            
            if is_red:
                r = np.clip(int(185 + lum * 65), 0, 255)
                g = np.clip(int(15 + lum * 25), 0, 255)
                b = np.clip(int(22 + lum * 30), 0, 255)
                # Black web grid
                if (x % 14 in [0, 1]) or (y % 16 in [0, 1]):
                    r = int(r * 0.35)
                    g = int(g * 0.35)
                    b = int(b * 0.35)
                spidey[y, x] = [r, g, b, 255]
            else:
                # Royal Web Blue
                spidey[y, x] = [np.clip(int(10 + lum * 20), 0, 255), np.clip(int(55 + lum * 70), 0, 255), np.clip(int(175 + lum * 75), 0, 255), 255]

# Center Spider Emblem (y: 255 to 290)
for y in range(255, 290):
    for x in range(130, 152):
        if alpha_suit[y, x]:
            if np.hypot(x - 141, y - 270) <= 4 or np.hypot(x - 141, y - 280) <= 5:
                spidey[y, x] = [15, 15, 20, 255]
            if (abs(x - 141) == int(abs(y - 270)*1.4) and 258 <= y <= 285) or (abs(x - 141) == int(abs(y - 277)*1.6) and 268 <= y <= 290):
                spidey[y, x] = [15, 15, 20, 255]

Image.fromarray(spidey).save('portfolio/assets/avatar-priyam-spiderman.png')
print('Spider-Man saved!')
