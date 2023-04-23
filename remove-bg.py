from PIL import Image
import numpy as np

# Load the image
img_file = input("Image Path:")
img = Image.open(img_file)

# Convert the image to a numpy array for easier processing
img_array = np.array(img)

# Define a mask to select the pixels that represent the background
bg_color = np.array([255, 255, 255])  # define the background color in RGB format
color_diff = np.abs(img_array - bg_color)
bg_mask = np.all(color_diff < 10, axis=2)  # select pixels with color difference less than a threshold

# Apply the mask to the image to remove the background
img_array[bg_mask] = [255, 255, 255]  # set the background pixels to white (or any other color)

# Create a new PIL image from the numpy array
new_img = Image.fromarray(img_array)

# Save the output image
new_img.save('output_file.png')
