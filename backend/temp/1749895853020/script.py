# Import the OpenCV library for image processing
import cv2  
# Import NumPy for numerical operations
import numpy as np  
# Import Matplotlib for plotting
import matplotlib.pyplot as plt  

# Load the image in color mode using a unified image name
img = cv2.imread('sample.jpg', cv2.IMREAD_COLOR)  
# MATLAB: img = imread('sample.jpg'); % Read image in color (RGB)

# Convert the image from BGR to YUV color space
yuv_img = cv2.cvtColor(img, cv2.COLOR_BGR2YUV)  
# MATLAB: yuv_img = rgb2ycbcr(img); % Convert RGB to YCbCr (similar to YUV)

# Perform histogram equalization on the Y channel (luminance)
yuv_img[:, :, 0] = cv2.equalizeHist(yuv_img[:, :, 0])  
# MATLAB: yuv_img(:, :, 1) = histeq(yuv_img(:, :, 1)); % Equalize luminance channel

# Convert the image back to BGR color space
equalized_img = cv2.cvtColor(yuv_img, cv2.COLOR_YUV2BGR)  
# MATLAB: equalized_img = ycbcr2rgb(yuv_img); % Convert back to RGB

# Create a figure to display the original and equalized images
fig, axes = plt.subplots(1, 2, figsize=(12, 6))  
fig.tight_layout()

# Display the original image
axes[0].imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))  
axes[0].set_title('Original Image')  
axes[0].axis('off')

# Display the equalized image
axes[1].imshow(cv2.cvtColor(equalized_img, cv2.COLOR_BGR2RGB))  
axes[1].set_title('Equalized Image')  
axes[1].axis('off')

# Show the combined figure
plt.show()