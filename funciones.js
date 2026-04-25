

const observador = new IntersectionObserver(
    (entradas) => {
        entradas.forEach((entrada, i) => {
            if (entrada.isIntersecting) {
                setTimeout(() => {
                    entrada.target.classList.add('visible');
                }, i * 80);
                observador.unobserve(entrada.target);
            }
        });
    },
    { threshold: 0.12 }
);

document.querySelectorAll('.fade-in-up').forEach(el => observador.observe(el));

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navegacion');
    if (window.scrollY > 20) {
        navbar.style.boxShadow = '0 4px 24px rgba(10,42,94,0.16)';
    } else {
        navbar.style.boxShadow = '0 2px 16px rgba(10,42,94,0.10)';
    }
});


