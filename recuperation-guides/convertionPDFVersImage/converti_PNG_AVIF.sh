#!/usr/bin/env bash

# This script converts each generated PNG to two AVIF sizes:
#   - 588px wide (suffix: _588.avif)
#   - 234px wide (suffix: _234.avif)
# After conversion, the PNG file is deleted.

# Loop through all PNGs in the directory
for png in *.png; do
    # Skip if no PNG files exist
    [[ ! -e "$png" ]] && continue

    base="${png%.png}"

    out_origine="${base}-origine.avif"
    out_588="${base}-588.avif"
    out_234="${base}-234.avif"

    echo "Processing $png → $out_origine / $out_588 / $out_234"

    # Convert to AVIF
    convert "$png" -quality 80 "$out_origine"

    # Convert to AVIF at 588px width
    convert "$png" -resize 588x -quality 80 "$out_588"

    # Convert to AVIF at 234px width
    convert "$png" -resize 234x -quality 80 "$out_234"

    # Remove the PNG after conversion
    rm "$png"
done

echo "Done! All PNGs converted and removed."
