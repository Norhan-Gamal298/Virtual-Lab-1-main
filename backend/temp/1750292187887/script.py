# Import OpenCV for image processing
import cv2
# Import Matplotlib for displaying images
import matplotlib.pyplot as plt

# Read the image in color mode (BGR format)
img = cv2.imread('sample.jpg', cv2.IMREAD_COLOR)

# Convert the color image to grayscale
gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Create a figure with two subplots: one for original image, one for grayscale
fig, axes = plt.subplots(1, 2, figsize=(12, 6))
fig.tight_layout()

# Display the original image (convert from BGR to RGB for correct colors in matplotlib)
axes[0].imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
axes[0].set_title('Original Image')
axes[0].axis('off')  # Hide axes ticks

# Display the grayscale image with gray colormap
axes[1].imshow(gray_img, cmap='gray')
axes[1].set_title('Grayscale Image')
axes[1].axis('off')  # Hide axes ticks

# Show both images in the window
plt.show()