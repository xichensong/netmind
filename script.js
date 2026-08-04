const menuToggle = document.querySelector(".menu-toggle");
const tiltTarget = document.querySelector("[data-tilt]");
const reveals = document.querySelectorAll(".reveal");

menuToggle?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-links a, .header-actions a").forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

if (tiltTarget && window.matchMedia("(pointer: fine)").matches) {
  const stack = tiltTarget.querySelector(".stack-scene");

  tiltTarget.addEventListener("pointermove", (event) => {
    const rect = tiltTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    if (stack) {
      stack.style.setProperty("--stack-x", `${60 + y * -5}deg`);
      stack.style.setProperty("--stack-z", `${-44 + x * 8}deg`);
    }
  });

  tiltTarget.addEventListener("pointerleave", () => {
    if (stack) {
      stack.style.removeProperty("--stack-x");
      stack.style.removeProperty("--stack-z");
    }
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  reveals.forEach((node, index) => {
    node.style.transitionDelay = `${Math.min(index * 35, 220)}ms`;
    observer.observe(node);
  });
} else {
  reveals.forEach((node) => node.classList.add("is-visible"));
}
