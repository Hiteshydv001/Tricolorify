from PIL import Image, ImageDraw, ImageEnhance
import numpy as np
import os

def apply_tricolor_overlay(image, add_chakra=True):
    try:
        # Ensure image is RGBA
        if image.mode != 'RGBA':
            image = image.convert('RGBA')
        width, height = image.size

        # Use OpenCV for advanced blending
        import cv2
        image_np = np.array(image)
        overlay_np = np.zeros_like(image_np)
        # Saffron
        overlay_np[0:height//3, :, :] = [255,153,51,100]
        # White
        overlay_np[height//3:2*height//3, :, :] = [255,255,255,80]
        # Green
        overlay_np[2*height//3:height, :, :] = [19,136,8,100]

        # Alpha blend overlay
        alpha_overlay = overlay_np[...,3:4] / 255.0
        alpha_image = 1.0 - alpha_overlay
        blended_np = (image_np[...,:3] * alpha_image + overlay_np[...,:3] * alpha_overlay).astype(np.uint8)
        blended = Image.fromarray(blended_np, 'RGB').convert('RGBA')

        # Add Ashoka Chakra
        if add_chakra:
            chakra_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static/ashoka_chakra.jpg')
            if os.path.exists(chakra_path):
                chakra = Image.open(chakra_path).convert('RGBA')
                chakra_size = min(width, height) // 3
                chakra = chakra.resize((chakra_size, chakra_size), Image.LANCZOS)
                pos = ((width - chakra_size)//2, (height - chakra_size)//2)
                blended.paste(chakra, pos, chakra)
            else:
                print(f"Ashoka Chakra image not found at {chakra_path}")

        return blended.convert('RGB')
    except Exception as e:
        print(f"Error in apply_tricolor_overlay: {e}")
        raise
