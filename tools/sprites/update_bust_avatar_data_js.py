import io, base64
from PIL import Image

sprites = ['casual', 'saiyan', 'techwear', 'football', 'f1', 'ironman', 'spiderman']
js_lines = [
    "/**",
    " * Pure-Code Top-Part Bust Avatar Sprite Asset Dictionary",
    " * 100% Embedded in Code - 0 External Network Requests - Instant Load",
    " */",
    "window.AVATAR_SPRITES = {"
]

for s in sprites:
    img = Image.open(f'portfolio/assets/avatar-priyam-{s}.png')
    # Resize to high-density crisp pixel grid: 174 x 280
    res = img.resize((174, 280), Image.Resampling.NEAREST)
    q = res.quantize(colors=64, method=Image.Quantize.FASTOCTREE)
    buf = io.BytesIO()
    q.save(buf, format='PNG', optimize=True)
    b64_str = base64.b64encode(buf.getvalue()).decode('ascii')
    js_lines.append(f"  '{s}': 'data:image/png;base64,{b64_str}',")

js_lines.append("};")

with open('portfolio/avatar-data.js', 'w') as f:
    f.write("\n".join(js_lines) + "\n")

print('portfolio/avatar-data.js updated with top-part bust sprites!')
