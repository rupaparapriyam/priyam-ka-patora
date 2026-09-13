import numpy as np
from PIL import Image

f1_img = Image.open('portfolio/assets/avatar-priyam-f1.png').convert('RGBA')
base_suit = np.array(f1_img)
TARGET_H, TARGET_W = base_suit.shape[:2]
alpha_suit = base_suit[:, :, 3] > 0

# ====================================================
# 1. CLEAN IRON MAN MARK 85
# ====================================================
iron = base_suit.copy()

for y in range(140, TARGET_H):
    for x in range(TARGET_W):
        if alpha_suit[y, x]:
            dist_c = abs(x - 141)
            # Gold Shoulders & Bicep Pauldrons (y: 145 to 240, dist_c > 22)
            is_gold = (145 <= y <= 240 and dist_c > 22) or (385 <= y <= 415 and dist_c < 30) or (450 <= y <= 475 and 18 < dist_c < 48)
            
            # Smooth anatomical shading
            rad_c = np.hypot(x - 141, y - 275)
            lum = 0.5 + 0.35 * (1.0 - min(1.0, rad_c / 140.0))
            
            if is_gold:
                iron[y, x, 0] = np.clip(int(205 + lum * 45), 0, 255)
                iron[y, x, 1] = np.clip(int(155 + lum * 80), 0, 255)
                iron[y, x, 2] = np.clip(int(15 + lum * 40), 0, 255)
            else:
                # Hot Rod Crimson Metallic
                iron[y, x, 0] = np.clip(int(165 + lum * 75), 0, 255)
                iron[y, x, 1] = np.clip(int(12 + lum * 28), 0, 255)
                iron[y, x, 2] = np.clip(int(18 + lum * 32), 0, 255)

# Center Glowing Circular Arc Reactor (y: 235 to 265, x: 128 to 154)
for y in range(235, 266):
    for x in range(126, 156):
        if alpha_suit[y, x]:
            d = np.hypot(x - 141, y - 250)
            if d <= 6:
                iron[y, x] = [255, 255, 255, 255] # White core
            elif d <= 11:
                iron[y, x] = [0, 240, 255, 255] # Bright cyan
            elif d <= 14:
                iron[y, x] = [0, 140, 210, 255] # Metallic blue rim

Image.fromarray(iron).save('portfolio/assets/avatar-priyam-ironman.png')
print('Clean Iron Man saved!')

# ====================================================
# 2. CLEAN SPIDER-MAN
# ====================================================
spidey = base_suit.copy()

for y in range(140, TARGET_H):
    for x in range(TARGET_W):
        if alpha_suit[y, x]:
            dist_c = abs(x - 141)
            # Center chest & gauntlets: Scarlet Red
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

# Center Spider Emblem (y: 245 to 280)
for y in range(245, 280):
    for x in range(130, 152):
        if alpha_suit[y, x]:
            if np.hypot(x - 141, y - 260) <= 4 or np.hypot(x - 141, y - 270) <= 5:
                spidey[y, x] = [15, 15, 20, 255]
            if (abs(x - 141) == int(abs(y - 260)*1.4) and 248 <= y <= 275) or (abs(x - 141) == int(abs(y - 267)*1.6) and 258 <= y <= 280):
                spidey[y, x] = [15, 15, 20, 255]

Image.fromarray(spidey).save('portfolio/assets/avatar-priyam-spiderman.png')
print('Clean Spider-Man saved!')
