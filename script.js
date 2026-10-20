const backgroundText = document.querySelector('.background-text');
const sourceParagraph = backgroundText?.querySelector(':scope > p');

if (backgroundText && sourceParagraph) {
    const items = sourceParagraph.textContent
        .split('\n')
        .map(item => item.trim())
        .filter(Boolean);
    const groupSize = 7;

    for (let i = 0; i < items.length; i += groupSize) {
        const paragraph = document.createElement('p');

        paragraph.textContent = items.slice(i, i + groupSize).join('\n');
        backgroundText.appendChild(paragraph);
    }

    sourceParagraph.remove();
}

const randomOffset = (min, max, unit) => {
    const direction = Math.random() < 0.5 ? -1 : 1;
    const magnitude = min + Math.random() * (max - min);

    return `${direction * magnitude}${unit}`;
};

document.querySelectorAll('.interactive-layer').forEach(el => {
    el.style.setProperty('--float-x', randomOffset(10, 25, 'px'));
    el.style.setProperty('--float-y', randomOffset(10, 25, 'px'));
    el.style.setProperty('--float-rotation', randomOffset(0.5, 1.5, 'deg'));
});

document.addEventListener('mousemove', e => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    if (!isDragging) {
        document.querySelectorAll('.interactive-layer').forEach(el => {
            const xOffset = (x - 0.5) * 40;
            const yOffset = (y - 0.5) * 40;

            el.style.marginLeft = `${xOffset}px`;
            el.style.marginTop = `${yOffset}px`;
        });
    }
});

let isDragging = false;
let currentElement = null;
let startX, startY, initialLeft, initialTop;

document.querySelectorAll('.interactive-layer').forEach(el => {
    el.addEventListener('mousedown', e => {
        isDragging = true;
        currentElement = el;
        startX = e.clientX;
        startY = e.clientY;
        initialLeft = parseFloat(el.style.left) || 0;
        initialTop = parseFloat(el.style.top) || 0;
        el.classList.add('is-dragging');

        e.preventDefault();
    });
});

document.addEventListener('mousemove', e => {
    if (isDragging && currentElement) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const dxPercent = (dx / window.innerWidth) * 100;
        const dyPercent = (dy / window.innerHeight) * 100;

        currentElement.style.left = `${initialLeft + dxPercent}%`;
        currentElement.style.top = `${initialTop + dyPercent}%`;
    }
});

document.addEventListener('mouseup', () => {
    if (isDragging && currentElement) {
        isDragging = false;
        currentElement.classList.remove('is-dragging');
        currentElement = null;
    }
});