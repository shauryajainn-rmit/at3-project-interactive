/*
  =============================================================================
  JAVASCRIPT & PHYSICS KINETIC ENGINE COMMENTARY
  Word Count Target Contribution: ~270 words
  =============================================================================
  1. MOMENTUM INERTIA DRAG ALGORITHM:
     To recreate the tactile momentum dragging found on studio websites (Better Off Studio, 2024), 
     this engine tracks delta movement during active drag (`pointermove`). On release, velocity 
     is calculated (`velocityX = currentX - lastX`) and continuously multiplied by a friction 
     coefficient (`0.92`) inside a `requestAnimationFrame` loop until momentum naturally decays to zero.

  2. 3D PROXIMITY CARD TILT MECHANICS:
     Each card monitors cursor position relative to its visual center coordinates. Displacement 
     ratios calculate 3D rotation angles:
     `rotateY = (mouseX - cardCenterX) * 0.08 deg`
     `rotateX = -(mouseY - cardCenterY) * 0.08 deg`
     This produces continuous spatial perspective depth without relying on external WebGL libraries.

  3. BOUNDARY CLAMPING & RESPONSIVENESS:
     Track displacement (`currentTranslateX`) is clamped between strict minimum (`-maxScroll`) 
     and maximum (`0px`) spatial bounds to prevent infinite dragging off-screen.
  =============================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
  const viewport = document.getElementById('viewport');
  const track = document.getElementById('track');
  const cards = document.querySelectorAll('.card');
  const hud = document.getElementById('hud');
  const modal = document.getElementById('modal');
  const closeBtn = document.getElementById('closeBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalMeta = document.getElementById('modalMeta');

  // Drag Physics State
  let isDragging = false;
  let startX = 0;
  let currentTranslateX = 0;
  let prevTranslateX = 0;
  let velocityX = 0;
  let animationFrameId = null;

  // Calculate Maximum Left Scroll Boundary
  function getMaxScroll() {
    return -(track.scrollWidth - window.innerWidth + window.innerWidth * 0.1);
  }

  // Continuous Physics Loop
  function updatePhysics() {
    if (!isDragging) {
      // Apply momentum decay friction
      velocityX *= 0.92;
      currentTranslateX += velocityX;

      // Clamp within track boundaries
      const maxScroll = getMaxScroll();
      if (currentTranslateX > 0) {
        currentTranslateX = 0;
        velocityX = 0;
      } else if (currentTranslateX < maxScroll) {
        currentTranslateX = maxScroll;
        velocityX = 0;
      }
    }

    // Apply Hardware Accelerated Transformation
    track.style.transform = `translate3d(${currentTranslateX}px, -50%, 0)`;

    // Update HUD Velocity Readout
    hud.innerText = `DRAG TO EXPLORE [ ${Math.abs(velocityX).toFixed(2)} PX/S ]`;

    animationFrameId = requestAnimationFrame(updatePhysics);
  }

  // Pointer Drag Event Handlers
  viewport.addEventListener('pointerdown', (e) => {
    isDragging = true;
    viewport.classList.add('is-dragging');
    startX = e.clientX;
    prevTranslateX = currentTranslateX;
    velocityX = 0;
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    const nextTranslate = prevTranslateX + deltaX;

    // Calculate instant velocity
    velocityX = nextTranslate - currentTranslateX;
    currentTranslateX = nextTranslate;
  });

  window.addEventListener('pointerup', () => {
    if (!isDragging) return;
    isDragging = false;
    viewport.classList.remove('is-dragging');
  });

  // 3D Card Hover Tilt Mechanics
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - cardCenterX;
      const deltaY = e.clientY - cardCenterY;

      const rotateY = deltaX * 0.08;
      const rotateX = -deltaY * 0.08;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });

    // Double Click to Open Detail Modal
    card.addEventListener('dblclick', () => {
      modalTitle.innerText = card.dataset.title;
      modalMeta.innerText = card.dataset.meta;
      modal.classList.add('is-open');
    });
  });

  // Modal Controls
  closeBtn.addEventListener('click', () => {
    modal.classList.remove('is-open');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') modal.classList.remove('is-open');
  });

  // Start Animation Loop
  updatePhysics();
});