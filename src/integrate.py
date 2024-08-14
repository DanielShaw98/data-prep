from pdf_parser import parse_pdf, get_metadata
from chunker import chunk_text

def main():
    # Path to your PDF file
    file_path = '../data/contracts/Vendor_Agreement_Template.pdf'

    # Parse the PDF to get text and page texts
    contract_text, page_texts = parse_pdf(file_path)
    print("Contract Text Parsed Successfully")
    print(f"Total length of parsed text: {len(contract_text)} characters")

    # Get metadata
    metadata = get_metadata(file_path)
    print("Metadata:", metadata)
    print(f"Total Pages: {metadata['page_count']}")

    # Chunk the text
    chunks = chunk_text(page_texts)
    print(f"Text Chunked into {len(chunks)} chunks")

    # Print a few chunks for verification
    for i, (pages, chunk) in enumerate(chunks):
        chunk_length = len(chunk)
        page_range = f"Pages {min(pages)} to {max(pages)}"
        print(f"--- Chunk {i + 1} ---")
        print(f"Size: {chunk_length} characters")
        print(f"Page Range: {page_range}")
        # print("Preview of Chunk Content:")
        # print(chunk[:500])  # Print the first 500 characters of each chunk
        print("\n")

if __name__ == "__main__":
    main()
