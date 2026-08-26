(function () {
    'use strict';

    const SETTINGS = {
        sensitivity: 0.35,
        minOffset: -72,
        maxOffset: 72,
        minPointerDelta: 0.5,
        smoothing: 0.14,
        settleThreshold: 0.05
    };

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function initCardMotion() {
        const overlay = document.getElementById('menu-overlay');

        if (!overlay) return;

        const leftColumn = overlay.querySelector('[data-card-column="left"]');
        const rightColumn = overlay.querySelector('[data-card-column="right"]');
        const navItems = Array.from(overlay.querySelectorAll('[data-menu-target]'));
        const cards = Array.from(overlay.querySelectorAll('[data-card]'));

        if (!leftColumn || !rightColumn) return;

        const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
        const navByKey = new Map();
        const cardByKey = new Map();

        navItems.forEach(function (navItem) {
            navByKey.set(navItem.dataset.menuTarget, navItem);
        });

        cards.forEach(function (card) {
            cardByKey.set(card.dataset.card, card);
        });

        let targetOffset = 0;
        let currentOffset = 0;
        let previousPointerY = null;
        let animationFrameId = null;
        let wasOpen = false;
        let activePairKey = null;

        function isMenuOpen() {
            return overlay.classList.contains('active') &&
                !overlay.classList.contains('closing');
        }

        function canAnimate() {
            return finePointer.matches && isMenuOpen();
        }

        function clearActivePair() {
            navItems.forEach(function (navItem) {
                navItem.classList.remove('is-active');
            });

            cards.forEach(function (card) {
                card.classList.remove('is-active');
            });

            overlay.classList.remove('has-active-card');
            activePairKey = null;
        }

        function activatePair(key) {
            if (!isMenuOpen() || activePairKey === key) return;

            const navItem = navByKey.get(key);
            const card = cardByKey.get(key);

            if (!navItem || !card) return;

            clearActivePair();
            navItem.classList.add('is-active');
            card.classList.add('is-active');
            overlay.classList.add('has-active-card');
            activePairKey = key;
        }

        function deactivatePair(key) {
            if (activePairKey !== key) return;

            clearActivePair();
        }

        function bindHoverSynchronization() {
            navByKey.forEach(function (navItem, key) {
                const card = cardByKey.get(key);

                if (!card) return;

                navItem.addEventListener('mouseenter', function () {
                    activatePair(key);
                });

                navItem.addEventListener('mouseleave', function () {
                    deactivatePair(key);
                });

                navItem.addEventListener('focus', function () {
                    activatePair(key);
                });

                navItem.addEventListener('blur', function () {
                    deactivatePair(key);
                });

                card.addEventListener('mouseenter', function () {
                    activatePair(key);
                });

                card.addEventListener('mouseleave', function () {
                    deactivatePair(key);
                });
            });
        }

        function applyTransforms() {
            const leftOffset = currentOffset.toFixed(2);
            const rightOffset = (-currentOffset).toFixed(2);

            leftColumn.style.transform = `translateY(${leftOffset}px)`;
            rightColumn.style.transform = `translateY(${rightOffset}px)`;
        }

        function stopAnimation() {
            if (animationFrameId === null) return;

            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }

        function resetMotion() {
            stopAnimation();
            targetOffset = 0;
            currentOffset = 0;
            previousPointerY = null;
            leftColumn.style.removeProperty('transform');
            rightColumn.style.removeProperty('transform');
        }

        function animate() {
            animationFrameId = null;

            if (!canAnimate()) {
                resetMotion();
                return;
            }

            currentOffset += (targetOffset - currentOffset) * SETTINGS.smoothing;

            if (Math.abs(targetOffset - currentOffset) <= SETTINGS.settleThreshold) {
                currentOffset = targetOffset;
            }

            applyTransforms();

            if (currentOffset !== targetOffset) {
                animationFrameId = requestAnimationFrame(animate);
            }
        }

        function requestAnimation() {
            if (animationFrameId !== null) return;

            animationFrameId = requestAnimationFrame(animate);
        }

        function handlePointerMove(event) {
            if (!canAnimate() || event.pointerType !== 'mouse') return;

            if (previousPointerY === null) {
                previousPointerY = event.clientY;
                return;
            }

            const deltaY = event.clientY - previousPointerY;
            previousPointerY = event.clientY;

            if (Math.abs(deltaY) < SETTINGS.minPointerDelta) return;

            targetOffset = clamp(
                targetOffset - deltaY * SETTINGS.sensitivity,
                SETTINGS.minOffset,
                SETTINGS.maxOffset
            );

            requestAnimation();
        }

        function handlePointerBoundary() {
            previousPointerY = null;
        }

        function syncMenuState() {
            const open = isMenuOpen();

            if (open && !wasOpen) {
                resetMotion();
                clearActivePair();
            } else if (!open && wasOpen) {
                resetMotion();
                clearActivePair();
            }

            wasOpen = open;
        }

        function handlePointerCapabilityChange() {
            if (!finePointer.matches) resetMotion();
        }

        overlay.addEventListener('pointermove', handlePointerMove, { passive: true });
        overlay.addEventListener('pointerenter', handlePointerBoundary, { passive: true });
        overlay.addEventListener('pointerleave', handlePointerBoundary, { passive: true });
        window.addEventListener('blur', handlePointerBoundary);

        const overlayObserver = new MutationObserver(syncMenuState);
        overlayObserver.observe(overlay, {
            attributes: true,
            attributeFilter: ['class']
        });

        if (typeof finePointer.addEventListener === 'function') {
            finePointer.addEventListener('change', handlePointerCapabilityChange);
        } else {
            finePointer.addListener(handlePointerCapabilityChange);
        }

        bindHoverSynchronization();
        syncMenuState();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCardMotion, { once: true });
    } else {
        initCardMotion();
    }
}());
