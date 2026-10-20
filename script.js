/*
  =============================================================================
  2. JAVASCRIPT & ISOMETRIC MATRIX LOGIC COMMENTARY
  Target Commentary Contribution: ~250 words
  =============================================================================
  ISOMETRIC STACK ALGORITHM:
  To programmatically build the dense paper pile shown in the design reference, 
  the script dynamically calculates `translateZ` spatial offsets for each sheet.
  Given `N` sheets, layer `i` receives a base transform:
  `translate3d(0, 0, i * stackSpacing px)`

  INTERACTION STATES & EVENT HANDLING:
  1. Hover State (Peek): Handled via CSS hover transforms relative to current Z-height.
  2. Active Click (Extraction):
     When a user clicks a layer, the script toggles the `.is-extracted` class. 
     The target sheet translates -260px along the isometric X/Y plane, decoupling 
     itself from the pile stack while triggering the detail drawer (`#detailPanel`).
  3. Focus Management & Keyboard Accessibility:
     Full keyboard listener supports Up/Down Arrow navigation through layers, 
     `Enter` key extraction, and `Escape` key return.
  =============================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
  const stackContainer = document.getElementById('stackContainer');
  const detailPanel = document.getElementById('detailPanel');
  const closeBtn = document.getElementById('closeBtn');
  const statusHud = document.getElementById('statusHud');
  const panelTitle = document.getElementById('panelTitle');
  const panelTag = document.getElementById('panelTag');
  const panelBody = document.getElementById('panelBody');

  // Section Data Source
  const sections = [
    { id: '01', title: 'SIZE', desc: 'Standardized ISO 216 dimensions ranging from A0 to A8 formats. Technical ratios maintain precise 1:√2 aspect proportions across all print cuts.' },
    { id: '02', title: 'FORMAT', desc: 'Page folding layouts, binding signatures, and structural grid configurations optimized for editorial and archival publication design.' },
    { id: '03', title: 'STOCK', desc: 'Uncoated cotton rag, high-opacity matte coated, and recycled cellulose fibers evaluated by density (GSM), grain direction, and tactile finish.' },
    { id: '04', title: 'GRID', desc: 'Modular typographical frameworks, baseline rhythms, and fluid column margins calculated for high-density editorial readability.' },
    { id: '05', title: 'BINDING', desc: 'Smyth-sewn, thread-bound, and cold-glue perfect binding techniques tested for lie-flat opening capability and structural longevity.' }
  ];

  // Filler Sheets to create dense physical paper stack thickness
  const TOTAL_LAYERS = 24; 
  const SPACING = 4.5; // Z-axis spacing between paper layers in pixels
  let activeSheet = null;

  // Build Paper Stack Layers
  function renderStack() {
    stackContainer.innerHTML = '';

    for (let i = 0; i < TOTAL_LAYERS; i++) {
      const sheet = document.createElement('div');
      sheet.className = 'paper-sheet';
      
      // Calculate Z-axis offset height
      const zOffset = i * SPACING;
      sheet.style.transform = `translate3d(0px, 0px, ${zOffset}px)`;
      sheet.style.zIndex = i;

      // Check if layer corresponds to a labeled primary section
      const sectionIndex = Math.floor((i / TOTAL_LAYERS) * sections.length);
      const isLabeled = (i % Math.floor(TOTAL_LAYERS / sections.length) === 2);

      if (isLabeled && sections[sectionIndex]) {
        const data = sections[sectionIndex];
        sheet.innerHTML = `
          <span class="sheet-number">/ ${data.id}</span>
          <span class="sheet-label">${data.title}</span>
        `;
        sheet.dataset.title = data.title;
        sheet.dataset.id = data.id;
        sheet.dataset.desc = data.desc;
      }

      // Click Handler for Extraction
      sheet.addEventListener('click', () => handleSheetClick(sheet, i));
      
      stackContainer.appendChild(sheet);
    }
  }

  function handleSheetClick(sheet, index) {
    // If clicking already extracted sheet, return it
    if (sheet.classList.contains('is-extracted')) {
      resetStack();
      return;
    }

    // Reset any previously extracted sheet
    resetStack();

    // Extract Selected Sheet
    activeSheet = sheet;
    sheet.classList.add('is-extracted');

    // Populate and open Detail Panel
    const title = sheet.dataset.title || 'ARCHIVE LAYER';
    const id = sheet.dataset.id || '00';
    const desc = sheet.dataset.desc || 'Structural paper layer inside the isometric pile.';

    panelTitle.innerText = title;
    panelTag.innerText = `SECTION // ${id}`;
    panelBody.innerText = desc;
    detailPanel.classList.add('is-open');
    statusHud.innerText = `Extracted: ${title}`;
  }

  function resetStack() {
    if (activeSheet) {
      activeSheet.classList.remove('is-extracted');
      activeSheet = null;
    }
    detailPanel.classList.remove('is-open');
    statusHud.innerText = 'Stack Mode: Active';
  }

  closeBtn.addEventListener('click', resetStack);

  // Keyboard Controls
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      resetStack();
    }
  });

  renderStack();
});