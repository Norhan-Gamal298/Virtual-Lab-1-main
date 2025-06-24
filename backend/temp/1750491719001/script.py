# Import the OpenCV library for image processing
import cv2  
# Import NumPy for numerical operations
import numpy as np  
# Import Matplotlib for plotting
import matplotlib.pyplot as plt  

# Read the image and convert it to grayscale
img = cv2.imread('sample.png')  # Load the image (color)
if img is None:
    raise ValueError("Image 'noisy.png' not found. Please check the path.")

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)  # Convert the image to grayscale for corner detection

# Harris Corner Detection
gray_float = np.float32(gray)  # Convert the grayscale image to float32 type (required by cornerHarris)
harris_corners = cv2.cornerHarris(gray_float, 2, 3, 0.04)  # Apply Harris corner detection
img_harris = img.copy()  # Copy the original image to draw Harris corners
# Mark detected corners in red on the copy of the original image
img_harris[harris_corners > 0.01 * harris_corners.max()] = [0, 0, 255]  # BGR red color

# Shi-Tomasi Corner Detection
shi_corners = cv2.goodFeaturesToTrack(gray, 100, 0.01, 10)  # Detect corners using Shi-Tomasi method
img_shi = img.copy()  # Copy original image to draw Shi-Tomasi corners
for i in shi_corners:
    x, y = i.ravel()  # Extract x and y coordinates of each corner
    cv2.circle(img_shi, (int(x), int(y)), 3, (0, 255, 0), -1)  # Draw green circles at corners

# Convert images from BGR to RGB for matplotlib display
img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
img_harris_rgb = cv2.cvtColor(img_harris, cv2.COLOR_BGR2RGB)
img_shi_rgb = cv2.cvtColor(img_shi, cv2.COLOR_BGR2RGB)

# Plot original and results side-by-side using subplots
plt.figure(figsize=(18, 6))  # Wider figure for three images

plt.subplot(1, 3, 1)
plt.imshow(img_rgb)
plt.title('Original Image (Color)')
plt.axis('off')

plt.subplot(1, 3, 2)
plt.imshow(img_harris_rgb)
plt.title('Harris Corner Detection')
plt.axis('off')

plt.subplot(1, 3, 3)
plt.imshow(img_shi_rgb)
plt.title('Shi-Tomasi Corner Detection')
plt.axis('off')

plt.tight_layout()
plt.show()