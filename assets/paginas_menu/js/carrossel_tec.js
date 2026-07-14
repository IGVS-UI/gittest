document.addEventListener('DOMContentLoaded', () => {
    // Horizontal carousel for the larger summary (carouselTrack)
    const track = document.getElementById('carouselTrack');
    if (track) {
        const slides = Array.from(track.children);
        const slideCount = slides.length;
        let index = 0;
        const intervalTime = 4000; // 4s
        let timer = null;

        function goTo(i) {
            track.style.transform = `translateX(-${i * 100}%)`;
            updateDots(i);
        }

        function next() {
            index = (index + 1) % slideCount;
            goTo(index);
        }

        // Dots
        const dotsContainer = document.getElementById('carouselDots');
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            slides.forEach((_, i) => {
                const btn = document.createElement('button');
                btn.className = 'carousel-dot' + (i === 0 ? ' active' : '');
                btn.addEventListener('click', () => {
                    index = i;
                    goTo(index);
                    resetTimer();
                });
                dotsContainer.appendChild(btn);
            });
        }

        function updateDots(i) {
            if (!dotsContainer) return;
            Array.from(dotsContainer.children).forEach((b, idx) => b.classList.toggle('active', idx === i));
        }

        function resetTimer() {
            clearInterval(timer);
            timer = setInterval(next, intervalTime);
        }

        // Pause on hover
        const wrapper = track.parentElement;
        if (wrapper) {
            wrapper.addEventListener('mouseenter', () => clearInterval(timer));
            wrapper.addEventListener('mouseleave', resetTimer);
        }

        // initialize widths to make slides 100% of wrapper
        slides.forEach(s => s.style.minWidth = '100%');
        track.style.display = 'flex';
        track.style.width = `${slideCount * 100}%`;

        // Initialize
        goTo(0);
        timer = setInterval(next, intervalTime);
    }

    // Inline horizontal carousel for the title span
    const inlineWrapper = document.getElementById('carouselInline');
    const inlineTrack = document.getElementById('carouselInlineTrack');
    if (inlineWrapper && inlineTrack) {
        const baseSlides = Array.from(inlineTrack.children).map(slide => slide.cloneNode(true));
        if (!baseSlides.length) return;

        function appendSlides(group) {
            baseSlides.forEach(slide => group.appendChild(slide.cloneNode(true)));
        }

        function buildInfiniteMarquee() {
            inlineTrack.innerHTML = '';

            const group = document.createElement('span');
            group.className = 'carousel-inline-group';
            appendSlides(group);
            inlineTrack.appendChild(group);

            while (group.scrollWidth < window.innerWidth * 1.5) {
                appendSlides(group);
                if (group.children.length > 20) break;
            }

            const clone = group.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            inlineTrack.appendChild(clone);

            const distance = group.scrollWidth;
            const duration = Math.max(12, distance / 90);
            inlineTrack.style.setProperty('--carousel-distance', `${distance}px`);
            inlineTrack.style.setProperty('--carousel-duration', `${duration}s`);
            inlineTrack.classList.add('is-marquee');
        }

        buildInfiniteMarquee();
        window.addEventListener('resize', buildInfiniteMarquee);
    }
});
