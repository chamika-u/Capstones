# FRMS Proposal Diagrams

Editable Mermaid sources and high-resolution exports for the **Faculty Resource Management System (FRMS)** Capstone Project proposal.

## Contents

| File | Figure | Description |
|------|--------|-------------|
| `src/fig4-1-er.mmd` | Figure 4.1 | Entity-Relationship (ER) diagram |
| `src/fig4-2-usecase.mmd` | Figure 4.2 | Use Case diagram |
| `src/fig4-3-dfd0.mmd` | Figure 4.3 | Context-level (Level 0) Data Flow Diagram |
| `src/fig4-4-dfd1.mmd` | Figure 4.4 | Level 1 Data Flow Diagram |

Rendered output is written to `output/` in two formats:

- `*.svg` — vector, scalable (ideal for digital submission / web)
- `*.png` — 3× high-resolution raster on a white background (ideal for Microsoft Word)

## Regenerating the diagrams

Requirements: **Node.js 18+** and **Google Chrome** (used as the headless rendering engine).

```powershell
cd diagrams
npm install            # first time only
npm run build:diagrams
```

The script reads every `.mmd` file in `src/` and writes both an SVG and a PNG into `output/`.

## Configuration

- `mermaid-config.json` — theme (monochrome/greyscale-friendly), **Times New Roman** font, and layout spacing to match the proposal document.
- `puppeteer-config.json` — points Puppeteer at the locally installed Google Chrome and applies the required sandbox flags.

> **Note:** If Chrome is not installed at `C:\Program Files\Google\Chrome\Application\chrome.exe`, update `executablePath` in `puppeteer-config.json`, or run `npm install puppeteer` to let Puppeteer manage its own browser.

## Inserting into the proposal (Word)

1. Open `output/fig4-1-er.png` … `output/fig4-4-dfd1.png`.
2. In Word, insert each image under the matching figure caption (Figure 4.1 – Figure 4.4) in Section 4 of the proposal.
3. Set the image to fit within the page width (approximately 15–16 cm) and keep the caption **centred and bold**.
