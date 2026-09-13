import numpy as np
from PIL import Image
from collections import deque

def remove_bg_floodfill(jpg_path):
    img = Image.open(jpg_path).convert('RGBA')
    arr = np.array(img)
    H, W = arr.shape[:2]
    
    # Visited & background mask
    is_bg = np.zeros((H, W), dtype=bool)
    
    # Color distance to pure white
    def is_white_px(y, x):
        r, g, b = arr[y, x, 0], arr[y, x, 1], arr[y, x, 2]
        return r > 225 and g > 225 and b > 225
        
    queue = deque()
    # Add borders
    for x in range(W):
        if is_white_px(0, x): queue.append((0, x)); is_bg[0, x] = True
        if is_white_px(H-1, x): queue.append((H-1, x)); is_bg[H-1, x] = True
    for y in range(H):
        if is_white_px(y, 0): queue.append((y, 0)); is_bg[y, 0] = True
        if is_white_px(y, W-1): queue.append((y, W-1)); is_bg[y, W-1] = True
        
    while queue:
        cy, cx = queue.popleft()
        for dy, dx in [(-1,0), (1,0), (0,-1), (0,1)]:
            ny, nx = cy + dy, cx + dx
            if 0 <= ny < H and 0 <= nx < W and not is_bg[ny, nx]:
                if is_white_px(ny, nx):
                    is_bg[ny, nx] = True
                    queue.append((ny, nx))
                    
    # Also remove ground shadows (bottom 10% dark pixels connected to bottom)
    for y in range(int(H * 0.88), H):
        for x in range(W):
            r, g, b = arr[y, x, 0], arr[y, x, 1], arr[y, x, 2]
            if (r < 110 and g < 110 and b < 130) or (g > r + 15 and g > b) or is_bg[y, x]:
                arr[y, x, 3] = 0
            elif is_bg[y, x]:
                arr[y, x, 3] = 0
                
    arr[is_bg, 3] = 0
    
    # Bounding box
    alpha = arr[:, :, 3] > 0
    ys, xs = np.where(alpha)
    cropped = Image.fromarray(arr[ys.min():ys.max()+1, xs.min():xs.max()+1])
    
    # Scale to 521
    base_img = Image.open('portfolio/assets/avatar-priyam-hd.png')
    TARGET_H = base_img.height # 521
    TARGET_W = base_img.width  # 283
    scale = TARGET_H / cropped.height
    new_w = int(cropped.width * scale)
    scaled = cropped.resize((new_w, TARGET_H), Image.Resampling.NEAREST)
    
    canvas = Image.new('RGBA', (TARGET_W, TARGET_H), (0, 0, 0, 0))
    paste_x = (TARGET_W - new_w) // 2
    canvas.paste(scaled, (paste_x, 0), scaled)
    return canvas

# 1. Techwear
c_tech = remove_bg_floodfill('/Users/priyamrupapara/.gemini/antigravity/brain/63bba458-c2ee-4b74-a116-d2cd7430cc84/priyam_techwear_sprite_1788255161567.jpg')
c_tech.save('portfolio/assets/avatar-priyam-techwear.png')
print('Techwear saved!')

# 2. CR7 Football
c_cr7 = remove_bg_floodfill('/Users/priyamrupapara/.gemini/antigravity/brain/63bba458-c2ee-4b74-a116-d2cd7430cc84/priyam_cr7_sprite_1788255183801.jpg')
c_cr7.save('portfolio/assets/avatar-priyam-football.png')
print('CR7 saved!')

# 3. F1 Scuderia
c_f1 = remove_bg_floodfill('/Users/priyamrupapara/.gemini/antigravity/brain/63bba458-c2ee-4b74-a116-d2cd7430cc84/priyam_f1_sprite_1788255355383.jpg')
c_f1.save('portfolio/assets/avatar-priyam-f1.png')
print('F1 saved!')

# Now Build Iron Man & Spider-Man from the solid F1 canvas
f1_arr = np.array(c_f1)
TARGET_H, TARGET_W = f1_arr.shape[:2]
alpha_f1 = f1_arr[:, :, 3] > 0

# 4. Iron Man Mark 85
iron = f1_arr.copy()
for y in range(140, TARGET_H):
    for x in range(TARGET_W):
        if alpha_f1[y, x]:
            dist_c = abs(x - 141)
            is_gold = (145 <= y <= 240 and dist_c > 22) or (385 <= y <= 415 and dist_c < 30) or (450 <= y <= 475 and 18 < dist_c < 48)
            rad_c = np.hypot(x - 141, y - 275)
            lum = 0.5 + 0.35 * (1.0 - min(1.0, rad_c / 140.0))
            if is_gold:
                iron[y, x] = [np.clip(int(205 + lum * 45), 0, 255), np.clip(int(155 + lum * 80), 0, 255), np.clip(int(15 + lum * 40), 0, 255), 255]
            else:
                iron[y, x] = [np.clip(int(165 + lum * 75), 0, 255), np.clip(int(12 + lum * 28), 0, 255), np.clip(int(18 + lum * 32), 0, 255), 255]

# Center Arc Reactor
for y in range(235, 266):
    for x in range(126, 156):
        if alpha_f1[y, x]:
            d = np.hypot(x - 141, y - 250)
            if d <= 6:
                iron[y, x] = [255, 255, 255, 255]
            elif d <= 11:
                iron[y, x] = [0, 240, 255, 255]
            elif d <= 14:
                iron[y, x] = [0, 140, 210, 255]

Image.fromarray(iron).save('portfolio/assets/avatar-priyam-ironman.png')
print('Iron Man saved!')

# 5. Spider-Man
spidey = f1_arr.copy()
for y in range(140, TARGET_H):
    for x in range(TARGET_W):
        if alpha_f1[y, x]:
            dist_c = abs(x - 141)
            is_red = (y < 460 and dist_c < 42) or (340 <= y <= 430 and dist_c > 45) or (y >= 485)
            rad_c = np.hypot(x - 141, y - 275)
            lum = 0.5 + 0.35 * (1.0 - min(1.0, rad_c / 140.0))
            if is_red:
                r = np.clip(int(185 + lum * 65), 0, 255)
                g = np.clip(int(15 + lum * 25), 0, 255)
                b = np.clip(int(22 + lum * 30), 0, 255)
                if (x % 14 in [0, 1]) or (y % 16 in [0, 1]):
                    r = int(r * 0.35); g = int(g * 0.35); b = int(b * 0.35)
                spidey[y, x] = [r, g, b, 255]
            else:
                spidey[y, x] = [np.clip(int(10 + lum * 20), 0, 255), np.clip(int(55 + lum * 70), 0, 255), np.clip(int(175 + lum * 75), 0, 255), 255]

# Center Spider
for y in range(245, 280):
    for x in range(130, 152):
        if alpha_f1[y, x]:
            if np.hypot(x - 141, y - 260) <= 4 or np.hypot(x - 141, y - 270) <= 5:
                spidey[y, x] = [15, 15, 20, 255]
            if (abs(x - 141) == int(abs(y - 260)*1.4) and 248 <= y <= 275) or (abs(x - 141) == int(abs(y - 267)*1.6) and 258 <= y <= 280):
                spidey[y, x] = [15, 15, 20, 255]

Image.fromarray(spidey).save('portfolio/assets/avatar-priyam-spiderman.png')
print('Spider-Man saved!')
print('ALL 7 SPRITES SAVED WITH CLEAN FLOOD-FILL TRANSPARENCY!')
