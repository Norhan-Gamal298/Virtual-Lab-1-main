import cv2  # Import the OpenCV library for image processing
import numpy as np  # Import NumPy for numerical operations
import matplotlib.pyplot as plt  # Import Matplotlib for displaying images
from file_handler import get_image_path  

# Read the image
path = get_image_path()
img = cv2.imread(path)


# Apply the Laplacian filter to the image
# cv2.CV_64F specifies that the output image will be of type double (64-bit float)
laplacian = cv2.Laplacian(img, cv2.CV_64F)

# Convert the output image to uint8 format for proper display
laplacian_abs = np.uint8(np.absolute(laplacian))

# Set up the figure for displaying images side by side
plt.figure(figsize=(12, 6))

# Display the original image
plt.subplot(1, 2, 1)
plt.imshow(img, cmap='gray')  # Use gray colormap for grayscale images
plt.title('Original Image')
plt.axis('off')  # Hide axes

# Display the Laplacian image
plt.subplot(1, 2, 2)
plt.imshow(laplacian_abs, cmap='gray')  # Use gray colormap for Laplacian image
plt.title('Laplacian Image')
plt.axis('off')  # Hide axes

# Adjust layout to prevent overlap
plt.tight_layout()

# Show the plot
plt.show()