import re

def chunk_text(text, min_chunk_size=1500, max_chunk_size=2500, overlap_size=500):

    chunks = []
    current_chunk = ""

    # Split the text into paragraphs
    paragraphs = re.split(r'\n+', text.strip())  # Splitting paragraphs based on newlines

    for para in paragraphs:
        para_length = len(para)

        # If the current chunk plus the new paragraph exceeds max_chunk_size, finalize the current chunk
        if len(current_chunk) + para_length + 1 > max_chunk_size:
            if current_chunk:  # Avoid adding empty chunks
                chunks.append(current_chunk.strip())

                # Adjust for min_chunk_size
                if len(current_chunk.strip()) < min_chunk_size and chunks:
                    last_chunk = chunks.pop()
                    current_chunk = last_chunk + '\n' + current_chunk.strip()

            current_chunk = para + '\n'
        else:
            current_chunk += para + '\n'

        # Add overlap if the current chunk is close to max_chunk_size
        if len(current_chunk) >= max_chunk_size - overlap_size:
            chunks.append(current_chunk.strip())
            current_chunk = ""

    # Append any remaining chunk
    if current_chunk:
        chunks.append(current_chunk.strip())

    return chunks
