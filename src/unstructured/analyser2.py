from dotenv import load_dotenv
from openai import OpenAI
import os
import json

# Load API key from .env file
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI client
client = OpenAI(api_key=api_key)

def find_subsection(prompt, chunk):
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Ensure this model is correct
            messages=[
                {"role": "system", "content": (
                    "You are Legal AI. Your job is to help lawyers by identifying specific clauses in merger and acquisition contracts. "
                    "You will be provided with a user prompt and a text chunk from a contract. "
                    "Please identify the desired clauses and also provide an explanation for this choice based on the prompt. "
                    "Use the format of: Clause: 'clause text' Explanation: 'your explanation'. "
                    "If the requested clause cannot be found, please respond with 'nothing found.' "
                )},
                {"role": "user", "content": (
                    f"{prompt}\n\n--- Text Chunk ---\n{chunk}"
                )}
            ],
            # max_tokens=1500,
            temperature=0.01,
        )

        # Extract and clean the content from the response
        content = response.choices[0].message.content.strip()

        # Handle cases where the content is "nothing found" or empty
        if content.lower() != "nothing found" or not content.strip():
            return content
        else:
            return None

        # # Convert single quotes to double quotes
        # content = content.replace("'", '"')

        # # Parse the response as JSON
        # try:
        #     result = json.loads(content)
        #     # Check if there are relevant chunks
        #     if result.get("relevant_chunks_found", 0) > 0 and result.get("entries"):
        #         return result
        #     else:
        #         return None
        # except json.JSONDecodeError:
        #     return None

    except Exception as e:
        print(f"An error occurred: {e}")
        return None

if __name__ == "__main__":
    prompt = "Review the provided chunk and identify all clauses related to termination rights and conditions. If you cannot find anything, please respond with 'nothing found.'"
    sample_text = "Transaction but all the conditions therein have been satisfied or complied with, \nor confirmed no such clearance is required in accordance with the applicable \ncompetition legislation, or has not objected to the Transaction within the time \nperiod prescribed by law.\n227876-4-1460-v9.0 \n- 30 - \n70-40688062 \n \nFor the purposes of clauses 4.1.10 to 4.1.12 (inclusive) only, \"Transaction\" shall \nbe limited to the part or parts of the Transaction required to be notified to the \nCommission, COFECE or the competent competition authority of Vietnam (as \nappropriate). \nNo material breach \n4.1.13 no Purchaser Covenant Breach and no Purchaser Material Breach having \noccurred; and \n4.1.14 no Chrysaor Covenant Breach and no Chrysaor Material Breach having \noccurred. \n4.2 \nAny Regulatory Condition or Antitrust Condition may be waived at any time on or \nbefore 17.00 on the Longstop Date by written agreement of the Company and the \nPurchaser.  Any Chrysaor Material Breach may be waived at any time on or before \n17.00 on the Longstop Date by the Purchaser by notice in writing to the Company.  Any \nPurchaser Material Breach may be waived at any time on or before 17.00 on the \nLongstop Date by the Company by notice in writing to the Purchaser.   \n4.3 \nIf, at any time, any party becomes aware of a fact, matter or circumstance that could \nreasonably be expected to prevent or delay the satisfaction of a Condition, it shall \ninform the others of the fact, matter or circumstance as soon as reasonably practicable. \n4.4 \nIf a Condition has not been satisfied or (if capable of waiver) waived by 17.00 on the \nLongstop Date or becomes impossible to satisfy before that time, either the \nHarbour/Chrysaor Parties or the Purchaser may terminate this Agreement by notice in \nwriting to that effect to the other, save that the Harbour/Chrysaor Parties may only \nterminate this Agreement: (i) on the basis of the Whitewash Condition not having been \nsatisfied by 17.00 on the Longstop Date or having become impossible to satisfy before \nthat time; and (ii) on the basis of the Circular Condition and/or the FCA Admission \nCondition not having been satisfied by 17.00 on the Longstop Date or having become \nimpossible to satisfy before that time, in each case, only if the Harbour/Chrysaor Parties \nhave complied with the relevant provisions of clause 5 and/or the Purchaser has not \ncomplied with the relevant provisions of clause 5."
    result = find_subsection(prompt, sample_text)
    print("Found subsection:", result)
