// ── MENU TOGGLE ───────────────────────────────────────
function toggleMenu() {
    var overlay = document.getElementById('menu-overlay');
    if (overlay.classList.contains('active')) {
        overlay.classList.add('closing');
        setTimeout(function() {
            overlay.classList.remove('active');
            overlay.classList.remove('closing');
        }, 300);
    } else {
        overlay.classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', function () {

    // fechar menu ao clicar fora
    var menuOverlay = document.getElementById('menu-overlay');
    menuOverlay.addEventListener('click', function (e) {
        if (e.target === menuOverlay) toggleMenu();
    });

    // ── SCROLL REVEAL ─────────────────────────────────
    var reveals = document.querySelectorAll('.reveal');

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.12 });

    reveals.forEach(function (el) { observer.observe(el); });
});