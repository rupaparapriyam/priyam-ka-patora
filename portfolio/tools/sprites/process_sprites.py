import numpy as np
from PIL import Image

base_img = Image.open('portfolio/assets/avatar-priyam-hd.png')
TARGET_H = base_img.height # 521
TARGET_W = base_img.width  # 283

def process_raw_jpg(jpg_path, out_png_path):
    img = Image.open(jpg_path).convert('RGBA')
    arr = np.array(img)
    
    # Background removal: white pixels or shadow under feet
    is_white = (arr[:, :, 0] > 235) & (arr[:, :, 1] > 235) & (arr[:, :, 2] > 235)
    # Also clean ground shadows at bottom
    # Bottom 15% shadow pixels:
    H_raw = arr.shape[0]
    is_ground = (np.arange(H_raw)[:, None] > H_raw * 0.88) & (arr[:, :, 0] < 120) & (arr[:, :, 1] < 120) & (arr[:, :, 2] < 140)
    
    arr[is_white | is_ground, 3] = 0
    
    # Bounding box of character
    alpha = arr[:, :, 3] > 0
    ys, xs = np.where(alpha)
    crop_arr = arr[ys.min():ys.max()+1, xs.min():xs.max()+1]
    cropped = Image.fromarray(crop_arr)
    
    # Scale to match height
    scale = TARGET_H / cropped.height
    new_w = int(cropped.width * scale)
    resized = cropped.resize((new_w, TARGET_H), Image.Resampling.NEAREST)
    
    # Center on canvas
    canvas = Image.new('RGBA', (TARGET_W, TARGET_H), (0, 0, 0, 0))
    paste_x = (TARGET_W - new_w) // 2
    canvas.paste(resized, (paste_x, 0), resized)
    canvas.save(out_png_path)
    print(f'Processed {out_png_path}')

# 1. Techwear
process_raw_jpg('/Users/priyamrupapara/.gemini/antigravity/brain/63bba458-c2ee-4b74-a116-d2cd7430cc84/priyam_techwear_sprite_1788255161567.jpg', 'portfolio/assets/avatar-priyam-techwear.png')

# 2. CR7 Football
process_raw_jpg('/Users/priyamrupapara/.gemini/antigravity/brain/63bba458-c2ee-4b74-a116-d2cd7430cc84/priyam_cr7_sprite_1788255183801.jpg', 'portfolio/assets/avatar-priyam-football.png')

# 3. F1 Scuderia
process_raw_jpg('/Users/priyamrupapara/.gemini/antigravity/brain/63bba458-c2ee-4b74-a116-d2cd7430cc84/priyam_f1_sprite_1788255355383.jpg', 'portfolio/assets/avatar-priyam-f1.png')

# 4. Iron Man Mark 85 (Built from the high-res F1 suit geometry with Hot Rod Crimson, Gold Pauldrons, and Arc Reactor)
f1_img = Image.open('portfolio/assets/avatar-priyam-f1.png')
f1_arr = np.array(f1_img)
iron_arr = f1_arr.copy()
alpha = iron_arr[:, :, 3] > 0

# Metallic Gold Shoulders, Collar, and Bicep Bands:
for y in range(180, 240):
    for x in range(TARGET_W):
        if alpha[y, x] and abs(x - 141) > 20 and (iron_arr[y, x, 0] > 140 or iron_arr[y, x, 0] < 50):
            lum = (int(iron_arr[y, x, 0]) + int(iron_arr[y, x, 1]) + int(iron_arr[y, x, 2])) / 3.0 / 255.0
            iron_arr[y, x, 0] = np.clip(int(215 + lum * 40), 0, 255)
            iron_arr[y, x, 1] = np.clip(int(165 + lum * 75), 0, 255)
            iron_arr[y, x, 2] = np.clip(int(15 + lum * 35), 0, 255)

# Glowing Circular Arc Reactor in Center Chest (x: 130 to 152, y: 250 to 275)
for y in range(248, 276):
    for x in range(128, 154):
        if alpha[y, x]:
            d = np.hypot(x - 141, y - 262)
            if d <= 6:
                iron_arr[y, x] = [255, 255, 255, 255] # White core
            elif d <= 11:
                iron_arr[y, x] = [0, 240, 255, 255] # Cyan energy
            elif d <= 14:
                iron_arr[y, x] = [0, 140, 200, 255] # Housing rim

Image.fromarray(iron_arr).save('portfolio/assets/avatar-priyam-ironman.png')
print('Processed portfolio/assets/avatar-priyam-ironman.png')

# 5. Spider-Man (Built from the high-res athletic suit with Scarlet Red, Royal Blue, Webbing & Spider)
cr7_img = Image.open('portfolio/assets/avatar-priyam-football.png')
cr7_arr = np.array(cr7_img)
spidey_arr = cr7_arr.copy()
alpha_sp = spidey_arr[:, :, 3] > 0

# Torso & Legs:
for y in range(180, TARGET_H):
    for x in range(TARGET_W):
        if alpha_sp[y, x]:
            dist_c = abs(x - 141)
            # Center chest is Scarlet Red
            is_red = (y < 460) and (dist_c < 45)
            if is_red:
                lum = (int(cr7_arr[y, x, 0]) + int(cr7_arr[y, x, 1]) + int(cr7_arr[y, x, 2])) / 3.0 / 255.0
                spidey_arr[y, x, 0] = np.clip(int(195 + lum * 55), 0, 255)
                spidey_arr[y, x, 1] = np.clip(int(18 + lum * 35), 0, 255)
                spidey_arr[y, x, 2] = np.clip(int(24 + lum * 40), 0, 255)
                # Black web grid
                if (x % 14 in [0, 1]) or (y % 16 in [0, 1]):
                    spidey_arr[y, x, 0] = int(spidey_arr[y, x, 0] * 0.35)
                    spidey_arr[y, x, 1] = int(spidey_arr[y, x, 1] * 0.35)
                    spidey_arr[y, x, 2] = int(spidey_arr[y, x, 2] * 0.35)
            else:
                # Royal Blue Sides & Legs
                lum = (int(cr7_arr[y, x, 0]) + int(cr7_arr[y, x, 1]) + int(cr7_arr[y, x, 2])) / 3.0 / 255.0
                spidey_arr[y, x, 0] = np.clip(int(14 + lum * 25), 0, 255)
                spidey_arr[y, x, 1] = np.clip(int(65 + lum * 70), 0, 255)
                spidey_arr[y, x, 2] = np.clip(int(185 + lum * 70), 0, 255)

# Center Spider Emblem on Chest (y: 260 to 295, x: 132 to 150)
for y in range(260, 295):
    for x in range(130, 152):
        if alpha_sp[y, x]:
            if np.hypot(x - 141, y - 275) <= 4 or np.hypot(x - 141, y - 285) <= 5:
                spidey_arr[y, x] = [15, 15, 20, 255]
            if (abs(x - 141) == int(abs(y - 275)*1.4) and 264 <= y <= 290) or (abs(x - 141) == int(abs(y - 282)*1.6) and 272 <= y <= 294):
                spidey_arr[y, x] = [15, 15, 20, 255]

Image.fromarray(spidey_arr).save('portfolio/assets/avatar-priyam-spiderman.png')
print('Processed portfolio/assets/avatar-priyam-spiderman.png')
print('ALL 7 HD SPRITES SAVED!')
