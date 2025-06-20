# Import the OpenCV library for image processing
import cv2  
# Import NumPy for numerical operations
import numpy as np  
# Import Matplotlib for plotting
import matplotlib.pyplot as plt  

# Read the input image in color mode using the unified image name
img = cv2.imread('sample.jpg')  # Read the image

# Define the sharpening kernel (Laplacian filter)
sharpening_kernel = np.array([[0, -1, 0],
                               [-1, 5, -1],
                               [0, -1, 0]])

# Apply the sharpening filter using filter2D
sharpened_image = cv2.filter2D(img, -1, sharpening_kernel)

# Create a figure to display the original and sharpened images
plt.figure(figsize=(12, 6))  # Set the figure size

# Display the original image
plt.subplot(1, 2, 1)  # 1 row, 2 columns, 1st subplot
plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))  # Convert BGR to RGB for display
plt.title('Original Image')  # Title for the original image
plt.axis('off')  # Hide axes

# Display the sharpened image
plt.subplot(1, 2, 2)  # 1 row, 2 columns, 2nd subplot
plt.imshow(cv2.cvtColor(sharpened_image, cv2.COLOR_BGR2RGB))  # Convert BGR to RGB for display
plt.title('Sharpened Image (Laplacian Filter)')  # Title for the sharpened image
plt.axis('off')  # Hide axes

# Show the combined figure
plt.tight_layout()  # Adjust layout for better spacing
plt.show()  # Display the images