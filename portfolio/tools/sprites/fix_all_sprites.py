import numpy as np
from PIL import Image

# 1. Base HD (Founder Casual)
base_img = Image.open('portfolio/assets/avatar-priyam-hd.png').convert('RGBA')
TARGET_H = base_img.height # 521
TARGET_W = base_img.width  # 283
base_img.save('portfolio/assets/avatar-priyam-casual.png')

# Helper: Clean ground shadows & artifacts below feet
def clean_bottom_ground(arr):
    # Find lowest pixel of character's shoes (around y = 495 to 515)
    # Clear any messy semi-transparent or isolated dots below shoes
    for y in range(485, arr.shape[0]):
        for x in range(arr.shape[1]):
            # If it's a messy shadow / ground pixel
            if arr[y, x, 3] > 0:
                r, g, b = arr[y, x, 0], arr[y, x, 1], arr[y, x, 2]
                # If ground shadow or grass
                if (r < 110 and g < 110 and b < 130) or (g > r + 20 and g > b + 10) or (r > 220 and g > 220 and b > 220 and y > 500):
                    # Check if surrounded by empty space
                    if y > 505:
                        arr[y, x, 3] = 0
    return arr

# 2. Super Saiyan
saiyan_img = Image.open('portfolio/assets/avatar-priyam-saiyan.png').convert('RGBA')
saiyan_arr = clean_bottom_ground(np.array(saiyan_img))
Image.fromarray(saiyan_arr).save('portfolio/assets/avatar-priyam-saiyan.png')

# 3. Cyber Techwear
tech_img = Image.open('portfolio/assets/avatar-priyam-techwear.png').convert('RGBA')
tech_arr = clean_bottom_ground(np.array(tech_img))
# Clear the little blue dots at y > 495
tech_arr[495:, :, 3] = 0
Image.fromarray(tech_arr).save('portfolio/assets/avatar-priyam-techwear.png')

# 4. CR7 Real Madrid No. 7
cr7_img = Image.open('portfolio/assets/avatar-priyam-football.png').convert('RGBA')
cr7_arr = np.array(cr7_img)
# Clean grass at bottom (y > 490)
for y in range(485, TARGET_H):
    for x in range(TARGET_W):
        if cr7_arr[y, x, 3] > 0:
            r, g, b = cr7_arr[y, x, 0], cr7_arr[y, x, 1], cr7_arr[y, x, 2]
            # Grass green or ground white
            if (g > r + 15 and g > b) or (r > 210 and g > 210 and b > 210 and y > 492) or y > 505:
                cr7_arr[y, x, 3] = 0
Image.fromarray(cr7_arr).save('portfolio/assets/avatar-priyam-football.png')

# 5. F1 Scuderia Racing
f1_img = Image.open('portfolio/assets/avatar-priyam-f1.png').convert('RGBA')
f1_arr = np.array(f1_img)
f1_arr[505:, :, 3] = 0
Image.fromarray(f1_arr).save('portfolio/assets/avatar-priyam-f1.png')

# 6. Iron Man Mark 85
# Built from the high-res F1 jumpsuit structure:
iron_arr = f1_arr.copy()
alpha_f1 = iron_arr[:, :, 3] > 0

for y in range(165, TARGET_H):
    for x in range(TARGET_W):
        if alpha_f1[y, x]:
            dist_c = abs(x - 141)
            # Metallic Gold Shoulders, Pauldrons, Bicep Cuffs, Knees:
            is_gold = (175 <= y <= 240 and dist_c > 18) or (310 <= y <= 350 and dist_c > 45) or (400 <= y <= 430 and dist_c < 35) or (475 <= y <= 495 and 20 < dist_c < 55)
            
            lum = (int(f1_arr[y, x, 0]) + int(f1_arr[y, x, 1]) + int(f1_arr[y, x, 2])) / 3.0 / 255.0
            
            if is_gold:
                iron_arr[y, x, 0] = np.clip(int(215 + lum * 40), 0, 255)
                iron_arr[y, x, 1] = np.clip(int(170 + lum * 75), 0, 255)
                iron_arr[y, x, 2] = np.clip(int(15 + lum * 35), 0, 255)
            else:
                # Hot Rod Crimson Metallic
                iron_arr[y, x, 0] = np.clip(int(185 + lum * 55), 0, 255)
                iron_arr[y, x, 1] = np.clip(int(15 + lum * 30), 0, 255)
                iron_arr[y, x, 2] = np.clip(int(22 + lum * 35), 0, 255)

