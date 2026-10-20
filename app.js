const form = document.querySelector('#screening-form');
const photoInput = document.querySelector('#leaf-photo');
const preview = document.querySelector('#image-preview');
const uploadBox = document.querySelector('#upload-box');
const fileName = document.querySelector('#file-name');
let selectedImageUrl = null;

photoInput.addEventListener('change', () => {
  const file = photoInput.files && photoInput.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    photoInput.value = '';
    fileName.textContent = 'Please choose an image file.';
    return;
  }
  if (selectedImageUrl) URL.revokeObjectURL(selectedImageUrl);
  selectedImageUrl = URL.createObjectURL(file);
  preview.src = selectedImageUrl;
  preview.hidden = false;
  fileName.textContent = file.name;
  uploadBox.querySelector('.upload-icon').textContent = '✓';
});

['dragenter', 'dragover'].forEach(type => uploadBox.addEventListener(type, event => {
  event.preventDefault(); uploadBox.classList.add('dragover');
}));
['dragleave', 'drop'].forEach(type => uploadBox.addEventListener(type, event => {
  event.preventDefault(); uploadBox.classList.remove('dragover');
}));
uploadBox.addEventListener('drop', event => {
  const file = event.dataTransfer.files[0];
  if (!file || !file.type.startsWith('image/')) return;
  const transfer = new DataTransfer(); transfer.items.add(file); photoInput.files = transfer.files;
  photoInput.dispatchEvent(new Event('change'));
});

function selectedSymptoms() {
  return [...document.querySelectorAll('input[name="symptom"]:checked')].map(input => input.value);
}
function setList(items) {
  const list = document.querySelector('#next-list'); list.replaceChildren();
  items.forEach(item => { const li = document.createElement('li'); li.textContent = item; list.appendChild(li); });
}

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!photoInput.files[0]) { photoInput.reportValidity(); return; }
  const crop = document.querySelector('#crop').value;
  const photoQuality = document.querySelector('#stage').value;
  const symptoms = selectedSymptoms();
  const notes = document.querySelector('#notes').value.trim();
  const needsMoreEvidence = photoQuality === 'unclear' || symptoms.length === 0 || symptoms.includes('unsure');
  const resultSection = document.querySelector('#result-section');
  const title = document.querySelector('#result-title');
  const copy = document.querySelector('#result-text');
  const evidence = document.querySelector('#evidence-text');
  const status = document.querySelector('#status-pill');
  const icon = document.querySelector('#result-icon');
  let actions;

  if (needsMoreEvidence) {
    title.textContent = 'More evidence needed';
    copy.textContent = 'The information provided is not enough for a useful preliminary screening. Avoid jumping to a disease conclusion; improve the photo or add clearer observations first.';
    status.textContent = 'LOW EVIDENCE'; icon.textContent = '↗';
    actions = ['Take a new photo in natural daylight, focusing on one affected leaf.', 'Capture both the upper and lower leaf surfaces, avoiding blur and harsh shadows.', 'Note which plants are affected and whether symptoms are spreading.', 'If symptoms worsen, show the plant to a local agricultural extension officer.'];
  } else {
    title.textContent = 'Symptoms recorded — cause not confirmed';
    copy.textContent = `Your ${crop} report records visible symptoms, but these signs can have several causes. This prototype does not compare the image with a trained disease model, so it cannot name a disease reliably.`;
    status.textContent = 'PRELIMINARY ONLY'; icon.textContent = '◎';
    actions = ['Photograph several affected leaves and one healthy-looking leaf for comparison.', 'Check whether symptoms appear on new growth, older leaves, or across the whole plant.', 'Avoid mixing or applying pesticides based on this screen alone.', 'Ask a qualified local agricultural adviser to confirm the cause before treatment.'];
  }
  evidence.textContent = `Crop: ${crop}. Selected observations: ${symptoms.length ? symptoms.map(s => ({spots:'spots or patches',yellow:'yellowing',wilting:'wilting or drooping',powder:'powdery / fuzzy layer',holes:'holes or chewed edges',unsure:'not sure'}[s])).join(', ') : 'none selected'}. Photo clarity: ${photoQuality === 'clear' ? 'marked clear by user' : 'marked unclear by user'}.${notes ? ` Additional note: ${notes}` : ''} Image uploaded: ${photoInput.files[0].name}.`;
  setList(actions);
  resultSection.hidden = false;
  resultSection.scrollIntoView({behavior:'smooth', block:'start'});
});

document.querySelector('#start-over').addEventListener('click', () => {
  form.reset(); preview.hidden = true; preview.removeAttribute('src'); fileName.textContent = '';
  uploadBox.querySelector('.upload-icon').textContent = '↑';
  document.querySelector('#result-section').hidden = true;
  document.querySelector('#screening-form').scrollIntoView({behavior:'smooth', block:'start'});
});

document.querySelector('#download-summary').addEventListener('click', () => {
  const text = [
    'FieldProof AI — Crop Screening Summary',
    'Prototype result only — not an AI prediction or confirmed diagnosis.',
    '', document.querySelector('#result-title').textContent,
    document.querySelector('#result-text').textContent,
    '', 'Evidence:', document.querySelector('#evidence-text').textContent,
    '', 'Suggested next steps:', ...[...document.querySelectorAll('#next-list li')].map((li, i) => `${i + 1}. ${li.textContent}`),
    '', 'Do not apply pesticides based on this screen alone. Seek qualified local agricultural advice.'
  ].join('\n');
  const blob = new Blob([text], {type:'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(blob); const link = document.createElement('a');
  link.href = url; link.download = 'fieldproof-screening-summary.txt'; link.click(); URL.revokeObjectURL(url);
});
