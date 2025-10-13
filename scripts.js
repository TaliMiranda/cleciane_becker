/*
 * Interactive gradient background
 */
;(() => {
  const htmlEl = document.documentElement
  const bodyEl = document.body

  let mouseX = 0
  let mouseY = 0
  let ticking = false

  function updateBackgroundPosition() {
    const xPercent = (mouseX / window.innerWidth) * 100
    const yPercent = (mouseY / window.innerHeight) * 100
    const pos = `${xPercent}% ${yPercent}%`

    htmlEl.style.backgroundPosition = pos
    bodyEl.style.backgroundPosition = pos
    ticking = false
  }

  function onMouseMove(e) {
    mouseX = e.clientX
    mouseY = e.clientY

    if (!ticking) {
      requestAnimationFrame(updateBackgroundPosition)
      ticking = true
    }
  }

  if (window.innerWidth > 768) {
    document.addEventListener("mousemove", onMouseMove)
  }
})()

/*
 * Utilities
 */
const Utils = {
  debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  },

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  isValidPhone(phone) {
    const phoneRegex = /^[+]?[0-9\s\-()]{10,}$/
    return phoneRegex.test(phone)
  },

  sanitizeString(str) {
    const temp = document.createElement("div")
    temp.textContent = str
    return temp.innerHTML
  },

  showLoading(button) {
    const originalText = button.textContent
    button.disabled = true
    button.innerHTML = '<span style="opacity: 0.7;">Enviando...</span>'
    return originalText
  },

  hideLoading(button, originalText) {
    button.disabled = false
    button.textContent = originalText
  },
}

/*
 * Form Manager
 */
const FormManager = {
  config: {
    requiredMessage: "Este campo é obrigatório",
    emailMessage: "Por favor, insira um email válido",
    phoneMessage: "Por favor, insira um telefone válido",
    successMessage: "Mensagem enviada com sucesso!",
    errorMessage: "Erro ao enviar mensagem. Tente novamente.",
  },

  init() {
    const forms = document.querySelectorAll("[data-form]")
    forms.forEach((form) => this.setupForm(form))
  },

  setupForm(form) {
    const inputs = form.querySelectorAll("input, textarea, select")
    inputs.forEach((input) => {
      input.addEventListener("blur", () => this.validateField(input))
      input.addEventListener(
        "input",
        Utils.debounce(() => this.clearError(input), 300),
      )
    })

    form.addEventListener("submit", (e) => this.handleSubmit(e))
  },

  validateField(field) {
    const value = field.value.trim()
    let isValid = true
    let message = ""

    this.clearError(field)

    if (field.hasAttribute("required") && !value) {
      isValid = false
      message = this.config.requiredMessage
    } else if (value) {
      switch (field.type) {
        case "email":
          if (!Utils.isValidEmail(value)) {
            isValid = false
            message = this.config.emailMessage
          }
          break
        case "tel":
          if (!Utils.isValidPhone(value)) {
            isValid = false
            message = this.config.phoneMessage
          }
          break
      }
    }

    if (!isValid) {
      this.showFieldError(field, message)
    }

    return isValid
  },

  showFieldError(field, message) {
    field.classList.add("error")

    const existingError = field.parentNode.querySelector(".error-message")
    if (existingError) {
      existingError.remove()
    }

    const errorDiv = document.createElement("div")
    errorDiv.className = "error-message"
    errorDiv.textContent = message
    errorDiv.style.cssText = `
      color: #e74c3c;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      display: block;
    `

    field.parentNode.insertBefore(errorDiv, field.nextSibling)

    field.setAttribute("aria-invalid", "true")
    field.setAttribute("aria-describedby", "error-" + field.name)
    errorDiv.id = "error-" + field.name
  },

  clearError(field) {
    field.classList.remove("error")
    const errorMessage = field.parentNode.querySelector(".error-message")
    if (errorMessage) {
      errorMessage.remove()
    }
    field.removeAttribute("aria-invalid")
    field.removeAttribute("aria-describedby")
  },

  validateForm(form) {
    const fields = form.querySelectorAll("input, textarea, select")
    let isValid = true

    fields.forEach((field) => {
      if (!this.validateField(field)) {
        isValid = false
      }
    })

    return isValid
  },

  async handleSubmit(e) {
    e.preventDefault()
    const form = e.target

    if (!this.validateForm(form)) {
      const firstError = form.querySelector(".error")
      if (firstError) {
        firstError.focus()
        firstError.scrollIntoView({ behavior: "smooth", block: "center" })
      }
      return
    }

    const submitButton = form.querySelector('[type="submit"]')
    const originalText = Utils.showLoading(submitButton)

    try {
      await this.submitForm(form)
      this.showSuccess(form)
    } catch (error) {
      console.error("Erro no envio:", error)
      this.showError(form)
    } finally {
      Utils.hideLoading(submitButton, originalText)
    }
  },

  async submitForm(form) {
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())

    Object.keys(data).forEach((key) => {
      data[key] = Utils.sanitizeString(data[key])
    })

    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log("Dados do formulário:", data)
  },

  showSuccess(form) {
    this.showMessage(form, this.config.successMessage, "success")
    form.reset()

    const modal = form.closest(".modal")
    if (modal) {
      setTimeout(() => window.closeModal(), 2000)
    }
  },

  showError(form) {
    this.showMessage(form, this.config.errorMessage, "error")
  },

  showMessage(form, message, type) {
    const existingMessage = form.querySelector(".form-message")
    if (existingMessage) {
      existingMessage.remove()
    }

    const messageDiv = document.createElement("div")
    messageDiv.className = `form-message ${type}`
    messageDiv.textContent = message
    messageDiv.style.cssText = `
      padding: 1rem;
      border-radius: 8px;
      margin-top: 1rem;
      text-align: center;
      font-weight: 500;
      ${
        type === "success"
          ? "background: #d4edda; color: #155724; border: 1px solid #c3e6cb;"
          : "background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;"
      }
    `

    form.appendChild(messageDiv)

    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.remove()
      }
    }, 5000)
  },
}

