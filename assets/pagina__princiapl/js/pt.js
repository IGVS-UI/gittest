function toggleMenu() {
    const overlay = document.getElementById('menu-overlay');
    if (!overlay) return;

    if (overlay.classList.contains('active')) {
        overlay.classList.add('closing');

        setTimeout(() => {
            overlay.classList.remove('active');
            overlay.classList.remove('closing');
        }, 500);
    } else {
        overlay.classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const menuOverlay = document.getElementById('menu-overlay');
    if (!menuOverlay) return;

    menuOverlay.addEventListener('click', (event) => {
        if (event.target === menuOverlay) {
            toggleMenu();
        }
    });
});
