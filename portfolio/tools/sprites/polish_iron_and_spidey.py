import numpy as np
from PIL import Image

f1_img = Image.open('portfolio/assets/avatar-priyam-f1.png').convert('RGBA')
f1_arr = np.array(f1_img)
TARGET_H, TARGET_W = f1_arr.shape[:2]
alpha = f1_arr[:, :, 3] > 0

# ----------------------------------------------------
# 1. PERFECT IRON MAN MARK 85
# ----------------------------------------------------
iron = f1_arr.copy()

# Remove the white sponsor bar & racing text completely (y: 200 to 255, x: 75 to 210)
for y in range(165, TARGET_H):
    for x in range(TARGET_W):
        if alpha[y, x]:
            dist_c = abs(x - 141)
            # Gold Shoulders & Collar (y: 170 to 240, dist_c > 18)
            is_gold = (170 <= y <= 235 and dist_c > 18) or (310 <= y <= 350 and dist_c > 45) or (400 <= y <= 425 and dist_c < 35)
            
            # Smooth anatomical lighting
            # Center chest is highlighted, edges shaded
            rad_c = np.hypot(x - 141, y - 280)
            lum = 0.5 + 0.35 * (1.0 - min(1.0, rad_c / 140.0))
            
            if is_gold:
                iron[y, x, 0] = np.clip(int(190 + lum * 65), 0, 255)
                iron[y, x, 1] = np.clip(int(140 + lum * 90), 0, 255)
                iron[y, x, 2] = np.clip(int(10 + lum * 45), 0, 255)
            else:
                # Hot Rod Crimson Metallic
                iron[y, x, 0] = np.clip(int(150 + lum * 85), 0, 255)
                iron[y, x, 1] = np.clip(int(12 + lum * 28), 0, 255)
                iron[y, x, 2] = np.clip(int(18 + lum * 32), 0, 255)

# Glowing Circular Arc Reactor (y: 242 to 272, x: 126 to 156)
for y in range(240, 274):
    for x in range(124, 158):
        if alpha[y, x]:
            d = np.hypot(x - 141, y - 257)
            if d <= 6:
                iron[y, x] = [255, 255, 255, 255] # White core
            elif d <= 11:
                iron[y, x] = [0, 240, 255, 255] # Bright cyan
            elif d <= 15:
                iron[y, x] = [0, 140, 210, 255] # Metallic blue rim

Image.fromarray(iron).save('portfolio/assets/avatar-priyam-ironman.png')
print('Iron Man polished!')

# ----------------------------------------------------
# 2. PERFECT SPIDER-MAN
# ----------------------------------------------------
spidey = f1_arr.copy()

for y in range(165, TARGET_H):
    for x in range(TARGET_W):
        if alpha[y, x]:
            dist_c = abs(x - 141)
            # Center chest, boots, & gauntlets: Scarlet Red
            is_red = (y < 460 and dist_c < 42) or (340 <= y <= 430 and dist_c > 45) or (y >= 490)
            
            rad_c = np.hypot(x - 141, y - 280)
            lum = 0.5 + 0.35 * (1.0 - min(1.0, rad_c / 140.0))
            
            if is_red:
                spidey[y, x, 0] = np.clip(int(175 + lum * 70), 0, 255)
                spidey[y, x, 1] = np.clip(int(15 + lum * 25), 0, 255)
                spidey[y, x, 2] = np.clip(int(22 + lum * 30), 0, 255)
                # Black web grid lines
                if (x % 14 in [0, 1]) or (y % 16 in [0, 1]):
                    spidey[y, x, 0] = int(spidey[y, x, 0] * 0.35)
                    spidey[y, x, 1] = int(spidey[y, x, 1] * 0.35)
                    spidey[y, x, 2] = int(spidey[y, x, 2] * 0.35)
            else:
                # Royal Blue Sides & Legs
                spidey[y, x, 0] = np.clip(int(10 + lum * 20), 0, 255)
                spidey[y, x, 1] = np.clip(int(50 + lum * 75), 0, 255)
                spidey[y, x, 2] = np.clip(int(170 + lum * 80), 0, 255)

# Center Spider Emblem (y: 255 to 290)
for y in range(255, 290):
    for x in range(130, 152):
        if alpha[y, x]:
            if np.hypot(x - 141, y - 270) <= 4 or np.hypot(x - 141, y - 280) <= 5:
                spidey[y, x] = [15, 15, 20, 255]
            if (abs(x - 141) == int(abs(y - 270)*1.4) and 258 <= y <= 285) or (abs(x - 141) == int(abs(y - 277)*1.6) and 268 <= y <= 290):
                spidey[y, x] = [15, 15, 20, 255]

Image.fromarray(spidey).save('portfolio/assets/avatar-priyam-spiderman.png')
print('Spider-Man polished!')
