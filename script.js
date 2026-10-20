/*
  =============================================================================
  JAVASCRIPT & ISOMETRIC STACK ENGINE COMMENTARY
  Word Count Target Contribution: ~270 words
  =============================================================================
  1. DENSE PAPER STACK GENERATION:
     To replicate the line-art density in the reference image (which consists of 30+ 
     thin layered sheets), this script dynamically spawns 36 `.paper-sheet` elements. 
     Each sheet is assigned a Z-axis offset in orthographic 3D space:
     `translateZ(i * 3.5px)`
     
     This creates a continuous vertical column of crisp paper edges.

  2. ISOMETRIC MOTION ALGORITHM:
     Because the stack container uses an orthographic matrix transform (`rotateX(60deg) 
     rotate(-45deg)`), translating an element along its local Y-axis (`translateY(...)`) 
     moves it along the screen's lower-left isometric vector line.
     - Hover State: Applies `translateY(45px)` offset.
     - Click Extraction: Applies `translateY(220px)` offset, decoupling the sheet 
       from the pile while populating and opening the specification drawer (`#drawer`).

  3. STATE MANAGEMENT & ACCESSIBILITY:
     - Clear Toggle State: Clicking an extracted sheet or pressing the `Escape` key 
       resets all active sheet transformations and smoothly hides the detail panel.
  =============================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
  const stackContainer = document.getElementById('stackContainer');
  const drawer = document.getElementById('drawer');
  const closeBtn = document.getElementById('closeBtn');
  const hudStatus = document.getElementById('hudStatus');
  const drawerTag = document.getElementById('drawerTag');
  const drawerTitle = document.getElementById('drawerTitle');
  const drawerDesc = document.getElementById('drawerDesc');
  const specDim = document.getElementById('specDim');
  const specWeight = document.getElementById('specWeight');
  const specFinish = document.getElementById('specFinish');

  // Labeled Sections Data
  const sectionsData = {
    'SIZE': {
      tag: 'SECTION // 01',
      desc: 'Standardized ISO 216 paper dimensions ranging from A0 to A8 formats. Maintains exact 1:√2 aspect proportions across all print cuts.',
      dim: '210 × 297 mm (A4)',
      weight: '120 GSM',
      finish: 'Uncoated Cotton Rag'
    },
    'FORMAT': {
      tag: 'SECTION // 02',
      desc: 'Page folding signatures, grid templates, and publication imposition configurations designed for editorial layout systems.',
      dim: '16-Page Signature',
      weight: '150 GSM',
      finish: 'Satin Matte Coated'
    },
    'STOCK': {
      tag: 'SECTION // 03',
      desc: 'Physical paper fiber composition, grain direction, and tactile surface opacity specs evaluated for print ink absorption.',
      dim: 'Bulk Density 1.3',
      weight: '300 GSM',
      finish: 'Textured Recycled Board'
    }
  };

  const TOTAL_SHEETS = 36;
  const SPACING = 3.5; // Z-spacing between sheets in pixels
  let activeSheet = null;

  // Generate Isometric Paper Pile
  function buildStack() {
    stackContainer.innerHTML = '';

    for (let i = 0; i < TOTAL_SHEETS; i++) {
      const sheet = document.createElement('div');
      sheet.className = 'paper-sheet';
      
      const zOffset = `${i * SPACING}px`;
      sheet.style.setProperty('--z-offset', zOffset);
      sheet.style.transform = `translateZ(${zOffset})`;
      sheet.style.zIndex = i;

      // Assign bold section labels at specific layer indexes
      if (i === 12) {
        sheet.innerHTML = `<div class="sheet-label">SIZE</div>`;
        sheet.dataset.label = 'SIZE';
      } else if (i === 20) {
        sheet.innerHTML = `<div class="sheet-label">FORMAT</div>`;
        sheet.dataset.label = 'FORMAT';
      } else if (i === 28) {
        sheet.innerHTML = `<div class="sheet-label">STOCK</div>`;
        sheet.dataset.label = 'STOCK';
      }

      // Sheet Click Listener
      sheet.addEventListener('click', () => handleSheetClick(sheet));

      stackContainer.appendChild(sheet);
    }
  }

  function handleSheetClick(sheet) {
    const label = sheet.dataset.label;

    // If clicking the already extracted sheet, return it
    if (sheet.classList.contains('is-extracted')) {
      resetStack();
      return;
    }

    resetStack();

    // Extract target sheet
    activeSheet = sheet;
    sheet.classList.add('is-extracted');

    // Update Drawer Data if labeled
    if (label && sectionsData[label]) {
      const data = sectionsData[label];
      drawerTag.innerText = data.tag;
      drawerTitle.innerText = label;
      drawerDesc.innerText = data.desc;
      specDim.innerText = data.dim;
      specWeight.innerText = data.weight;
      specFinish.innerText = data.finish;
    } else {
      drawerTag.innerText = 'LAYER // ARCHIVE';
      drawerTitle.innerText = 'UNLABELED STOCK';
      drawerDesc.innerText = 'Blank paper stock sheet inside the isometric proofing stack.';
      specDim.innerText = 'Custom Cut';
      specWeight.innerText = '80 GSM';
      specFinish.innerText = 'Standard Bond';
    }

    drawer.classList.add('is-open');
    hudStatus.innerText = `STATUS: EXTRACTED (${label || 'BLANK SHEET'})`;
  }

  function resetStack() {
    if (activeSheet) {
      activeSheet.classList.remove('is-extracted');
      activeSheet = null;
    }
    drawer.classList.remove('is-open');
    hudStatus.innerText = 'STATUS: STACK IDLE';
  }

  closeBtn.addEventListener('click', resetStack);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') resetStack();
  });

  buildStack();
});