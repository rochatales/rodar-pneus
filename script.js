const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const navOverlay = document.querySelector("[data-nav-overlay]");
const quoteForm = document.querySelector("[data-quote-form]");

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 16);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("is-open");
  document.body.classList.toggle("nav-open", isOpen);
  navOverlay.classList.toggle("is-active", isOpen);
  navToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    header.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    navOverlay.classList.remove("is-active");
    navToggle.setAttribute("aria-label", "Abrir menu");
  }
});

navOverlay.addEventListener("click", () => {
  header.classList.remove("is-open");
  document.body.classList.remove("nav-open");
  navOverlay.classList.remove("is-active");
  navToggle.setAttribute("aria-label", "Abrir menu");
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { rootMargin: "0px 0px -28px 0px", threshold: 0.08 },
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const slides = Array.from(carousel.querySelectorAll("[data-carousel-track] img"));
  const dotsContainer = carousel.querySelector("[data-carousel-dots]");
  let activeIndex = 0;
  let timer;

  const dots = slides.map((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Mostrar imagem ${index + 1}`);
    dot.addEventListener("click", () => {
      showSlide(index);
      restart();
    });
    dotsContainer.append(dot);
    return dot;
  });

  const showSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === activeIndex);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeIndex);
    });
  };

  const restart = () => {
    window.clearInterval(timer);
    timer = window.setInterval(() => showSlide(activeIndex + 1), 4800);
  };

  showSlide(0);
  restart();
});

quoteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(quoteForm);
  const message = [
    "Olá, Rodar Pneus. Gostaria de solicitar um orçamento.",
    `Nome: ${data.get("name")}`,
    `WhatsApp: ${data.get("phone")}`,
    `Veículo: ${data.get("vehicle")}`,
    `Serviço: ${data.get("service")}`,
  ].join("\n");

  const url = `https://api.whatsapp.com/send?phone=5524999066146&text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
});
