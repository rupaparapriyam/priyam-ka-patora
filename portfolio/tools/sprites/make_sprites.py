import numpy as np
from PIL import Image, ImageDraw

base_img = Image.open('portfolio/assets/avatar-priyam-hd.png')
base_raw = np.array(base_img)
H, W = base_raw.shape[:2]

# Save Casual as exact base
base_img.save('portfolio/assets/avatar-priyam-casual.png')

# Helper functions for clean pixel art rendering
def create_blank():
    return np.zeros((H, W, 4), dtype=np.uint8)

# Skin colors from photo:
SKIN_DARK = (197, 133, 90, 255)
SKIN_MID  = (225, 166, 123, 255)
SKIN_HIGH = (241, 188, 149, 255)

# ==========================================
# 1. SUPER SAIYAN
# ==========================================
def make_saiyan():
    img = Image.open('portfolio/assets/avatar-priyam-hd.png').convert('RGBA')
    draw = ImageDraw.Draw(img)
    arr = np.array(img)
    
    # 1. Erase original hair area (y: 0 to 145)
    for y in range(0, 145):
        for x in range(W):
            if arr[y, x, 3] > 40:
                # If hair pixel
                if y < 85 or (y < 125 and (x < 90 or x > 192)):
                    arr[y, x] = [0, 0, 0, 0]
    
    img = Image.fromarray(arr)
    draw = ImageDraw.Draw(img)
    
    # 2. Draw Full Voluminous Super Saiyan Hair
    # Main spiky mass polygons
    hair_outline = (130, 80, 0, 255)
    hair_shadow = (200, 140, 0, 255)
    hair_mid = (250, 205, 10, 255)
    hair_highlight = (255, 240, 90, 255)
    hair_specular = (255, 255, 180, 255)
    
    # Large sweeping anime spikes
    spike_polys = [
        # Center huge crown spike
        [(141, 0), (105, 95), (177, 95)],
        # Left main spike
        [(85, 12), (50, 110), (130, 85)],
        # Right main spike
        [(197, 12), (152, 85), (232, 110)],
        # Far left flare spike
        [(25, 45), (32, 135), (95, 95)],
        # Far right flare spike
        [(257, 45), (187, 95), (250, 135)],
        # Mid left spike
        [(45, 90), (55, 150), (105, 125)],
        # Mid right spike
        [(237, 90), (177, 125), (227, 150)],
        # Bottom left ear tuft
        [(55, 135), (75, 165), (105, 145)],
        # Bottom right ear tuft
        [(227, 135), (177, 145), (207, 165)],
        # Forehead Bang 1 (Center Left)
        [(115, 135), (95, 80), (135, 80)],
        # Forehead Bang 2 (Center Right)
        [(167, 135), (147, 80), (187, 80)],
        # Forehead Bang 3 (Center)
        [(141, 120), (125, 75), (157, 75)]
    ]
    
    # Draw hair silhouettes
    for poly in spike_polys:
        draw.polygon(poly, fill=hair_shadow, outline=hair_outline)
    
    # Draw inner bright gold fills
    for poly in spike_polys:
        cx = sum(p[0] for p in poly) / 3.0
        cy = sum(p[1] for p in poly) / 3.0
        inner = [(int(p[0]*0.75 + cx*0.25), int(p[1]*0.75 + cy*0.25)) for p in poly]
        draw.polygon(inner, fill=hair_mid)
        # Specular tip
        tip = [(poly[0][0], poly[0][1]), (int(poly[0][0]*0.6 + poly[1][0]*0.4), int(poly[0][1]*0.6 + poly[1][1]*0.4)), (int(poly[0][0]*0.6 + poly[2][0]*0.4), int(poly[0][1]*0.6 + poly[2][1]*0.4))]
        draw.polygon(tip, fill=hair_highlight)
    
    # Golden Eyebrows
    draw.polygon([(88, 96), (115, 96), (112, 104), (88, 101)], fill=hair_mid, outline=hair_outline)
    draw.polygon([(167, 96), (194, 96), (194, 101), (170, 104)], fill=hair_mid, outline=hair_outline)
    
    # Electric Cyan Eyes
    draw.rectangle([94, 113, 109, 124], fill=(0, 245, 255, 255), outline=(0, 150, 200, 255))
    draw.rectangle([173, 113, 188, 124], fill=(0, 245, 255, 255), outline=(0, 150, 200, 255))
    draw.rectangle([99, 115, 104, 120], fill=(255, 255, 255, 255))
    draw.rectangle([178, 115, 183, 120], fill=(255, 255, 255, 255))
    
    # 3. DBZ Martial Arts Gi Torso (Cover whole shirt and arms with proper anatomy)
    # Bare muscular arms:
    # Left Arm
    draw.polygon([(52, 200), (85, 200), (60, 360), (20, 360)], fill=SKIN_MID, outline=SKIN_DARK)
    # Right Arm
    draw.polygon([(197, 200), (230, 200), (262, 360), (222, 360)], fill=SKIN_MID, outline=SKIN_DARK)
    
    # Navy Undershirt V-Neck
    draw.polygon([(141, 265), (105, 180), (177, 180)], fill=(22, 35, 125, 255), outline=(10, 18, 70, 255))
    
    # Orange Sleeveless Gi (Left & Right chest pieces with fabric folds)
    gi_dark = (195, 65, 0, 255)
    gi_orange = (255, 115, 0, 255)
    gi_light = (255, 145, 30, 255)
    
    # Left Gi Lapel
    draw.polygon([(58, 195), (112, 180), (141, 265), (141, 410), (52, 410), (52, 225)], fill=gi_orange, outline=gi_dark)
    # Right Gi Lapel
    draw.polygon([(224, 195), (170, 180), (141, 265), (141, 410), (230, 410), (230, 225)], fill=gi_orange, outline=gi_dark)
    
    # Fold highlights
    draw.line([(85, 220), (115, 370)], fill=gi_light, width=3)
    draw.line([(197, 220), (167, 370)], fill=gi_light, width=3)
    
    # Navy Blue Waist Sash (y: 405 to 450)
    draw.rectangle([50, 405, 232, 448], fill=(22, 35, 125, 255), outline=(10, 18, 70, 255))
    # Knot and hanging tails
    draw.rectangle([70, 410, 92, 445], fill=(35, 55, 165, 255))
    draw.polygon([(72, 448), (62, 505), (82, 505), (88, 448)], fill=(22, 35, 125, 255), outline=(10, 18, 70, 255))
    draw.polygon([(88, 448), (82, 485), (100, 485), (102, 448)], fill=(32, 50, 150, 255), outline=(10, 18, 70, 255))
    
    # Blue Wristbands
    draw.rectangle([18, 355, 58, 388], fill=(22, 35, 125, 255), outline=(10, 18, 70, 255))
    draw.rectangle([224, 355, 264, 388], fill=(22, 35, 125, 255), outline=(10, 18, 70, 255))
    draw.line([(18, 358), (58, 358)], fill=(245, 195, 0, 255), width=2)
    draw.line([(224, 358), (264, 358)], fill=(245, 195, 0, 255), width=2)
    
    img.save('portfolio/assets/avatar-priyam-saiyan.png')
    print('Saiyan created!')

