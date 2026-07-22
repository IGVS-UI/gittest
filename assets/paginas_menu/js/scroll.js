document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            } else {
                entry.target.classList.remove("show");
            }
        });
    }, {
        threshold: 0.25
    });

    const items = document.querySelectorAll(
        ".frase-destaque h2 span, .hero-tec .hero-tec-text, .hero-tec .caixa_de_texto, .hero-tec .Mulher_vr, .vr, .vr-card, .vr-image, .vr-text, .AR,.caixa_de_texto_AR, .vr-image_AR"
    );
    items.forEach((el) => observer.observe(el));
});
