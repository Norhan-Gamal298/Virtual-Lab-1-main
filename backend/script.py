import cv2
import matplotlib.pyplot as plt
import os

# Define accepted formats
ACCEPTED_FORMATS = ('.jpg', '.jpeg', '.png', '.bmp', '.tiff')

print("🔍 Looking for image files...")

# List all files in current directory
all_files = os.listdir('.')
print(f"📁 Files found: {', '.join(all_files)}")

# Find any image file starting with 'sample' and having a valid extension
sample_images = [f for f in all_files if f.startswith('sample') and f.lower().endswith(ACCEPTED_FORMATS)]

if not sample_images:
    # Check if there are any sample files with different extensions
    sample_files = [f for f in all_files if f.startswith('sample')]
    
    if sample_files:
        print(f"\n❌ INCOMPATIBLE FORMAT ERROR:")
        print(f"Found sample files with unsupported formats:")
        for file in sample_files:
            ext = os.path.splitext(file)[1] or 'no extension'
            print(f"  • {file} ({ext})")
        print(f"\n✅ Supported formats: {', '.join(ACCEPTED_FORMATS).upper()}")
        print(f"\n💡 SOLUTIONS:")
        print(f"1. Convert your image to a supported format")
        print(f"2. Update this Python code to handle your format")
        print(f"3. Use online image converters for quick conversion")
        raise FileNotFoundError("Sample image format not supported")
    else:
        print(f"\n❌ NO SAMPLE IMAGE FOUND:")
        print(f"No files starting with 'sample' were found.")
        print(f"\n📋 Available files: {', '.join(all_files) if all_files else 'None'}")
        print(f"\n✅ Expected format: sample.[extension]")
        print(f"Supported extensions: {', '.join(ACCEPTED_FORMATS).upper()}")
        print(f"\n💡 Make sure to upload an image file through the interface")
        raise FileNotFoundError("No 'sample' image found. Make sure you uploaded an image file.")

# Use the first found sample image
image_file = sample_images[0]
print(f"✅ Using image: {image_file}")

# Try to read the image
try:
    img = cv2.imread(image_file, cv2.IMREAD_GRAYSCALE)
    
    if img is None:
        print(f"\n❌ IMAGE READING ERROR:")
        print(f"Failed to read {image_file}")
        print(f"File size: {os.path.getsize(image_file)} bytes")
        print(f"\n🔧 Possible causes:")
        print(f"• File is corrupted")
        print(f"• Unsupported image format variant")
        print(f"• File is not a valid image")
        print(f"\n💡 Try re-uploading the image or use a different file")
        raise ValueError(f"Failed to read {image_file}. It might be corrupted or unsupported.")
    
    print(f"📊 Image info: {img.shape[1]}x{img.shape[0]} pixels")
    
    # Display the image
    plt.figure(figsize=(10, 8))
    plt.imshow(img, cmap='gray')
    plt.title(f"Grayscale of {image_file}")
    plt.axis('off')
    plt.tight_layout()
    plt.show()
    
    print(f"✅ Image processed successfully!")

except Exception as e:
    print(f"\n❌ PROCESSING ERROR:")
    print(f"Error: {str(e)}")
    print(f"\n🔧 Troubleshooting:")
    print(f"• Check if the image file is valid")
    print(f"• Try with a different image")
    print(f"• Ensure opencv-python is installed: pip install opencv-python")
    raise