from PIL import Image, ImageEnhance
import matplotlib.pyplot as plt
from file_handler import get_image_path 

# Open an image file
path = get_image_path()
image = Image.open(path)  # Use the path obtained from get_image_path()

# Create a Color enhancer object
color_enhancer = ImageEnhance.Color(image)

# Enhance the color with a factor of 2.0
# A factor of 1.0 means no change, less than 1.0 reduces color, and greater than 1.0 enhances color
colorful_image = color_enhancer.enhance(2.0) 

# Set up the figure for displaying images side by side
plt.figure(figsize=(12, 6))

# Original Image
plt.subplot(1, 2, 1)
plt.imshow(image)
plt.title("Original Image")
plt.axis('off')  # Hide axes

# Enhanced Color Image
plt.subplot(1, 2, 2)
plt.imshow(colorful_image)
plt.title("Color Enhanced Image (Factor 2.0)")
plt.axis('off')  # Hide axes

# Show the images in a single window
plt.tight_layout()
plt.show()