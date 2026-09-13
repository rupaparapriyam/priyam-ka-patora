import numpy as np
from PIL import Image

f1_img = Image.open('portfolio/assets/avatar-priyam-f1.png').convert('RGBA')
f1_arr = np.array(f1_img)
TARGET_H, TARGET_W = f1_arr.shape[:2]

# Full solid torso alpha mask (fill all horizontal holes between x_min and x_max per row)
solid_mask = np.zeros((TARGET_H, TARGET_W), dtype=bool)
for y in range(165, 510):
    xs = np.where(f1_arr[y, :, 3] > 0)[0]
    if len(xs) > 0:
        solid_mask[y, xs.min():xs.max()+1] = True

# ----------------------------------------------------
# 1. IRON MAN MARK 85 (Pure solid metallic armor)
# ----------------------------------------------------
iron = f1_arr.copy()

for y in range(165, 510):
    for x in range(TARGET_W):
        if solid_mask[y, x]:
            dist_c = abs(x - 141)
            is_gold = (168 <= y <= 235 and dist_c > 18) or (310 <= y <= 350 and dist_c > 45) or (400 <= y <= 425 and dist_c < 35) or (470 <= y <= 495 and 20 < dist_c < 55)
            
            rad_c = np.hypot(x - 141, y - 275)
            lum = 0.5 + 0.35 * (1.0 - min(1.0, rad_c / 140.0))
            
            if is_gold:
                iron[y, x] = [np.clip(int(200 + lum * 55), 0, 255), np.clip(int(150 + lum * 80), 0, 255), np.clip(int(15 + lum * 40), 0, 255), 255]
            else:
                # Hot Rod Crimson Metallic
                iron[y, x] = [np.clip(int(165 + lum * 75), 0, 255), np.clip(int(12 + lum * 28), 0, 255), np.clip(int(18 + lum * 32), 0, 255), 255]

# Center Glowing Arc Reactor (y: 242 to 272, x: 126 to 156)
for y in range(240, 274):
    for x in range(124, 158):
        if solid_mask[y, x]:
            d = np.hypot(x - 141, y - 257)
            if d <= 6:
                iron[y, x] = [255, 255, 255, 255] # White core
            elif d <= 11:
                iron[y, x] = [0, 240, 255, 255] # Bright cyan
            elif d <= 15:
                iron[y, x] = [0, 140, 210, 255] # Housing rim

# Clean feet boots
iron[505:, :, 3] = 0
Image.fromarray(iron).save('portfolio/assets/avatar-priyam-ironman.png')
print('Iron Man sealed & saved!')

# ----------------------------------------------------
# 2. SPIDER-MAN (Pure solid red & blue web suit)
# ----------------------------------------------------
spidey = f1_arr.copy()

for y in range(165, 510):
    for x in range(TARGET_W):
        if solid_mask[y, x]:
            dist_c = abs(x - 141)
            is_red = (y < 460 and dist_c < 42) or (340 <= y <= 430 and dist_c > 45) or (y >= 485)
            rad_c = np.hypot(x - 141, y - 275)
            lum = 0.5 + 0.35 * (1.0 - min(1.0, rad_c / 140.0))
            
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
        if solid_mask[y, x]:
            if np.hypot(x - 141, y - 270) <= 4 or np.hypot(x - 141, y - 280) <= 5:
                spidey[y, x] = [15, 15, 20, 255]
            if (abs(x - 141) == int(abs(y - 270)*1.4) and 258 <= y <= 285) or (abs(x - 141) == int(abs(y - 277)*1.6) and 268 <= y <= 290):
                spidey[y, x] = [15, 15, 20, 255]

spidey[505:, :, 3] = 0
Image.fromarray(spidey).save('portfolio/assets/avatar-priyam-spiderman.png')
print('Spider-Man sealed & saved!')
