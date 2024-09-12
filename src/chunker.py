def chunk_text(page_texts, min_chunk_size=2500, max_chunk_size=5000, overlap_size=500):
    import re

    chunks = []
    current_chunk = ""
    current_page_numbers = []
    current_line_numbers = []
    global_line_number = 1  # Global line number across all chunks

    for page_number, text in page_texts:
        paragraphs = re.split(r'\n+', text.strip())  # Splitting paragraphs based on newlines
        line_number = 1  # Local line number for the current page

        for para in paragraphs:
            para_length = len(para)
            para_line_count = para.count('\n') + 1  # Counting lines by newline symbols in the paragraph

            # If the current chunk plus the new paragraph exceeds max_chunk_size, finalize the current chunk
            if len(current_chunk) + para_length + 1 > max_chunk_size:
                if current_chunk:  # Avoid adding empty chunks
                    chunks.append((current_page_numbers, current_line_numbers, current_chunk.strip()))

                    # Adjust for min_chunk_size
                    if len(current_chunk.strip()) < min_chunk_size:
                        if chunks:
                            last_chunk_pages, last_chunk_lines, last_chunk_text = chunks[-1]
                            if len(last_chunk_text) + len(current_chunk.strip()) < max_chunk_size:
                                chunks[-1] = (last_chunk_pages + current_page_numbers, last_chunk_lines + current_line_numbers, last_chunk_text + '\n' + current_chunk.strip())
                            else:
                                chunks.append((current_page_numbers, current_line_numbers, current_chunk.strip()))

                    current_chunk = ""
                    current_page_numbers = []
                    current_line_numbers = []

                current_chunk = para + '\n'
                current_page_numbers = [page_number]
                current_line_numbers = [global_line_number]
            else:
                current_chunk += para + '\n'
                if page_number not in current_page_numbers:
                    current_page_numbers.append(page_number)
                current_line_numbers.append(global_line_number)

            global_line_number += para_line_count  # Increment the global line number based on the paragraph's line count
            line_number += para_line_count

        # Add overlap if the current chunk is close to max_chunk_size
        if len(current_chunk) >= max_chunk_size - overlap_size:
            chunks.append((current_page_numbers, current_line_numbers, current_chunk.strip()))
            current_chunk = ""
            current_page_numbers = []
            current_line_numbers = []

    if current_chunk:
        chunks.append((current_page_numbers, current_line_numbers, current_chunk.strip()))

    return chunks