# ==========================================
# 2. SPIDER-MAN
# ==========================================
def make_spiderman():
    img = Image.open('portfolio/assets/avatar-priyam-hd.png').convert('RGBA')
    draw = ImageDraw.Draw(img)
    
    # Expressive White Spider-Man Mask Lenses on Face
    # Left lens
    draw.polygon([(80, 102), (120, 110), (115, 132), (75, 122)], fill=(255, 255, 255, 255), outline=(15, 15, 20, 255))
    draw.polygon([(82, 104), (118, 111), (113, 130), (78, 121)], fill=(255, 255, 255, 255), outline=(15, 15, 20, 255))
    # Right lens
    draw.polygon([(202, 102), (162, 110), (167, 132), (207, 122)], fill=(255, 255, 255, 255), outline=(15, 15, 20, 255))
    draw.polygon([(200, 104), (164, 111), (169, 130), (204, 121)], fill=(255, 255, 255, 255), outline=(15, 15, 20, 255))
    
    # Spider-Man Full Suit Torso (Seamless coverage)
    red_main = (225, 28, 38, 255)
    red_dark = (170, 15, 25, 255)
    blue_main = (18, 85, 210, 255)
    blue_dark = (10, 50, 140, 255)
    
    # Blue Side Torso & Inner Arms
    draw.polygon([(18, 200), (65, 200), (45, 410), (18, 410)], fill=blue_main, outline=blue_dark)
    draw.polygon([(264, 200), (217, 200), (237, 410), (264, 410)], fill=blue_main, outline=blue_dark)
    draw.polygon([(50, 260), (95, 260), (95, 465), (50, 465)], fill=blue_main, outline=blue_dark)
    draw.polygon([(232, 260), (187, 260), (187, 465), (232, 465)], fill=blue_main, outline=blue_dark)
    
    # Center Red Chest & Shoulders
    draw.polygon([(65, 185), (217, 185), (187, 465), (95, 465)], fill=red_main, outline=red_dark)
    # Red Gauntlet Sleeves
    draw.rectangle([18, 345, 62, 440], fill=red_main, outline=red_dark)
    draw.rectangle([220, 345, 264, 440], fill=red_main, outline=red_dark)
    
    # Web Lattice Grid Lines on Red
    web_color = (40, 10, 15, 255)
    for x in range(100, 185, 14):
        draw.line([(x, 185), (x, 465)], fill=web_color, width=1)
    for y in range(195, 465, 16):
        draw.line([(95, y), (187, y)], fill=web_color, width=1)
    # Gauntlet webs
    for y in range(350, 440, 14):
        draw.line([(18, y), (62, y)], fill=web_color, width=1)
        draw.line([(220, y), (264, y)], fill=web_color, width=1)
        
    # Iconic Black Spider Emblem on Chest
    # Spider Body
    draw.ellipse([136, 275, 146, 298], fill=(15, 15, 20, 255))
    draw.ellipse([138, 266, 144, 276], fill=(15, 15, 20, 255))
    # Spider Legs (8 angled legs)
    draw.line([(136, 276), (115, 260), (105, 275)], fill=(15, 15, 20, 255), width=2)
    draw.line([(136, 282), (112, 280), (102, 295)], fill=(15, 15, 20, 255), width=2)
    draw.line([(136, 288), (115, 305), (110, 325)], fill=(15, 15, 20, 255), width=2)
    draw.line([(136, 294), (120, 320), (118, 335)], fill=(15, 15, 20, 255), width=2)
    
    draw.line([(146, 276), (167, 260), (177, 275)], fill=(15, 15, 20, 255), width=2)
    draw.line([(146, 282), (170, 280), (180, 295)], fill=(15, 15, 20, 255), width=2)
    draw.line([(146, 288), (167, 305), (172, 325)], fill=(15, 15, 20, 255), width=2)
    draw.line([(146, 294), (162, 320), (164, 335)], fill=(15, 15, 20, 255), width=2)
    
    # Blue Pants/Legs seamless look
    draw.rectangle([68, 465, 214, 520], fill=blue_main)
    
    img.save('portfolio/assets/avatar-priyam-spiderman.png')
    print('Spider-Man created!')

