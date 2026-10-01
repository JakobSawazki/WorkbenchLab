# Learning Map Asset

Tool: built-in image generation, edited non-destructively in two passes.

Reference: `assets/bpe6-relief-map.png`.
Final project assets: `assets/bpe6-settlement-map.png` and
`assets/bpe6-settlement-map.webp` (1672 x 941).
WebP encoding: quality 88, no cropping or resizing.

## Initial Direction

Photorealistic graphite-and-metal relief diorama. Replace the five database
monuments with progressively growing settlements: blue tiny village, mint
village, gold town, violet city, coral largest city. Preserve landscape,
camera, terrain and accent colors. A single route must connect them in order;
no text or UI baked into the bitmap. HTML buttons remain independent of the image.

## Final Correction Prompt

Precise edit of the supplied photorealistic miniature learning map. Preserve all five settlements, their blue/mint/gold/violet/coral colors, their increasingly large sizes, terrain, camera, photographic detail, lighting and image dimensions. Fix ONLY the inter-settlement road graph. There must be exactly FOUR inter-settlement road segments: blue village (left lower) to mint village (left upper), mint village to gold town (middle lower), gold town to violet city (right upper), violet city to coral city (right lower). REMOVE COMPLETELY the visible direct road from the blue village to the gold town across the lower-left river; replace its bridge and road with natural river, rocks and topography. REMOVE COMPLETELY the direct road from gold town to coral city across the lower-right river; replace it with natural river, rocks and topography. Keep the correct blue-to-mint, mint-to-gold, gold-to-violet and violet-to-coral segments. This creates a SINGLE zigzag path through the five settlements, not a branched graph. No extra path, no shortcuts, no additional bridge between nonadjacent settlements. Do not add text, numbers or UI. Also ensure the coral city is fully inside the image with a small right margin; gently pull only its extreme rightmost buildings inward if needed. Everything else remains unchanged.
