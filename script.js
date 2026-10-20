/*
  =============================================================================
  JAVASCRIPT CONTROLLER & INTERACTION LOGIC
  Word Count Target Contribution: ~250 words
  =============================================================================
  1. ARCHITECTURE & EVENT BINDING:
     This script exclusively monitors events for the three `.nav-page-3d` header 
     elements (SIZE, FORMAT, STOCK), completely ignoring the `.static-block` base layers.
     
  2. AXIAL MOTION TRAJECTORY:
     Because the interactive navigation sheets are rotated `-24deg` internally, 
     applying standard `translate(X, Y)` offsets during the `.is-extracted` state 
     would cause them to slide straight down. CSS logic handles this by aligning 
     the extraction vector `translate(130px, 170px)` strictly to the local `-24deg` 
     matrix. This ensures they pull out cleanly toward the front-right of the screen, 
     mimicking the physical motion of removing a sheet from a skewed paper pile.

  3. STATE MANAGEMENT & ACCESSIBILITY:
     A single tracker (`activePage`) ensures only one sheet can be extracted at a time.
     Keyboard listeners allow users to press the `Escape` key to smoothly return 
     the active sheet into the static pile and close the information drawer.
  =============================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
  const navPages = document.querySelectorAll('.nav-page-3d');
  const drawer = document.getElementById('drawer');
  const closeBtn = document.getElementById('closeBtn');
  const hudStatus = document.getElementById('hudStatus');
  const drawerTag = document.getElementById('drawerTag');
  const drawerTitle = document.getElementById('drawerTitle');
  const drawerDesc = document.getElementById('drawerDesc');
  const specDim = document.getElementById('specDim');
  const specWeight = document.getElementById('specWeight');
  const specFinish = document.getElementById('specFinish');

  // Labeled Sections Data for the Right Panel
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

  let activePage = null;

  // Bind Listeners strictly to the 3D Navigation Headers
  navPages.forEach((page) => {
    page.addEventListener('click', () => {
      const label = page.dataset.label;

      // Toggle off if already extracted
      if (page.classList.contains('is-extracted')) {
        resetStack();
        return;
      }

      resetStack();

      // Extract clicked 3D header page
      activePage = page;
      page.classList.add('is-extracted');

      // Populate detail drawer with corresponding data
      if (sectionsData[label]) {
        const data = sectionsData[label];
        drawerTag.innerText = data.tag;
        drawerTitle.innerText = label;
        drawerDesc.innerText = data.desc;
        specDim.innerText = data.dim;
        specWeight.innerText = data.weight;
        specFinish.innerText = data.finish;
      }

      // Open drawer and update HUD
      drawer.classList.add('is-open');
      hudStatus.innerText = `STATUS: EXTRACTED (${label})`;
    });
  });

  // Function to return the sheet to the pile
  function resetStack() {
    if (activePage) {
      activePage.classList.remove('is-extracted');
      activePage = null;
    }
    drawer.classList.remove('is-open');
    hudStatus.innerText = 'STATUS: STACK IDLE';
  }

  // Close Button Listener
  closeBtn.addEventListener('click', resetStack);

  // Keyboard Accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') resetStack();
  });
});