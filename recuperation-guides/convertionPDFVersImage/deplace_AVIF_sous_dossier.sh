#!/usr/bin/env bash

# Usage: ./deplace_AVIF_sous_dossier.sh listeIdGuideNomPDF.txt
# mapping format: folder name : pdf_filename.pdf

INPUT_LIST="$1"

if [[ -z "$INPUT_LIST" ]]; then
    echo "Usage: $0 <mapping_file>"
    exit 1
fi

while IFS= read -r line; do
    [[ -z "$line" ]] && continue

    # Extract folder name (left of the first " : ")
    folder=$(echo "$line" | sed -E 's/^[[:space:]]*(.+)[[:space:]]+:[[:space:]]+(.+)$/\1/')
    # Extract pdf filename (right of the first " : ")
    pdf=$(echo "$line" | sed -E 's/^[[:space:]]*(.+)[[:space:]]+:[[:space:]]+(.+)$/\2/')

    if [[ -z "$folder" || -z "$pdf" ]]; then
        echo "Skipping malformed line: $line"
        continue
    fi

    base=$(basename "$pdf" .pdf)

    avif_origine="${base}-origine.avif"
    avif_588="${base}-588.avif"
    avif_234="${base}-234.avif"

    # Ensure folder exists
    mkdir -p "$folder"

    # Move files if they exist
    for f in "$avif_588" "$avif_234" "$avif_origine"; do
        if [[ -f "$f" ]]; then
            echo "→ Moving $f → $folder/"
            mv "$f" "$folder/"
        else
            echo "Warning: $f not found."
        fi
    done

done < "$INPUT_LIST"

echo "Done moving AVIF files."
