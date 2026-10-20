/* =============================================================================
   SCROLL-DRIVEN ROTATION CONTROLLER
   ============================================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.section');

  window.addEventListener('scroll', () => {
    // Calculate scroll progress percentage (0 to 1)
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollProgress = scrollTop / docHeight;

    // Convert progress into total rotation degrees (e.g., 360 degrees full rotation)
    const totalRotation = scrollProgress * -360;

    // Apply smooth rotation offset to each card based on its predefined inner rotation
    sections.forEach((sec) => {
      // Extract the base angle from style variable or data if needed, 
      // but here we can dynamically modify the transform rotation property:
      const baseRotate = sec.style.getPropertyValue('--rotate-inner');
      
      sec.style.transform = `translate(var(--x), var(--y)) rotate(calc(${baseRotate} + ${totalRotation}deg))`;
    });
  });
});