# ==========================================
# 3. IRON MAN
# ==========================================
def make_ironman():
    img = Image.open('portfolio/assets/avatar-priyam-hd.png').convert('RGBA')
    draw = ImageDraw.Draw(img)
    
    # High-Tech Holographic HUD Visor over eyes
    draw.polygon([(78, 100), (204, 100), (198, 130), (84, 130)], fill=(0, 240, 255, 140), outline=(0, 240, 255, 255))
    draw.line([(95, 115), (187, 115)], fill=(255, 255, 255, 200), width=1)
    
    crimson = (185, 22, 28, 255)
    crimson_dark = (130, 12, 16, 255)
    gold = (245, 195, 25, 255)
    gold_dark = (180, 135, 15, 255)
    
    # Full Sculpted Armor Plating
    # Crimson Chest Plates
    draw.polygon([(65, 185), (217, 185), (230, 465), (52, 465)], fill=crimson, outline=crimson_dark)
    
    # Gold Shoulder Pauldrons
    draw.polygon([(45, 190), (95, 190), (85, 250), (35, 240)], fill=gold, outline=gold_dark)
    draw.polygon([(237, 190), (187, 190), (197, 250), (247, 240)], fill=gold, outline=gold_dark)
    
    # Gold Bicep Armor & Armored Gauntlets
    draw.rectangle([20, 250, 60, 320], fill=crimson, outline=crimson_dark)
    draw.rectangle([222, 250, 262, 320], fill=crimson, outline=crimson_dark)
    draw.rectangle([18, 320, 62, 355], fill=gold, outline=gold_dark)
    draw.rectangle([220, 320, 264, 355], fill=gold, outline=gold_dark)
    draw.rectangle([15, 355, 62, 440], fill=crimson, outline=crimson_dark)
    draw.rectangle([220, 355, 267, 440], fill=crimson, outline=crimson_dark)
    
    # Gold Abdominal Segment Plates
    draw.rectangle([(95, 360), (187, 385)], fill=gold, outline=gold_dark)
    draw.rectangle([(102, 395), (180, 420)], fill=gold, outline=gold_dark)
    
    # Chest Armor Panel Lines
    draw.line([(141, 190), (141, 250)], fill=gold, width=3)
    draw.line([(100, 250), (141, 300), (182, 250)], fill=crimson_dark, width=3)
    
    # Glowing Triangular/Circular Arc Reactor in Center Chest
    # Outer Glow Ring
    draw.ellipse([125, 255, 157, 287], fill=(0, 220, 255, 255), outline=(0, 150, 200, 255))
    # Inner White Core
    draw.ellipse([132, 262, 150, 280], fill=(255, 255, 255, 255))
    
    # Armored Legs with Gold Knees
    draw.rectangle([65, 465, 217, 520], fill=crimson, outline=crimson_dark)
    draw.rectangle([85, 480, 115, 510], fill=gold, outline=gold_dark)
    draw.rectangle([167, 480, 197, 510], fill=gold, outline=gold_dark)
    
    img.save('portfolio/assets/avatar-priyam-ironman.png')
    print('Iron Man created!')