/*
 * Modal Manager
 */
const ModalManager = {
  init() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        window.closeModal()
      }
    })

    const modal = document.getElementById("contactModal")
    if (modal) {
      modal.addEventListener("show", this.handleModalShow)
      modal.addEventListener("hide", this.handleModalHide)
    }

    const openDialogo = document.getElementById("open-dialogo")
    if (openDialogo && modal) {
      openDialogo.addEventListener("click", () => {
        modal.classList.add("open")
      })
    }
  },

  handleModalShow() {
    const firstInput = this.querySelector("input, textarea, select")
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100)
    }

    document.body.style.overflow = "hidden"
  },

  handleModalHide() {
    document.body.style.overflow = ""

    const trigger = document.querySelector('[onclick*="openModal"]')
    if (trigger) {
      trigger.focus()
    }
  },
}

/*
 * Navigation
 */
const Navigation = {
  init() {
    const navToggle = document.querySelector(".nav-toggle")
    const navLinks = document.querySelector(".nav-links")

    if (navToggle && navLinks) {
      navToggle.addEventListener("click", () => this.toggleMenu(navLinks))

      navLinks.addEventListener("click", (e) => {
        if (e.target.tagName === "A") {
          this.closeMenu(navLinks)
        }
      })

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && navLinks.classList.contains("open")) {
          this.closeMenu(navLinks)
          navToggle.focus()
        }
      })

      navToggle.setAttribute("aria-label", "Alternar menu de navegação")
      navToggle.setAttribute("aria-expanded", "false")
    }
  },

  toggleMenu(navLinks) {
    const isOpen = navLinks.classList.contains("open")
    const navToggle = document.querySelector(".nav-toggle")

    if (isOpen) {
      this.closeMenu(navLinks)
    } else {
      this.openMenu(navLinks)
    }

    navToggle.setAttribute("aria-expanded", !isOpen)
  },

  openMenu(navLinks) {
    navLinks.classList.add("open")
    const firstLink = navLinks.querySelector("a")
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 100)
    }
  },

  closeMenu(navLinks) {
    navLinks.classList.remove("open")
    const navToggle = document.querySelector(".nav-toggle")
    navToggle.setAttribute("aria-expanded", "false")
  },
}

/*
 * Star Manager for Soul Travel
 */
