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
        const inlineSlides = Array.from(inlineTrack.children);
        const count = inlineSlides.length;
        let idx = 0;
        const interval = 2500; // 2.5s
        let t = null;

        // measure widths and set consistent slide width
        function setupInline() {
            // reset any previously set widths
            inlineSlides.forEach(s => {
                s.style.minWidth = '';
            });

            // measure each
            const widths = inlineSlides.map(s => Math.ceil(s.getBoundingClientRect().width));
            const maxW = Math.max(...widths, 20);

            // set wrapper width to maxW so only one slide shows
            inlineWrapper.style.width = `${maxW}px`;
            inlineWrapper.style.display = 'inline-block';
            inlineWrapper.style.overflow = 'hidden';

            // make each slide occupy the same width
            inlineSlides.forEach(s => s.style.minWidth = `${maxW}px`);

            inlineTrack.style.display = 'flex';
            inlineTrack.style.width = `${maxW * count}px`;
            inlineTrack.style.transition = 'transform 0.35s ease';
        }

        function go(i) {
            const slideWidth = inlineSlides[0].getBoundingClientRect().width;
            inlineTrack.style.transform = `translateX(-${i * slideWidth}px)`;
        }

        function nxt() {
            idx = (idx + 1) % count;
            go(idx);
        }

        inlineWrapper.addEventListener('mouseenter', () => clearInterval(t));
        inlineWrapper.addEventListener('mouseleave', () => { clearInterval(t); t = setInterval(nxt, interval); });

        // initialize and start
        setupInline();
        go(0);
        t = setInterval(nxt, interval);

        // recompute on resize
        window.addEventListener('resize', () => {
            clearInterval(t);
            setupInline();
            go(idx);
            t = setInterval(nxt, interval);
        });
    }
});