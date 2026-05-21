lucide.createIcons();

const IMAGES = [
    { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png', bg: '#F4845F' },
    { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png', bg: '#6BBF7A' },
    { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png', bg: '#E882B4' },
    { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png', bg: '#6EB5FF' },
    { src: 'toon/boo.png', bg: '#563f2f' },
    { src: 'toon/ANURAG.png', bg: '#1c2321' },
    { src: 'toon/00731011-8288-4410-95e0-fc87598656e8.png', bg: '#9F776F' },
    { src: 'toon/b8359832-f004-4583-b769-d74dedb60975.png', bg: '#FFB347' },
    { src: 'toon/c78a1b1f-6473-4128-b450-40ac7e4c3522.png', bg: '#91C4F2' },
    { src: 'toon/97035057-d570-4248-b849-5d3938e40ef1.png', bg: '#FFD32A' },
    { src: 'toon/1c5ff36c-25a9-466b-9ae1-1d23eeb34157.png', bg: '#FF8042' },
];

let activeIndex = 0;
let isAnimating = false;
let isMobile = window.innerWidth < 640;

const carouselContainer = document.getElementById('carousel-container');
const heroWrapper = document.getElementById('hero-wrapper');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');

const items = [];

// Download UI helpers
let downloadUiEl = null;

function createDownloadUI() {
    if (downloadUiEl) return downloadUiEl;
    downloadUiEl = document.createElement('div');
    downloadUiEl.id = 'download-ui';
    downloadUiEl.className = 'download-ui';
    downloadUiEl.innerHTML = `
        <img id="download-preview" src="" alt="Toon preview">
        <button class="download-btn">Download Toon</button>
        <button class="close-btn" aria-label="Close">✕</button>
      `;
    heroWrapper.appendChild(downloadUiEl);

    const preview = downloadUiEl.querySelector('#download-preview');
    const dlBtn = downloadUiEl.querySelector('.download-btn');
    const closeBtn = downloadUiEl.querySelector('.close-btn');

    dlBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const src = preview.src;
        await downloadImage(src);
    });

    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        hideDownloadUI();
    });

    document.addEventListener('click', (ev) => {
        const roles = getRoles(activeIndex);
        const activeItem = items[roles.center];
        if (!downloadUiEl.contains(ev.target) && ev.target !== activeItem && !activeItem.contains(ev.target)) {
            hideDownloadUI();
        }
    }, { capture: true });

    return downloadUiEl;
}

function showDownloadUI(src) {
    const ui = createDownloadUI();
    const preview = ui.querySelector('#download-preview');
    preview.src = src;
    ui.classList.add('show');
}

function hideDownloadUI() {
    if (!downloadUiEl) return;
    downloadUiEl.classList.remove('show');
    setTimeout(() => {
        if (downloadUiEl) {
            downloadUiEl.remove();
            downloadUiEl = null;
        }
    }, 220);
}

async function downloadImage(imgSrc) {
    try {
        const resp = await fetch(imgSrc, { mode: 'cors' });
        if (!resp.ok) throw new Error('Network error');
        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const filename = (imgSrc.split('/').pop() || `toon-${activeIndex + 1}.png`).split('?')[0];
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    } catch (err) {
        window.open(imgSrc, '_blank');
    }
}

function triggerDiscoverEffect() {
    if (isDiscovering) return;
    isDiscovering = true;

    const activeItem = items[getRoles(activeIndex).center];
    activeItem.classList.remove('spin-animation');
    void activeItem.offsetWidth;
    activeItem.classList.add('spin-animation');

    heroWrapper.style.backgroundColor = '#ffffff';
    setTimeout(() => {
        heroWrapper.style.backgroundColor = IMAGES[activeIndex].bg;
    }, 150);

    setTimeout(() => {
        activeItem.classList.remove('spin-animation');
        isDiscovering = false;
    }, 1500);
}

// Preload and initialize
IMAGES.forEach((imgData, index) => {
    // Preload
    const img = new Image();
    img.src = imgData.src;

    // Create DOM elements
    const itemDiv = document.createElement('div');
    itemDiv.className = 'carousel-item';

    const imgEl = document.createElement('img');
    imgEl.src = imgData.src;
    imgEl.className = 'carousel-img';
    imgEl.draggable = false;
    imgEl.alt = `Figurine ${index + 1}`;

    itemDiv.appendChild(imgEl);
    itemDiv.addEventListener('click', (e) => {
        const roles = getRoles(activeIndex);
        if (items[roles.center] === itemDiv) {
            triggerDiscoverEffect();
            showDownloadUI(IMAGES[index].src);
        } else {
            // If user clicks a non-center item, jump to it
            activeIndex = index;
            updateCarousel();
        }
    });

    carouselContainer.appendChild(itemDiv);
    items.push(itemDiv);
});

function getRoles(active) {
    const total = IMAGES.length;
    return {
        center: active,
        left: (active + total - 1) % total,
        right: (active + 1) % total,
    };
}

