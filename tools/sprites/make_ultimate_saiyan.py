import numpy as np
from PIL import Image

# 1. Load raw AI-generated Saiyan sprite
raw_saiyan = Image.open('/Users/priyamrupapara/.gemini/antigravity/brain/63bba458-c2ee-4b74-a116-d2cd7430cc84/priyam_saiyan_sprite_1788255014863.jpg').convert('RGBA')
arr_s = np.array(raw_saiyan)
H_s, W_s = arr_s.shape[:2]

# Remove white background
is_white = (arr_s[:, :, 0] > 230) & (arr_s[:, :, 1] > 230) & (arr_s[:, :, 2] > 230)
arr_s[is_white, 3] = 0

# Crop bounding box
alpha = arr_s[:, :, 3] > 0
ys, xs = np.where(alpha)
crop_saiyan = arr_s[ys.min():ys.max()+1, xs.min():xs.max()+1]
saiyan_img = Image.fromarray(crop_saiyan)

# 2. Scale to match mannequin height (962 px)
target_h = 962
scale = target_h / saiyan_img.height
target_w = int(saiyan_img.width * scale)
saiyan_scaled = saiyan_img.resize((target_w, target_h), Image.Resampling.NEAREST)

# Center in 348 x 962 canvas
canvas_saiyan = Image.new('RGBA', (348, target_h), (0, 0, 0, 0))
paste_x = (348 - target_w) // 2
canvas_saiyan.paste(saiyan_scaled, (paste_x, 0), saiyan_scaled)

arr_final_saiyan = np.array(canvas_saiyan)

# 3. Add Priyam's signature black rectangular glasses on the eyes!
# Eyes in scaled Saiyan are around y: 270 to 310, x: 130 to 220
for y in range(275, 305):
    for x in range(125, 225):
        # Left frame rim
        is_left_frame = (y in [276, 277, 303, 304] and 130 <= x <= 170) or (x in [130, 131, 169, 170] and 276 <= y <= 304)
        # Right frame rim
        is_right_frame = (y in [276, 277, 303, 304] and 180 <= x <= 220) or (x in [180, 181, 219, 220] and 276 <= y <= 304)
        # Center bridge
        is_bridge = (y in [286, 287] and 169 <= x <= 181)
        if is_left_frame or is_right_frame or is_bridge:
            arr_final_saiyan[y, x] = [20, 20, 24, 255]

Image.fromarray(arr_final_saiyan).save('portfolio/assets/avatar-priyam-saiyan.png')
print('Ultimate Saiyan saved!')
