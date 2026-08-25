from pathlib import Path
from PIL import Image

for raw_path in [
    Path('/home/ubuntu/upload/pasted_file_gTheSS_image.png'),
    Path('/home/ubuntu/webdev-static-assets/mg-logo-transparent.png'),
]:
    image = Image.open(raw_path)
    rgba = image.convert('RGBA')
    alpha = rgba.getchannel('A')
    extrema = alpha.getextrema()
    transparent = sum(1 for value in alpha.getdata() if value == 0)
    semi = sum(1 for value in alpha.getdata() if 0 < value < 255)
    print(f'{raw_path.name}: size={rgba.size} mode={image.mode} alpha_extrema={extrema} transparent_pixels={transparent} semi_transparent_pixels={semi}')