function updateCarousel() {
    heroWrapper.style.backgroundColor = IMAGES[activeIndex].bg;
    const roles = getRoles(activeIndex);

    items.forEach((item, index) => {
        let transform, filter, opacity, zIndex, left, height, bottom;

        if (index === roles.center) {
            transform = `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`;
            filter = 'blur(0px) brightness(1.1)';
            opacity = 1;
            zIndex = 20;
            left = '50%';
            height = isMobile ? '65%' : '96%';
            bottom = isMobile ? '18%' : '0';
        } else if (index === roles.left) {
            transform = 'translateX(-50%) scale(0.9)';
            filter = 'blur(5px) brightness(0.75)';
            opacity = 0.6;
            zIndex = 10;
            left = isMobile ? '15%' : '25%';
            height = isMobile ? '14%' : '24%';
            bottom = isMobile ? '36%' : '16%';
        } else if (index === roles.right) {
            transform = 'translateX(-50%) scale(0.9)';
            filter = 'blur(5px) brightness(0.75)';
            opacity = 0.6;
            zIndex = 10;
            left = isMobile ? '85%' : '75%';
            height = isMobile ? '14%' : '24%';
            bottom = isMobile ? '36%' : '16%';
        } else {
            // back
            transform = 'translateX(-50%) scale(0.85)';
            filter = 'blur(8px) brightness(0.5)';
            opacity = 0.4;
            zIndex = 5;
            left = '50%';
            height = isMobile ? '10%' : '18%';
            bottom = isMobile ? '36%' : '16%';
        }

        item.style.transform = transform;
        item.style.filter = filter;
        item.style.opacity = opacity;
        item.style.zIndex = zIndex;
        item.style.left = left;
        item.style.height = height;
        item.style.bottom = bottom;
        item.classList.toggle('active', index === roles.center);
    });
}

function navigate(direction) {
    if (isAnimating) return;
    isAnimating = true;

    const total = IMAGES.length;
    if (direction === 'next') {
        activeIndex = (activeIndex + 1) % total;
    } else {
        activeIndex = (activeIndex + total - 1) % total;
    }

    updateCarousel();

    setTimeout(() => {
        isAnimating = false;
    }, 800);
}

btnPrev.addEventListener('click', () => navigate('prev'));
btnNext.addEventListener('click', () => navigate('next'));

let isDiscovering = false;

window.addEventListener('resize', () => {
    const newIsMobile = window.innerWidth < 640;
    if (newIsMobile !== isMobile) {
        isMobile = newIsMobile;
        updateCarousel();
    }
});

// Smooth scroll wheel navigation
let scrollAccumulator = 0;
let scrollTimeout;
let isSnapping = false;

window.addEventListener('wheel', (e) => {
    e.preventDefault();

    scrollAccumulator += e.deltaY + e.deltaX;

    // Clear the snap timeout if user continues scrolling
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }

    // Scroll threshold per figure (100px)
    const threshold = 100;

    if (Math.abs(scrollAccumulator) >= threshold) {
        const total = IMAGES.length;
        if (scrollAccumulator > 0) {
            activeIndex = (activeIndex + 1) % total;
        } else {
            activeIndex = (activeIndex + total - 1) % total;
        }
        scrollAccumulator = 0;
        updateCarousel();
    }

    // Snap to figure after scrolling stops (400ms)
    scrollTimeout = setTimeout(() => {
        scrollAccumulator = 0;
    }, 400);
}, { passive: false });

// Touch swipe navigation with smooth movement
let touchStartX = 0;
let touchStartY = 0;
let touchMovement = 0;

heroWrapper.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchMovement = 0;
    if (scrollTimeout) clearTimeout(scrollTimeout);
}, false);

heroWrapper.addEventListener('touchmove', (e) => {
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;

    touchMovement = touchStartX - currentX + (touchStartY - currentY);
}, false);

heroWrapper.addEventListener('touchend', (e) => {
    // Snap to next/prev based on movement (minimum 30px)
    if (Math.abs(touchMovement) > 30) {
        const total = IMAGES.length;
        if (touchMovement > 0) {
            activeIndex = (activeIndex + 1) % total;
        } else {
            activeIndex = (activeIndex + total - 1) % total;
        }
        updateCarousel();
    }
    touchMovement = 0;
}, false);

// Initial render
updateCarousel();

// Custom Cursor Logic
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let outlineX = mouseX;
let outlineY = mouseY;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Instant update for dot
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
});

function animateCursor() {
    // Lerp for outline
    const dx = mouseX - outlineX;
    const dy = mouseY - outlineY;

    outlineX += dx * 0.15;
    outlineY += dy * 0.15;

    cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;

    requestAnimationFrame(animateCursor);
}
animateCursor();

// Add hover effects for buttons and links
document.querySelectorAll('button, a').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorOutline.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
        cursorOutline.classList.remove('hovering');
    });
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') navigate('prev');
    if (e.key === 'ArrowRight') navigate('next');
});

