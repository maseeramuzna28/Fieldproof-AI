# FieldProof AI — Evidence-Driven Crop Disease Screening

**Team:** HckquaD  
**Institution:** Anjuman Institute of Technology and Management  
**Team leader:** Umaimah Rafa  
**Team members:** Maseera, Yusuf, Zuhair

## What works in this repository

This is a functional, browser-based MVP for the first stage of a farmer-friendly crop health workflow. It includes:

- Leaf image upload, drag-and-drop, and preview
- Crop selection and symptom checklist
- An evidence-aware flow that requests better evidence when the photo is marked unclear or observations are insufficient
- Cautious next-step guidance
- Downloadable screening summary
- Responsive layout for mobile and desktop

## Important limitation

**A trained AI image-classification model is not connected yet.** The current result is rule-based workflow logic, not an AI-generated disease prediction and not a validated diagnosis. The app deliberately avoids naming a disease from an uploaded image. Do not use this prototype to choose pesticides or treatments.

## Run locally

No build tools or package installation are needed.

1. Download or clone this repository.
2. Open `index.html` in a modern browser.
3. Upload a leaf image, select the crop, choose visible symptoms, and submit the form.

For a more consistent local server, run `python -m http.server 8000` from this folder and visit `http://localhost:8000`.

## Deploy on GitHub Pages

1. Create a public GitHub repository named `FieldProof-AI`.
2. Upload `index.html`, `styles.css`, `app.js`, and `README.md` to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**, choose `main` and `/ (root)`, then save.
5. Wait for the Pages URL to appear in the Pages section.

## Next implementation step

Connect and validate a plant-disease image model, evaluate it on representative crop images, and expose its confidence/uncertainty to the interface before presenting any model output as AI. Until then, keep results labelled as a prototype workflow.
