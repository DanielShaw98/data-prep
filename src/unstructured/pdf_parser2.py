import fitz  # PyMuPDF

def parse_pdf(file_path):
    doc = fitz.open(file_path)
    text = ""
    for page_number in range(doc.page_count):
        page = doc.load_page(page_number)
        page_text = page.get_text()
        text += page_text  # Add each page's text to the overall contract text
    return text

def get_metadata(file_path):
    doc = fitz.open(file_path)
    metadata = doc.metadata
    metadata["page_count"] = doc.page_count
    return metadata
