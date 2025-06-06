# file_handler.py
from tkinter import Tk, filedialog


def get_image_path():
    root = Tk()
    root.withdraw()
    file_path = filedialog.askopenfilename(
        title="choose photo",
        filetypes=[("Image Files", "*.png *.jpg *.jpeg *.bmp")]
    )
    return file_path