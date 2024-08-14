def chunk_text(page_texts, min_chunk_size=300, max_chunk_size=800, overlap_size=75):
    import re

    chunks = []
    current_chunk = ""
    current_page_numbers = []
    current_line_numbers = []
    line_offset = 0

    for page_number, text in page_texts:
        paragraphs = re.split(r'\n\s*\n', text.strip())
        line_number = 1

        for para in paragraphs:
            para_length = len(para)
            para_lines = para.split('\n')
            para_line_count = len(para_lines)

            # If the current chunk plus the new paragraph exceeds max_chunk_size, finalize the current chunk
            if len(current_chunk) + para_length + 2 > max_chunk_size:
                if current_chunk:  # Avoid adding empty chunks
                    chunks.append((current_page_numbers, current_line_numbers, current_chunk.strip()))

                    # Check if the chunk is smaller than min_chunk_size and adjust
                    if len(current_chunk.strip()) < min_chunk_size:
                        # Optionally, merge with the next chunk if necessary
                        if chunks:
                            last_chunk_pages, last_chunk_lines, last_chunk_text = chunks[-1]
                            if len(last_chunk_text) + len(current_chunk.strip()) < max_chunk_size:
                                chunks[-1] = (last_chunk_pages + current_page_numbers, last_chunk_lines + current_line_numbers, last_chunk_text + '\n\n' + current_chunk.strip())
                            else:
                                chunks.append((current_page_numbers, current_line_numbers, current_chunk.strip()))
                    current_chunk = ""
                    current_page_numbers = []
                    current_line_numbers = []
                    line_offset = 0

                # Start a new chunk with the current paragraph
                current_chunk = para + '\n\n'
                current_page_numbers = [page_number]
                current_line_numbers = [line_number + line_offset]
            else:
                current_chunk += para + '\n\n'
                if page_number not in current_page_numbers:
                    current_page_numbers.append(page_number)
                current_line_numbers.append(line_number + line_offset)

            line_number += para_line_count
        line_offset = line_number - 1

        # Add overlap if the current chunk is close to max_chunk_size
        if len(current_chunk) >= max_chunk_size - overlap_size:
            chunks.append((current_page_numbers, current_line_numbers, current_chunk.strip()))
            current_chunk = ""
            current_page_numbers = []
            current_line_numbers = []
            line_offset = 0

    # Add the last chunk if it's not empty
    if current_chunk:
        chunks.append((current_page_numbers, current_line_numbers, current_chunk.strip()))

    return chunks

if __name__ == "__main__":
    sample_text = "Your contract text here..."
    sample_page_texts = [(1, sample_text)]  # Example page number and text
    chunks = chunk_text(sample_page_texts)
    print("Text Chunked into", len(chunks), "chunks")
