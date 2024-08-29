import time
import json
from pdf_parser import parse_pdf, get_metadata
from chunker import chunk_text
from analyser import find_subsection

def main():
    file_path = '../data/contracts/Form_Of_Merger_Agreement.pdf'
    output_file = '../data/outputs/outputs.json'

    # Parse the PDF
    contract_text, page_texts = parse_pdf(file_path)
    metadata = get_metadata(file_path)

    # Chunk the text
    chunks = chunk_text(page_texts)

    # Define the prompt
    prompt = (
        "Review the provided text and identify all clauses related to termination conditions. "
        "Return the exact start and end line numbers of the relevant clause within the chunk. "
        "If you cannot find anything relevant, please respond with 'nothing found.' "
        "Please provide details in the following JSON format: "
        "{"
        "  \"relevant_chunks_found\": <number>,"
        "  \"entries\": ["
        "    {"
        "      \"page\": <page_number>,"
        "      \"line_start\": <clause_start_line_within_chunk>,"
        "      \"line_end\": <clause_end_line_within_chunk>,"
        "      \"clause\": <clause_text>,"
        "      \"explanation\": <explanation_text>"
        "    }"
        "  ]"
        "}"
    )

    # List to store all outputs
    all_outputs = []

    # Iterate through each chunk
    for i, (pages, lines, chunk) in enumerate(chunks):
        # print(f"Processing chunk {i + 1}/{len(chunks)}")

        # Create the system message
        system_message = {
            "role": "system",
            "content": (
                "You are Legal AI. Your job is to help lawyers by identifying specific clauses in merger and acquisition contracts. "
                "Please identify the desired clauses and also provide an explanation for this choice based on the prompt. "
                "Return the exact start and end line numbers of the relevant clause within the chunk. "
                "If the requested clause cannot be found, please respond with 'nothing found.' "
                "Otherwise please provide a response in the following JSON format: "
                "{"
                "  \"relevant_chunks_found\": <number>,"
                "  \"entries\": ["
                "    {"
                "      \"page\": <page_number>,"
                "      \"line_start\": <clause_start_line_within_chunk>,"
                "      \"line_end\": <clause_end_line_within_chunk>,"
                "      \"clause\": <clause_text>,"
                "      \"explanation\": <explanation_text>"
                "    }"
                "  ]"
                "}"
            )
        }

        # Create the user message
        user_message = {
            "role": "user",
            "content": (
                f"Prompt: {prompt}\n\n Chunk: {chunk}\n\n Chunk Meta-Data:\n"
                f"Page Start: {pages[0]}\n Page End: {pages[-1]}\n"
                f"Line Start: {lines[0]}\n Line End: {lines[-1]}"
            )
        }

        # Find relevant clauses in the chunk
        result = find_subsection(prompt, chunk, pages, lines)
        relevant_chunks = []

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

        # Create the output for the current chunk
        output = {
            "system_message": system_message,
            "user_query": user_message,
            "assistant_output": relevant_chunks if relevant_chunks else "Nothing found"
        }

        # Append the output to the list of all outputs
        all_outputs.append(output)

        # Print the output for the current chunk
        print(json.dumps(output, indent=4))

        time.sleep(1)  # Add a delay between requests to avoid hitting rate limits

    # Write all outputs to a JSON file
    with open(output_file, 'w') as f:
        json.dump(all_outputs, f, indent=4)

    print(f"All outputs have been saved to {output_file}")

if __name__ == "__main__":
    main()
