const BACKEND_URL = 'https://SEU_BACKEND_AQUI/api/leads'

const header = document.querySelector("[data-header]")
const navToggle = document.querySelector("[data-nav-toggle]")
const nav = document.querySelector("[data-nav]")
const navOverlay = document.querySelector("[data-nav-overlay]")
const quoteForm = document.querySelector("[data-quote-form]")

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 16)
}

setHeaderState()
window.addEventListener("scroll", setHeaderState, { passive: true })

navToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("is-open")
  document.body.classList.toggle("nav-open", isOpen)
  navOverlay.classList.toggle("is-active", isOpen)
  navToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu")
})

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    header.classList.remove("is-open")
    document.body.classList.remove("nav-open")
    navOverlay.classList.remove("is-active")
    navToggle.setAttribute("aria-label", "Abrir menu")
  }
})

navOverlay.addEventListener("click", () => {
  header.classList.remove("is-open")
  document.body.classList.remove("nav-open")
  navOverlay.classList.remove("is-active")
  navToggle.setAttribute("aria-label", "Abrir menu")
})

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
        revealObserver.unobserve(entry.target)
      }
    })
  },
  { rootMargin: "0px 0px -28px 0px", threshold: 0.08 },
)

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element))

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const slides = Array.from(carousel.querySelectorAll("[data-carousel-track] img"))
  const dotsContainer = carousel.querySelector("[data-carousel-dots]")
  let activeIndex = 0
  let timer

  const dots = slides.map((_, index) => {
    const dot = document.createElement("button")
    dot.type = "button"
    dot.setAttribute("aria-label", `Mostrar imagem ${index + 1}`)
    dot.addEventListener("click", () => {
      showSlide(index)
      restart()
    })
    dotsContainer.append(dot)
    return dot
  })

  const showSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === activeIndex)
    })
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeIndex)
    })
  }

  const restart = () => {
    window.clearInterval(timer)
    timer = window.setInterval(() => showSlide(activeIndex + 1), 4800)
  }

  showSlide(0)
  restart()
})

/* Formulário: quantidade de pneus condicional */
const serviceSelect = quoteForm?.querySelector('select[name="service"]')
const tireQtyLabel = quoteForm?.querySelector('.tire-quantity')
const tireQtySelect = quoteForm?.querySelector('select[name="tire_quantity"]')

const updateTireQuantityVisibility = () => {
  const value = serviceSelect?.value || ''
  const show = value === 'Pneus' || value === 'Montagem de pneus'
  if (tireQtyLabel) {
    tireQtyLabel.style.display = show ? '' : 'none'
  }
  if (tireQtySelect) {
    tireQtySelect.required = show
    if (!show) tireQtySelect.value = ''
  }
}

serviceSelect?.addEventListener('change', updateTireQuantityVisibility)
updateTireQuantityVisibility()

/* Formulário: envio via fetch */
quoteForm.addEventListener("submit", async (event) => {
  event.preventDefault()

  const data = new FormData(quoteForm)
  const submitBtn = quoteForm.querySelector('.form-submit')
  let feedback = quoteForm.querySelector('.form-feedback')
  if (!feedback) {
    feedback = document.createElement('p')
    feedback.className = 'form-feedback'
    quoteForm.insertBefore(feedback, submitBtn.nextElementSibling)
  }

  const payload = {
    nome: data.get("name"),
    whatsapp: data.get("phone"),
    veiculo: data.get("vehicle"),
    servico: data.get("service"),
    quantidade_pneus: data.get("tire_quantity") || null,
  }

  submitBtn.classList.add('is-loading')
  submitBtn.textContent = 'Enviando...'
  feedback.className = 'form-feedback'
  feedback.textContent = ''

  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) throw new Error('Erro no servidor')

    feedback.classList.add('success')
    feedback.textContent = 'Orçamento solicitado com sucesso!'
    quoteForm.reset()
    updateTireQuantityVisibility()
  } catch (err) {
    feedback.classList.add('error')
    feedback.textContent = 'Não foi possível enviar. Tente novamente ou fale pelo WhatsApp.'
  } finally {
    submitBtn.classList.remove('is-loading')
    submitBtn.textContent = 'Solicitar orçamento'
  }
})
