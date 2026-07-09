import sys
import os
from PIL import Image

def clean_image_background(input_path, output_path):
    if not os.path.exists(input_path):
        print(f"Error: Input file {input_path} does not exist.")
        return

    # Load image and convert to RGBA
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    pixels = img.load()

    # Step 1: Identify all "near-white" pixels (R, G, B >= 210)
    near_white = [[False for _ in range(height)] for _ in range(width)]
    for x in range(width):
        for y in range(height):
            r, g, b, a = pixels[x, y]
            if r >= 210 and g >= 210 and b >= 210:
                near_white[x][y] = True

    # Step 2: Connected components BFS on near-white pixels
    visited = [[False for _ in range(height)] for _ in range(width)]
    components = []

    for x in range(width):
        for y in range(height):
            if near_white[x][y] and not visited[x][y]:
                comp = []
                queue = [(x, y)]
                visited[x][y] = True
                touches_border = False

                while queue:
                    cx, cy = queue.pop(0)
                    comp.append((cx, cy))
                    
                    if cx == 0 or cx == width - 1 or cy == 0 or cy == height - 1:
                        touches_border = True

                    for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                        nx, ny = cx + dx, cy + dy
                        if 0 <= nx < width and 0 <= ny < height:
                            if near_white[nx][ny] and not visited[nx][ny]:
                                visited[nx][ny] = True
                                queue.append((nx, ny))
                
                components.append((comp, touches_border))

    # Step 3: Make components transparent if they are large or touch the border
    # Large components (> 15 pixels) or components touching the border are background
    for comp, touches_border in components:
        if len(comp) > 15 or touches_border:
            for cx, cy in comp:
                pixels[cx, cy] = (255, 255, 255, 0) # Completely transparent

    # Step 4: Multi-pass border cleaning to eliminate white halo/edges
    # We find any pixel that is still light (R, G, B >= 160) and is next to a transparent pixel,
    # and make it transparent. We do this for 2 passes.
    for pass_num in range(2):
        to_clear = []
        for x in range(width):
            for y in range(height):
                r, g, b, a = pixels[x, y]
                if a > 0 and r >= 160 and g >= 160 and b >= 160:
                    has_transparent_neighbor = False
                    for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (1, -1), (-1, 1), (1, 1)]:
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < width and 0 <= ny < height:
                            if pixels[nx, ny][3] == 0:
                                has_transparent_neighbor = True
                                break
                    if has_transparent_neighbor:
                        to_clear.append((x, y))
        
        for cx, cy in to_clear:
            pixels[cx, cy] = (255, 255, 255, 0)

    # Save output
    img.save(output_path, "PNG")
    print(f"Background removed successfully. Output saved to: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python remove_background.py <input_image_path> <output_image_path>")
        sys.exit(1)
    
    clean_image_background(sys.argv[1], sys.argv[2])
