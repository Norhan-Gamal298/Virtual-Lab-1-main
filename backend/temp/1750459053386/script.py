# Import the OpenCV library for image processing
import cv2  
# Import NumPy for numerical operations
import numpy as np  
# Import Matplotlib for plotting images
import matplotlib.pyplot as plt  

# Read the input image in grayscale mode
img = cv2.imread('sample.jpg', cv2.IMREAD_GRAYSCALE)  # Load grayscale image

# Function to add Gaussian noise to an image
def add_gaussian_noise(image, mean=0, sigma=25):
    # Create Gaussian noise with given mean and standard deviation
    gaussian = np.random.normal(mean, sigma, image.shape).astype(np.uint8)
    # Add the noise to the image
    noisy_image = cv2.add(image, gaussian)
    return noisy_image

# Function to add Salt-and-Pepper noise to an image
def add_salt_and_pepper_noise(image, salt_prob=0.01, pepper_prob=0.01):
    noisy_image = np.copy(image)
    
    # Generate coordinates for salt noise (white pixels)
    num_salt = np.ceil(salt_prob * image.size)
    coords = [np.random.randint(0, i - 1, int(num_salt)) for i in image.shape]
    noisy_image[coords[0], coords[1]] = 255  # Set salt pixels to white

    # Generate coordinates for pepper noise (black pixels)
    num_pepper = np.ceil(pepper_prob * image.size)
    coords = [np.random.randint(0, i - 1, int(num_pepper)) for i in image.shape]
    noisy_image[coords[0], coords[1]] = 0  # Set pepper pixels to black

    return noisy_image

# Add Gaussian noise to the original image
gaussian_noisy_image = add_gaussian_noise(img)

# Add Salt-and-Pepper noise to the original image
salt_and_pepper_noisy_image = add_salt_and_pepper_noise(img)

# Create a figure to show the original and noisy images
plt.figure(figsize=(15, 6))  # Set size of the figure

# Show the original grayscale image
plt.subplot(1, 3, 1)  # 1 row, 3 columns, 1st image
plt.imshow(img, cmap='gray')  
plt.title('Original Image')  
plt.axis('off')  # Hide axis ticks

# Show the image with Gaussian noise
plt.subplot(1, 3, 2)  # 1 row, 3 columns, 2nd image
plt.imshow(gaussian_noisy_image, cmap='gray')  
plt.title('Gaussian Noisy Image')  
plt.axis('off')

# Show the image with Salt-and-Pepper noise
plt.subplot(1, 3, 3)  # 1 row, 3 columns, 3rd image
plt.imshow(salt_and_pepper_noisy_image, cmap='gray')  
plt.title('Salt-and-Pepper Noisy Image')  
plt.axis('off')

# Display all images together
plt.tight_layout()  # Adjust layout to prevent overlap
plt.show()