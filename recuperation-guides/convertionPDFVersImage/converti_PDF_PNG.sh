#!/usr/bin/env bash

# Usage: ./pdf_first_page_to_image.sh pdf_list.txt
# Each line in pdf_list.txt must contain a path to a PDF file.

INPUT_LIST="$1"

if [[ -z "$INPUT_LIST" ]]; then
    echo "Usage: $0 <pdf_list_file>"
    exit 1
fi

while IFS= read -r pdf; do
    # Skip empty lines
    [[ -z "$pdf" ]] && continue

    if [[ ! -f "$pdf" ]]; then
        echo "File not found: $pdf"
        continue
    fi

    # Remove extension and path
    base=$(basename "$pdf" .pdf)

    # Output image name
    out="${base}.png"

    echo "Converting first page of $pdf → $out"

    # Using ImageMagick: page index 0 = first page
    convert "${pdf}[0]" "$out"

done < "$INPUT_LIST"
