import cv2
import numpy as np
from matplotlib import pyplot as plt
from file_handler import get_image_path  

# Get the image path using the provided function
path = get_image_path()

img = cv2.imread(path,0)

hist,bins = np.histogram(img.flatten(),256,[0,256])

cdf = hist.cumsum()
cdf_normalized = cdf * hist.max()/ cdf.max()

plt.plot(cdf_normalized, color = 'b')
plt.hist(img.flatten(),256,[0,256], color = 'r')
plt.xlim([0,256])
plt.legend(('cdf','histogram'), loc = 'upper left')
plt.show()