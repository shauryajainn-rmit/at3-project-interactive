document.addEventListener('DOMContentLoaded', () => {
  const wrapperMenu = document.getElementById('wrapperMenu');
  const firstContainer = document.getElementById('menufirst');
  const spriteCanvas = document.getElementById('spriteCanvas');
  const ctx = spriteCanvas.getContext('2d');
  const infoToggle = document.getElementById('infoToggle');
  const btnClose = document.getElementById('btnClose');
  const infoPanel = document.getElementById('infoPanel');
  const logoTitle = document.getElementById('logoTitle');

  let singleContainerHeight = firstContainer.offsetHeight;

  // Initialize Scroll Position
  wrapperMenu.scrollTop = singleContainerHeight;

  window.addEventListener('resize', () => {
    singleContainerHeight = firstContainer.offsetHeight;
  });

  // Infinite Scroll Loop Listener
  wrapperMenu.addEventListener('scroll', () => {
    const currentScroll = wrapperMenu.scrollTop;

    if (currentScroll >= singleContainerHeight * 2) {
      wrapperMenu.scrollTop = currentScroll - singleContainerHeight;
    } else if (currentScroll <= 5) {
      wrapperMenu.scrollTop = currentScroll + singleContainerHeight;
    }

    drawProceduralSprite(wrapperMenu.scrollTop);
  });

  // Procedural Sprite Drawing
  function drawProceduralSprite(scrollPos) {
    ctx.clearRect(0, 0, spriteCanvas.width, spriteCanvas.height);

    const centerX = spriteCanvas.width / 2;
    const centerY = spriteCanvas.height / 2;
    const radius = 70;
    const rotationAngle = (scrollPos * 0.005) % (Math.PI * 2);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotationAngle);

    // Outer Ring
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Inner Polygon
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const sides = 6;
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides;
      const x = (radius * 0.7) * Math.cos(angle);
      const y = (radius * 0.7) * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    // Orbiting Node
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(radius * Math.cos(rotationAngle * 2), radius * Math.sin(rotationAngle * 2), 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawProceduralSprite(wrapperMenu.scrollTop);

  // Panel Controls
  infoToggle.addEventListener('click', () => {
    infoPanel.classList.add('open');
  });

  btnClose.addEventListener('click', () => {
    infoPanel.classList.remove('open');
  });

  logoTitle.addEventListener('click', () => {
    wrapperMenu.scrollTo({ top: singleContainerHeight, behavior: 'smooth' });
  });
});