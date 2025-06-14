import cv2
import matplotlib.pyplot as plt

# Read the image in color mode (BGR format)
img = cv2.imread('sample2.jpg', cv2.IMREAD_COLOR)

# Check if the image was loaded successfully
if img is None:
    print("Error: Image not found.")  # Print error if image path is wrong or file missing
    exit()

# Convert the image from BGR (OpenCV default) to RGB for correct color display with matplotlib
img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

# Create a figure with 2 subplots to show image before and after color correction
plt.figure(figsize=(12, 5))  # Set figure size for better visualization

# Show the original image in BGR format (colors will appear incorrect in matplotlib)
plt.subplot(1, 2, 1)
plt.imshow(img)  
plt.title('Before (BGR - Wrong Colors)')
plt.axis('off')  # Hide axis ticks and labels

# Show the image after converting to RGB (correct colors)
plt.subplot(1, 2, 2)
plt.imshow(img_rgb)
plt.title('After (RGB - Correct Colors)')
plt.axis('off')  # Hide axis ticks and labels

# Adjust spacing between subplots and display the figure
plt.tight_layout()
plt.show()