import fitz  # PyMuPDF

def parse_pdf(file_path):
    doc = fitz.open(file_path)
    text = ""
    page_texts = []
    for page_number in range(doc.page_count):
        page = doc.load_page(page_number)
        page_text = page.get_text()
        text += f"\n--- Page {page_number + 1} ---\n"
        text += page_text
        page_texts.append((page_number + 1, page_text))  # Use page_number + 1 for 1-based index
    return text, page_texts

def get_metadata(file_path):
    doc = fitz.open(file_path)
    metadata = doc.metadata
    metadata["page_count"] = doc.page_count
    return metadata

if __name__ == "__main__":
    file_path = '../data/contracts/Vendor_Agreement_Template.pdf'
    contract_text, page_texts = parse_pdf(file_path)
    metadata = get_metadata(file_path)
    print("Metadata:", metadata)
    print(f"Total length of parsed text: {len(contract_text)} characters")
    print("Contract Text Parsed:", contract_text[:1000])  # Print the first 1000 characters for preview
