import cv2 as cv
import numpy as np
import matplotlib.pyplot as plt
from file_handler import get_image_path  

# Get the image path using the provided function
path = get_image_path()

# Read the original image
img = cv.imread(path)  # Use the path obtained from get_image_path

# Convert the image to grayscale
gray_image = cv.cvtColor(img, cv.COLOR_BGR2GRAY)

# Set up the figure for displaying images
fig, ax = plt.subplots(1, 2, figsize=(8, 4))
fig.tight_layout()

# Display the original image
ax[0].imshow(cv.cvtColor(img, cv.COLOR_BGR2RGB))  # Convert BGR to RGB for display
ax[0].set_title("Original")
ax[0].axis('off')  # Hide axes

# Display the grayscale image
ax[1].imshow(gray_image, cmap='gray')  # Use 'gray' colormap for grayscale
ax[1].set_title("Grayscale")
ax[1].axis('off')  # Hide axes

# Show the images
plt.show()