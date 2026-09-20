// Initialize a new Lenis instance for smooth scrolling
const lenis = new Lenis();

// Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
lenis.on('scroll', ScrollTrigger.update);

// Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
// This ensures Lenis's smooth scroll animation updates on each GSAP tick
gsap.ticker.add((time) => {
  lenis.raf(time * 1000); // Convert time from seconds to milliseconds
});

// Disable lag smoothing in GSAP to prevent any delay in scroll animations
gsap.ticker.lagSmoothing(0);

// gsap animation code
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger)
  
  let horizontalSection = document.querySelector('.horizontal');

  gsap.to(".horizontal", {
    x: () => -(horizontalSection.scrollWidth - window.innerWidth), //ensure smooth end
    scrollTrigger: {
      trigger: ".horizontal",
      start: 'center center',
      end: () => "+=" + (horizontalSection.scrollWidth), //dynamic end
      pin: "#horizontal-scroll",
      scrub: true,
      invalidateOnRefresh: true
    }
  });

  document.querySelectorAll(".card").forEach((card) => {
    gsap.from(card, {
      x: 250,
      duration: 0.6,
      scrollTrigger: {
        trigger: card,
        start: "top bottom",
        toggleActions: "play none none reverse"
      }
    })
  })

  // hero section animation

  let t1 = gsap.timeline();

  t1.from(".heading", {
    y: 100,
    opacity: 0,
    duration: 1.2,
    ease: "power4.out"
  })
  .from(".content p", {
    y: 40,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  }, "-=0.8")

});



// paritcle background

const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");

let particles = [];
const particleCount = 60; // number of particles
const colors = ["#bbbb4f7c", "#bbbb4f51"]; // accent + light

// Resize canvas to full screen
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Particle class
class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 2 + 0.5; // small size
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.speedX = (Math.random() - 0.5) * 0.6; // gentle horizontal drift
    this.speedY = (Math.random() - 0.5) * 0.6; // gentle vertical drift
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // bounce back if out of bounds
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

// Create particles
function init() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}
init();

// Animate particles
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}
animate();
