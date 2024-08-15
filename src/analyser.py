from dotenv import load_dotenv
from openai import OpenAI
import os
import json

# Load API key from .env file
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI client
client = OpenAI(api_key=api_key)

def find_subsection(prompt, chunk, pages, lines):
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Ensure this model is correct
            messages=[
                {"role": "system", "content": (
                    "You are Legal AI. Your job is to help lawyers by identifying specific clauses in merger and acquisition contracts. "
                    "Please identify the desired clauses and also provide an explanation for this choice based on the prompt. "
                    "If the requested clause cannot be found, please respond with 'nothing found.' "
                    "Otherwise please provide a response in the following JSON format: "
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
                )},
                {"role": "user", "content": (
                    f"{prompt}\n\n--- Text Chunk ---\n{chunk}\n\n--- Pages ---\n{pages}\n\n--- Lines ---\n{lines}"
                )}
            ],
            # max_tokens=1500,
            temperature=0.01,
        )

        # Extract and clean the content from the response
        content = response.choices[0].message.content.strip()

        # Handle cases where the content is "nothing found" or empty
        if content.lower() == "nothing found" or not content.strip():
            return None

        # Convert single quotes to double quotes
        content = content.replace("'", '"')

        # Parse the response as JSON
        try:
            result = json.loads(content)
            # Check if there are relevant chunks
            if result.get("relevant_chunks_found", 0) > 0 and result.get("entries"):
                return result
            else:
                return None
        except json.JSONDecodeError:
            return None

    except Exception as e:
        print(f"An error occurred: {e}")
        return None

if __name__ == "__main__":
    prompt = "Find the clause that describes the termination conditions in this contract. If you cannot find anything, please respond with 'nothing found.'"
    sample_text = "Your contract text here..."
    result = find_subsection(prompt, sample_text)
    print("Found subsection:", result)
