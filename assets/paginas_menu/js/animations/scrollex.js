document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".scroll-reveal");

    if (!items.length) {
        return;
    }

    document.body.classList.add("scroll-animations-ready");

    const observer = new IntersectionObserver((entries) => {
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

 

    items.forEach((el) => observer.observe(el));
});