# ==========================================
# 4. CYBER TECHWEAR
# ==========================================
def make_techwear():
    img = Image.open('portfolio/assets/avatar-priyam-hd.png').convert('RGBA')
    draw = ImageDraw.Draw(img)
    
    obsidian = (18, 22, 30, 255)
    obsidian_dark = (10, 12, 18, 255)
    cyan_neon = (0, 240, 255, 255)
    strap_gray = (50, 60, 80, 255)
    
    # High Ninja Snood Cowl Neck (Covers neck completely)
    draw.polygon([(110, 165), (172, 165), (185, 225), (97, 225)], fill=obsidian, outline=obsidian_dark)
    draw.line([(110, 185), (172, 185)], fill=strap_gray, width=2)
    
    # Oversized Cyber Hoodie Torso & Sleeves
    draw.polygon([(45, 190), (237, 190), (242, 468), (40, 468)], fill=obsidian, outline=obsidian_dark)
    draw.polygon([(15, 210), (65, 210), (55, 440), (10, 440)], fill=obsidian, outline=obsidian_dark)
    draw.polygon([(267, 210), (217, 210), (227, 440), (272, 440)], fill=obsidian, outline=obsidian_dark)
    
    # Neon Cyan Central Waterproof Cyber Zipper
    draw.line([(141, 165), (141, 468)], fill=cyan_neon, width=4)
    # Zipper Pull Tab
    draw.rectangle([138, 230, 144, 245], fill=(255, 255, 255, 255))
    
    # Diagonal Utility Webbing Harness with Silver Buckles
    draw.line([(65, 230), (141, 330), (217, 230)], fill=strap_gray, width=5)
    draw.rectangle([133, 322, 149, 338], fill=(200, 215, 230, 255), outline=obsidian_dark)
    draw.line([(70, 360), (212, 360)], fill=strap_gray, width=4)
    
    # Glowing Neon Armbands
    draw.rectangle([15, 290, 60, 305], fill=cyan_neon)
    draw.rectangle([222, 290, 267, 305], fill=cyan_neon)
    
    # Tactical Dark Cargo Pants
    draw.rectangle([65, 468, 217, 520], fill=obsidian_dark)
    draw.line([(85, 485), (115, 485)], fill=cyan_neon, width=2)
    draw.line([(167, 485), (197, 485)], fill=cyan_neon, width=2)
    
    img.save('portfolio/assets/avatar-priyam-techwear.png')
    print('Techwear created!')

