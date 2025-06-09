import cv2  # Import the OpenCV library for image processing (not used in this snippet)
from PIL import Image  # Import the Pillow library to work with images
import numpy as np  # Import NumPy to represent images as arrays
import matplotlib.pyplot as plt  # Import Matplotlib for plotting

from file_handler import get_image_path  # Import the function to get the image path

# Get the image path using the provided function
path = get_image_path()

# Load an image
image_path = path  # Use the path obtained from the function
image = Image.open(image_path)  # Open the image using Pillow

# Convert the image to a NumPy array
image_array = np.array(image)  # Convert the image to a NumPy array

# Display the image and its array representation
plt.figure(figsize=(8, 6))  # Set the figure size for the plot

# Display the original image
plt.subplot(1, 2, 1)  # Create a subplot for the original image
plt.imshow(image)  # Show the original image
plt.title("Original Image")  # Set the title for the original image
plt.axis('off')  # Hide the axes

# Display the array representation of the image
plt.subplot(1, 2, 2)  # Create a subplot for the image array
plt.imshow(image_array)  # Show the image array
plt.title("Image Array Representation")  # Set the title for the array representation
plt.axis('off')  # Hide the axes

plt.show()  # Render the entire plot