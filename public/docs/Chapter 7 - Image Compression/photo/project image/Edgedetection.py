import cv2
import numpy as np
import matplotlib.pyplot as plt
from file_handler import get_image_path  


# Read the image file
path = get_image_path()

img = cv2.imread(path)

# Convert the image from BGR (OpenCV default) to RGB
image_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

# Perform Canny edge detection
# The first argument is the input image, and the second and third arguments are the lower and upper thresholds
edges = cv2.Canny(image_rgb, 100, 700)

# Set up the figure for displaying images side by side
fig, axs = plt.subplots(1, 2, figsize=(12, 6))

# Display the original image
axs[0].imshow(image_rgb)
axs[0].set_title('Original Image')
axs[0].axis('off')  # Hide axes

# Display the edge-detected image
axs[1].imshow(edges, cmap='gray')  # Use grayscale colormap for edges
axs[1].set_title('Image Edges')
axs[1].axis('off')  # Hide axes

# Adjust layout to prevent overlap
plt.tight_layout()

# Show the images
plt.show()