# Glowing Circular Arc Reactor (y: 250 to 276, x: 128 to 154)
for y in range(248, 276):
    for x in range(128, 154):
        if alpha_f1[y, x]:
            d = np.hypot(x - 141, y - 262)
            if d <= 6:
                iron_arr[y, x] = [255, 255, 255, 255] # White core
            elif d <= 11:
                iron_arr[y, x] = [0, 240, 255, 255] # Cyan energy
            elif d <= 14:
                iron_arr[y, x] = [0, 140, 200, 255] # Housing rim

Image.fromarray(iron_arr).save('portfolio/assets/avatar-priyam-ironman.png')
print('Iron Man saved!')

# 7. Spider-Man
# Built from the high-res F1/CR7 jumpsuit structure:
spidey_arr = f1_arr.copy()
alpha_sp = spidey_arr[:, :, 3] > 0

for y in range(165, TARGET_H):
    for x in range(TARGET_W):
        if alpha_sp[y, x]:
            dist_c = abs(x - 141)
            # Center chest & gauntlets: Scarlet Red
            is_red = (y < 460 and dist_c < 42) or (340 <= y <= 430 and dist_c > 45) or (460 <= y <= 505 and dist_c < 30)
            lum = (int(f1_arr[y, x, 0]) + int(f1_arr[y, x, 1]) + int(f1_arr[y, x, 2])) / 3.0 / 255.0
            
            if is_red:
                spidey_arr[y, x, 0] = np.clip(int(205 + lum * 50), 0, 255)
                spidey_arr[y, x, 1] = np.clip(int(18 + lum * 25), 0, 255)
                spidey_arr[y, x, 2] = np.clip(int(28 + lum * 30), 0, 255)
                # Black web grid lines
                if (x % 14 in [0, 1]) or (y % 16 in [0, 1]):
                    spidey_arr[y, x, 0] = int(spidey_arr[y, x, 0] * 0.35)
                    spidey_arr[y, x, 1] = int(spidey_arr[y, x, 1] * 0.35)
                    spidey_arr[y, x, 2] = int(spidey_arr[y, x, 2] * 0.35)
            else:
                # Royal Blue Sides & Legs
                spidey_arr[y, x, 0] = np.clip(int(12 + lum * 20), 0, 255)
                spidey_arr[y, x, 1] = np.clip(int(60 + lum * 65), 0, 255)
                spidey_arr[y, x, 2] = np.clip(int(190 + lum * 65), 0, 255)

# Spider Emblem in center (y: 255 to 290)
for y in range(255, 290):
    for x in range(130, 152):
        if alpha_sp[y, x]:
            if np.hypot(x - 141, y - 270) <= 4 or np.hypot(x - 141, y - 280) <= 5:
                spidey_arr[y, x] = [15, 15, 20, 255]
            if (abs(x - 141) == int(abs(y - 270)*1.4) and 258 <= y <= 285) or (abs(x - 141) == int(abs(y - 277)*1.6) and 268 <= y <= 290):
                spidey_arr[y, x] = [15, 15, 20, 255]

Image.fromarray(spidey_arr).save('portfolio/assets/avatar-priyam-spiderman.png')
print('Spider-Man saved!')
print('ALL 7 PIXEL ART SPRITES PERFECTLY FINALIZED!')