# ==========================================
# 5. CR7 REAL MADRID NO. 7
# ==========================================
def make_cr7():
    img = Image.open('portfolio/assets/avatar-priyam-hd.png').convert('RGBA')
    draw = ImageDraw.Draw(img)
    
    white_kit = (248, 250, 252, 255)
    white_shade = (215, 222, 232, 255)
    gold_madrid = (225, 185, 30, 255)
    navy_madrid = (15, 25, 55, 255)
    
    # Complete White Jersey Torso & Sleeves
    draw.polygon([(48, 185), (234, 185), (238, 465), (44, 465)], fill=white_kit, outline=white_shade)
    draw.polygon([(15, 210), (65, 210), (55, 410), (12, 410)], fill=white_kit, outline=white_shade)
    draw.polygon([(267, 210), (217, 210), (227, 410), (270, 410)], fill=white_kit, outline=white_shade)
    
    # Exposed forearms for match fitness
    draw.rectangle([16, 400, 52, 455], fill=SKIN_MID, outline=SKIN_DARK)
    draw.rectangle([228, 400, 264, 455], fill=SKIN_MID, outline=SKIN_DARK)
    
    # Crisp Polo V-Collar
    draw.polygon([(141, 235), (115, 180), (167, 180)], fill=white_shade, outline=gold_madrid)
    
    # Golden Madrid 3-Stripes on Shoulders
    for dy in range(0, 18, 6):
        draw.line([(55, 195 + dy), (105, 195 + dy)], fill=gold_madrid, width=2)
        draw.line([(177, 195 + dy), (227, 195 + dy)], fill=gold_madrid, width=2)
        
    # Golden Real Madrid Crest over Heart (Left chest: x 160 to 180, y 240 to 265)
    draw.ellipse([162, 242, 182, 264], fill=gold_madrid, outline=navy_madrid)
    draw.line([(165, 240), (179, 240)], fill=gold_madrid, width=2) # Crown
    
    # Bold CR7 Iconic \"7\" in Center Chest (x: 122 to 160, y: 285 to 365)
    # Top bar
    draw.polygon([(120, 285), (162, 285), (155, 305), (120, 305)], fill=navy_madrid, outline=gold_madrid)
    # Slash
    draw.polygon([(162, 285), (138, 365), (122, 365), (145, 305)], fill=navy_madrid, outline=gold_madrid)
    
    # Captain Armband on Left Arm (Viewer Left)
    draw.rectangle([15, 285, 58, 310], fill=gold_madrid, outline=navy_madrid)
    
    # Athletic White Match Shorts
    draw.rectangle([62, 465, 220, 520], fill=white_kit, outline=white_shade)
    draw.line([(68, 465), (68, 520)], fill=gold_madrid, width=3)
    draw.line([(214, 465), (214, 520)], fill=gold_madrid, width=3)
    
    img.save('portfolio/assets/avatar-priyam-football.png')
    print('CR7 created!')

# ==========================================
# 6. F1 SCUDERIA RACER
# ==========================================
def make_f1():
    img = Image.open('portfolio/assets/avatar-priyam-hd.png').convert('RGBA')
    draw = ImageDraw.Draw(img)
    
    rosso_corsa = (220, 20, 28, 255)
    rosso_dark = (155, 12, 18, 255)
    nero_black = (18, 18, 22, 255)
    ferrari_yellow = (255, 220, 0, 255)
    white_sponsor = (255, 255, 255, 255)
    
    # High Nomex Racing Collar
    draw.polygon([(112, 175), (170, 175), (175, 215), (107, 215)], fill=nero_black)
    draw.line([(141, 175), (141, 215)], fill=white_sponsor, width=2)
    
    # Full Racing Jumpsuit Torso
    draw.polygon([(48, 185), (234, 185), (238, 465), (44, 465)], fill=rosso_corsa, outline=rosso_dark)
    # Black Aerodynamic Side Panels
    draw.polygon([(48, 185), (85, 185), (95, 465), (44, 465)], fill=nero_black)
    draw.polygon([(234, 185), (197, 185), (187, 465), (238, 465)], fill=nero_black)
    
    # Red Racing Sleeves with Black Racing Cuffs
    draw.polygon([(15, 210), (65, 210), (55, 375), (12, 375)], fill=rosso_corsa, outline=rosso_dark)
    draw.polygon([(267, 210), (217, 210), (227, 375), (270, 375)], fill=rosso_corsa, outline=rosso_dark)
    # Black Racing Gloves
    draw.rectangle([12, 375, 55, 445], fill=nero_black)
    draw.rectangle([227, 375, 270, 445], fill=nero_black)
    
    # White Chest Sponsor Bar
    draw.polygon([(90, 238), (192, 238), (192, 255), (90, 255)], fill=white_sponsor, outline=nero_black)
    
    # Ferrari Cavallino Yellow Shield Badge (Heart side: x 158 to 180, y 268 to 292)
    draw.polygon([(160, 268), (180, 268), (178, 285), (170, 294), (162, 285)], fill=ferrari_yellow, outline=nero_black)
    # Prancing horse icon inside shield
    draw.line([(170, 272), (170, 288)], fill=nero_black, width=2)
    
    # Racing Jumpsuit Belt & Race Pants
    draw.rectangle([48, 410, 234, 432], fill=nero_black)
    draw.rectangle([62, 465, 220, 520], fill=rosso_corsa, outline=rosso_dark)
    draw.line([(141, 465), (141, 520)], fill=nero_black, width=3)
    
    img.save('portfolio/assets/avatar-priyam-f1.png')
    print('F1 created!')

make_saiyan()
make_spiderman()
make_ironman()
make_techwear()
make_cr7()
make_f1()
print('ALL 7 PIXEL ART COSTUMES GENERATED MASTERFULLY!')
