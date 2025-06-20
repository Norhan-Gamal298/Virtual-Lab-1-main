# Import the OpenCV library for image processing
import cv2  
import numpy as np
# Import Matplotlib for plotting
import matplotlib.pyplot as plt  

# Fixed image filename
path = 'sample.jpg'

# Load the input image from the given path
img = cv2.imread(path)

# Check if the image was successfully loaded
if img is None:
    print(f"Error: Unable to load image at {path}")
else:
    # Convert BGR (OpenCV default) to RGB for correct color display in matplotlib
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # Reshape the image into a 2D array of pixels and convert to float32 for k-means
    Z = img.reshape((-1, 3)).astype(np.float32)

    # Define the criteria for K-means clustering:
    # Stop either after 10 iterations or if the accuracy is less than 1.0
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0)

    K = 3  # Number of clusters (segments)

    # Apply K-means clustering
    # Returns compactness, labels (which cluster each pixel belongs to), and centers (cluster centers)
    _, label, center = cv2.kmeans(Z, K, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)

    # Convert cluster centers to uint8 (pixel values)
    center = np.uint8(center)

    # Replace each pixel with its corresponding center value to create segmented image
    segmented = center[label.flatten()].reshape(img.shape)

    # Convert segmented image to RGB for matplotlib display
    segmented_rgb = cv2.cvtColor(segmented, cv2.COLOR_BGR2RGB)

    # Plot original and segmented images side by side using subplots
    plt.figure(figsize=(10, 5))

    # Original image subplot
    plt.subplot(1, 2, 1)
    plt.imshow(img_rgb)
    plt.title('Original Image')
    plt.axis('off')

    # Segmented image subplot
    plt.subplot(1, 2, 2)
    plt.imshow(segmented_rgb)
    plt.title(f'Segmented Image (K={K})')
    plt.axis('off')

    plt.tight_layout()
    plt.show()