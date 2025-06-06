import cv2
import matplotlib.pyplot as plt

img = cv2.imread('sample.jpg', cv2.IMREAD_GRAYSCALE)
plt.imshow(img, cmap='gray')
plt.title('Grayscale Image')
plt.axis('off')
plt.savefig('output.jpg', bbox_inches='tight', pad_inches=0)