const StarManager = {
  init() {
    if (!document.body.classList.contains("soul-travel-page")) {
      return
    }

    const starPositions = [
      { x: 8, y: 18 },
      { x: 22, y: 35 },
      { x: 40, y: 12 },
      { x: 65, y: 28 },
      { x: 75, y: 60 },
      { x: 50, y: 45 },
      { x: 30, y: 70 },
      { x: 15, y: 55 },
      { x: 80, y: 40 },
      { x: 55, y: 80 },
    ]

    let overlay = document.getElementById("stars-overlay")
    if (!overlay) {
      overlay = document.createElement("div")
      overlay.id = "stars-overlay"
      document.body.appendChild(overlay)
    }

    overlay.innerHTML = ""

    const fragment = document.createDocumentFragment()

    starPositions.forEach((pos) => {
      const star = document.createElement("span")
      star.className = "twinkling-star"
      star.style.cssText = `
        left: ${pos.x}%;
        top: ${pos.y}%;
        animation-delay: ${(Math.random() * 5).toFixed(2)}s;
      `
      fragment.appendChild(star)
    })

    overlay.appendChild(fragment)
  },
}

/*
 * Lazy Loading
 */
const LazyLoader = {
  init() {
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target
            img.src = img.dataset.src
            img.classList.remove("lazy")
            observer.unobserve(img)
          }
        })
      })

      const lazyImages = document.querySelectorAll("img[data-src]")
      lazyImages.forEach((img) => imageObserver.observe(img))
    }
  },
}

/*
 * Global modal functions
 */
window.openModal = () => {
  const modal = document.getElementById("contactModal")
  if (modal) {
    modal.classList.add("open")
    modal.dispatchEvent(new Event("show"))
  }
}

window.closeModal = () => {
  const modal = document.getElementById("contactModal")
  if (modal) {
    modal.classList.remove("open")
    modal.dispatchEvent(new Event("hide"))
  }
}

/*
 * Smooth scroll
 */
const SmoothScroll = {
  init() {
    document.addEventListener("click", (e) => {
      const link = e.target.closest('a[href^="#"]')
      if (link) {
        e.preventDefault()
        const targetId = link.getAttribute("href").substring(1)
        const target = document.getElementById(targetId)

        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })

          target.focus()
        }
      }
    })
  },
}

/*
 * Testimonial toggle function
 */
function toggleTestimonial(button) {
  const card = button.closest(".testimonial-card")
  card.classList.toggle("expanded")
  if (card.classList.contains("expanded")) {
    button.textContent = "Recolher"
  } else {
    button.textContent = "Expandir"
  }
}

/*
 * Main initialization
 */
document.addEventListener("DOMContentLoaded", () => {
  FormManager.init()
  ModalManager.init()
  Navigation.init()
  StarManager.init()
  LazyLoader.init()
  SmoothScroll.init()

  const currentPage = window.location.pathname.split("/").pop() || "index.html"
  const navLinks = document.querySelectorAll(".nav-links a")

  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("href")
    if (linkPage === currentPage || (currentPage === "" && linkPage === "index.html")) {
      link.classList.add("active")
    }
  })

  document.addEventListener("click", (e) => {
    const modal = document.getElementById("contactModal")
    if (modal && modal.classList.contains("open")) {
      const modalContent = modal.querySelector(".modal-content")
      const ctaButton = e.target.closest(".cta-button")

      if (modalContent && !modalContent.contains(e.target) && !ctaButton) {
        window.closeModal()
      }
    }
  })

  const forms = document.querySelectorAll("form")
  forms.forEach((form) => {
    const inputs = form.querySelectorAll("input, textarea, select")
    inputs.forEach((input) => {
      if (!input.labels || input.labels.length === 0) {
        input.setAttribute("aria-label", input.placeholder || input.name)
      }
    })
  })

  console.log("Site Cleciane Becker - JavaScript inicializado com sucesso")
})

// Abrir o Diálogo Sagrado a partir do botão no footer
document.addEventListener("DOMContentLoaded", () => {
  const footerButtons = document.querySelectorAll("#open-dialogo")
  const modal = document.getElementById("contactModal")

  if (footerButtons.length && modal) {
    footerButtons.forEach((button) => {
      button.addEventListener("click", () => {
        modal.classList.add("open")
      })
    })
  }
})
