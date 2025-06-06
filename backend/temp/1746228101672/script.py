# Import the OpenCV library for image processing
import cv2
# Import Matplotlib for displaying images
import matplotlib.pyplot as plt

# Read the image using OpenCV and convert it to grayscale
img = cv2.imread('sample.jpg', cv2.IMREAD_GRAYSCALE)

# Display the grayscale image using Matplotlib, setting the colormap to gray
plt.imshow(img, cmap='gray')

# Add a title to the image
plt.title('Grayscale Image')

# Hide the axes (since the image is the only important part here)
plt.axis('off')

# Show the image
plt.show()