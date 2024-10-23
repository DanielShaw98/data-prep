import time
import json
from pdf_parser2 import parse_pdf
from chunker2 import chunk_text
from analyser2 import find_subsection

def generate_prompts(queries):
    static_prompt = (
        "If you cannot find anything relevant, please respond with 'nothing found.' "
    )

    # Generate the full prompts by appending the static part to each query
    full_prompts = [
        f"{query} {static_prompt}" for query in queries
    ]

    return full_prompts

def process_contract(contract_file, query_prompts, contract_index):
    # Parse the PDF
    page_texts = parse_pdf(contract_file)

    # Chunk the text
    chunks = chunk_text(page_texts)

    # List to store all outputs for this contract
    all_outputs = []

    # Iterate through each query
    for query_index, prompt in enumerate(query_prompts):
        print(f"Processing Contract {contract_index + 1}/{len(contract_files)} with Query {query_index + 1}/{len(query_prompts)}")

        # Iterate through each chunk
        for i, chunk in enumerate(chunks):
            print(f"Processing chunk {i + 1}/{len(chunks)}")

            # Create the system message
            system_message = {
                "role": "system",
                "content": (
                    "You are Legal AI. Your job is to help lawyers by identifying specific clauses in merger and acquisition contracts. "
                    "You will be provided with a user prompt and a text chunk from a contract. "
                    "Please identify the desired clauses and also provide an explanation for this choice based on the prompt. "
                    "Use the format of: Clause: 'clause text' Explanation: 'your explanation'. "
                    "If the requested clause cannot be found, please respond with 'nothing found.' "
                )
            }

            # Create the user message
            user_message = {
                "role": "user",
                "content": f"Prompt: {prompt}\n\n Chunk: {chunk}"
            }

            # Find relevant clauses in the chunk
            result = find_subsection(prompt, chunk)
            # relevant_chunks = []

            # if result:
            #     # Flatten the results into the required format
            #     results = result.get("entries", [])
            #     for res in results:
            #         relevant_chunks.append({
            #             "clause": res.get("clause"),
            #             "explanation": res.get("explanation")
            #         })

            # Create the output for the current chunk
            output = {
                "system_message": system_message,
                "user_query": user_message,
                "assistant_output": result if result else "Nothing found."
            }

            # Append the output to the list of all outputs
            all_outputs.append(output)

            # Print the output for the current chunk
            # print(json.dumps(output, indent=4))

            time.sleep(1)  # Add a delay between requests to avoid hitting rate limits

    return all_outputs

def main(contract_files, queries):
    output_file = '../data/outputs/unstructured_outputs/unstructured_outputs(1).json'  # Path where the outputs will be saved

    # Generate the full prompts from the queries
    query_prompts = generate_prompts(queries)

    # List to store outputs from all contracts and queries
    final_outputs = []

    # Iterate over each contract
    for contract_index, contract_file in enumerate(contract_files):
        # Process the contract with all queries
        contract_outputs = process_contract(contract_file, query_prompts, contract_index)
        # Add the contract outputs to the final list
        final_outputs.extend(contract_outputs)

    # Write all outputs to a JSON file (this wipes previous content)
    with open(output_file, 'w') as f:
        json.dump(final_outputs, f, indent=4)

    print(f"All outputs have been saved to {output_file}")

if __name__ == "__main__":
    contract_files = [
        '../data/contracts/merger-agreement-1.pdf',
        # '../data/contracts/merger-agreement-2.pdf',
        # '../data/contracts/merger-agreement-3.pdf',
        # '../data/contracts/merger-agreement-4.pdf',
        # '../data/contracts/merger-agreement-5.pdf',
        # '../data/contracts/merger-agreement-6.pdf',
        # '../data/contracts/merger-agreement-7.pdf'
    ]

    queries = [
        "Review the provided chunk and identify all clauses related to termination rights and conditions. ",
        # "Review the provided chunk and identify all clauses related to representations and warranties. ",
        # "Review the provided chunk and identify all clauses related to indemnification. ",
        # "Review the provided chunk and identify all clauses related to closing conditions. ",
        # "Review the provided chunk and identify all clauses related to Material Adverse Change (MAC) provisions. ",
        # "Review the provided chunk and identify all clauses related to purchase price adjustments. ",
        # "Review the provided chunk and identify all clauses related to non-compete and non-solicitation agreements. ",
        # "Review the provided chunk and identify all clauses related to confidentiality and non-disclosure obligations. ",
        # "Review the provided chunk and identify all clauses related to escrow or holdback provisions. ",
        # "Review the provided chunk and identify all clauses related to dispute resolution mechanisms. ",
        # "Review the provided chunk and identify all clauses related to exclusivity. ",
        # "Review the provided chunk and identify all clauses related to employment agreements. "
    ]

    main(contract_files, queries)
