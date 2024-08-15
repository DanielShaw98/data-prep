import time
import json
from pdf_parser import parse_pdf, get_metadata
from chunker import chunk_text
from analyser import find_subsection

def main():
    file_path = '../data/contracts/Form_Of_Merger_Agreement.pdf'

    # Parse the PDF
    contract_text, page_texts = parse_pdf(file_path)
    print(f"Total length of parsed text: {len(contract_text)} characters")
    metadata = get_metadata(file_path)
    print("Metadata:", metadata)
    print(f"Total Pages: {metadata['page_count']}")

    # Chunk the text
    chunks = chunk_text(page_texts)
    print("Text Chunked into", len(chunks), "chunks")

    # Define the prompt
    prompt = (
        "Review the provided text and identify all clauses related to termination conditions. "
        "If you cannot find anything relevant, please respond with 'nothing found.' "
        "Please provide details in the following JSON format: "
        "{"
        "  \"relevant_chunks_found\": <number>,"
        "  \"entries\": ["
        "    {"
        "      \"page\": <page_number>,"
        "      \"line_start\": <start_line_number>,"
        "      \"line_end\": <end_line_number>,"
        "      \"clause\": <clause_text>,"
        "      \"explanation\": <explanation_text>"
        "    }"
        "  ]"
        "}"
    )

    # List to store relevant results
    relevant_chunks = []

    # Process each chunk and collect relevant results
    for i, (pages, lines, chunk) in enumerate(chunks):
        print(f"Processing chunk {i + 1}/{len(chunks)}")
        result = find_subsection(prompt, chunk, pages, lines)
        if result:
            # Flatten the results into the required format
            results = result.get("entries", [])
            for res in results:
                relevant_chunks.append({
                    "page": res.get("page"),
                    "line_start": res.get("line_start"),
                    "line_end": res.get("line_end"),
                    "clause": res.get("clause"),
                    "explanation": res.get("explanation")
                })
        time.sleep(1)  # Add a delay between requests to avoid hitting rate limits

    # Display relevant chunks as JSON
    if relevant_chunks:
        print("\nDisclaimer: I may not always be correct in my findings, and it is always a good idea for you to verify the results yourself.")
        print(f"\nRelevant Chunks Found: {len(relevant_chunks)}")
        print(json.dumps(relevant_chunks, indent=4))
    else:
        print("\nDisclaimer: I may not always be correct in my findings, and it is always a good idea for you to verify the results yourself.")
        print("No relevant chunks found.")

if __name__ == "__main__":
    main()
