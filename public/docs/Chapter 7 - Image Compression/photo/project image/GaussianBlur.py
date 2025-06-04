from PIL import Image, ImageFilter
import matplotlib.pyplot as plt
from file_handler import get_image_path  
# Open a Gaussian Noised Image and convert it to RGB
path = get_image_path()
input_image = Image.open(path).convert('RGB')

# Apply Gaussian blur with a specified radius
# The radius controls the amount of blurring; a higher value results in more blur
blurred_image = input_image.filter(ImageFilter.GaussianBlur(radius=2))

# Display the original and blurred images side by side
plt.figure(figsize=(12, 6))

# Original Image
plt.subplot(1, 2, 1)
plt.imshow(input_image)
plt.title("Original Image")
plt.axis('off')  # Hide axes

# Blurred Image
plt.subplot(1, 2, 2)
plt.imshow(blurred_image)
plt.title("Blurred Image (Gaussian Blur)")
plt.axis('off')  # Hide axes

# Show the images
plt.tight_layout()
plt.show()