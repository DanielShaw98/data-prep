from pdf_parser import parse_pdf, get_metadata
from chunker import chunk_text

def main():
    file_path = '../data/contracts/Form_Of_Merger_Agreement.pdf'

    contract_text, page_texts = parse_pdf(file_path)
    print("Contract Text Parsed Successfully")
    print(f"Total length of parsed text: {len(contract_text)} characters")

    metadata = get_metadata(file_path)
    print("Metadata:", metadata)
    print(f"Total Pages: {metadata['page_count']}")

    chunks = chunk_text(page_texts)
    print(f"Text Chunked into {len(chunks)} chunks")

    for i, (pages, lines, chunk) in enumerate(chunks):
        chunk_length = len(chunk)
        page_range = f"Pages {min(pages)} to {max(pages)}"
        line_range = f"Lines {min(lines)} to {max(lines)}"
        print(f"--- Chunk {i + 1} ---")
        print(f"Size: {chunk_length} characters")
        print(f"Page Range: {page_range}")
        print(f"Line Range: {line_range}")
        # Uncomment the following line to print a preview of the chunk content
        # print(chunk[:500])  # Print the first 500 characters of each chunk
        print("\n")

if __name__ == "__main__":
    main()
