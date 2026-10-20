/*
  =============================================================================
  JAVASCRIPT CONTROLLER
  =============================================================================
  Only monitors events for the three `.nav-page-3d` header elements.
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

      // Populate detail drawer
      if (sectionsData[label]) {
        const data = sectionsData[label];
        drawerTag.innerText = data.tag;
        drawerTitle.innerText = label;
        drawerDesc.innerText = data.desc;
        specDim.innerText = data.dim;
        specWeight.innerText = data.weight;
        specFinish.innerText = data.finish;
      }

      drawer.classList.add('is-open');
      hudStatus.innerText = `STATUS: EXTRACTED (${label})`;
    });
  });

  function resetStack() {
    if (activePage) {
      activePage.classList.remove('is-extracted');
      activePage = null;
    }
    drawer.classList.remove('is-open');
    hudStatus.innerText = 'STATUS: STACK IDLE';
  }

  closeBtn.addEventListener('click', resetStack);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') resetStack();
  });
});