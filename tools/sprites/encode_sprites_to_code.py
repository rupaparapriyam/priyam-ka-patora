import numpy as np
from PIL import Image
import json
import base64
import zlib

sprites = ['casual', 'saiyan', 'techwear', 'football', 'f1', 'ironman', 'spiderman']
out_data = {}

# Target compact resolution for pixel canvas (e.g. 116 x 320 or 87 x 240)
TARGET_W, TARGET_H = 116, 321

for s in sprites:
    img = Image.open(f'portfolio/assets/avatar-priyam-{s}.png').convert('RGBA')
    # Resize with NEAREST to preserve crisp pixel art
    resized = img.resize((TARGET_W, TARGET_H), Image.Resampling.NEAREST)
    arr = np.array(resized)
    
    # Extract unique colors palette
    # Convert RGBA to 32-bit uint
    flat = arr.reshape(-1, 4)
    # Color palette
    colors, indices = np.unique(flat, axis=0, return_inverse=True)
    palette_hex = []
    for c in colors:
        if c[3] == 0:
            palette_hex.append(None) # Transparent
        else:
            palette_hex.append(f'#{c[0]:02x}{c[1]:02x}{c[2]:02x}')
            
    # Compress indices with zlib & base64
    idx_bytes = bytes(indices.tolist())
    compressed = base64.b64encode(zlib.compress(idx_bytes, 9)).decode('ascii')
    
    out_data[s] = {
        'w': TARGET_W,
        'h': TARGET_H,
        'palette': palette_hex,
        'data': compressed
    }
    print(f'{s}: palette size={len(palette_hex)}, compressed data size={len(compressed)} bytes')

# Calculate total code footprint
total_bytes = sum(len(v['data']) + len(json.dumps(v['palette'])) for v in out_data.values())
print(f'TOTAL CODE FOOTPRINT FOR ALL 7 CHARACTERS: {total_bytes / 1024:.2f} KB!')
