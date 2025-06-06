import cv2
import matplotlib.pyplot as plt

# Load the image (make sure sample.jpg is in the same folder)
img = cv2.imread('sample.jpg', cv2.IMREAD_GRAYSCALE)

# Check if image is loaded properly
if img is None:
    raise FileNotFoundError("Image 'sample.jpg' not found. Make sure it's in the same folder as this script.")

# Apply Canny Edge Detection
edges = cv2.Canny(img, threshold1=100, threshold2=200)

# Show original and edges side by side
plt.figure(figsize=(10, 5))

plt.subplot(1, 2, 1)
plt.title("Original Image")
plt.imshow(img, cmap='gray')
plt.axis('off')

plt.subplot(1, 2, 2)
plt.title("Edge Detection")
plt.imshow(edges, cmap='gray')
plt.axis('off')

plt.tight_layout()
plt.savefig("output.png")  # Save output if needed
plt.show()
