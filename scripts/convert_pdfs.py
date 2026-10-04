import fitz  # PyMuPDF
import os
import glob

projects_to_convert = [
    ("public/projects/academic/CB/gallery", "CB"),
    ("public/projects/academic/Hansapocene/gallery", "Hansapocene"),
    ("public/projects/academic/Steglitzer-Kreisel/gallery", "Steglitzer-Kreisel"),
]

for gallery_dir, proj_name in projects_to_convert:
    pdf_files = glob.glob(os.path.join(gallery_dir, "*.pdf"))
    for pdf_path in pdf_files:
        print(f"Converting {pdf_path}...")
        doc = fitz.open(pdf_path)
        print(f"Total pages: {len(doc)}")
        for i, page in enumerate(doc):
            # Render at 2.0x (144 dpi) or 3.0x (216 dpi) for high quality
            pix = page.get_pixmap(dpi=150)
            output_filename = f"page_{i+1:02d}.jpg"
            output_path = os.path.join(gallery_dir, output_filename)
            pix.save(output_path)
            print(f"  Saved {output_path} ({pix.width}x{pix.height})")
        doc.close()

print("PDF conversion completed successfully!")
