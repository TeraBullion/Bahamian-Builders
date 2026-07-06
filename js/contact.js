/* ================================================================
   BAHAMIAN BUILDERS — contact.js
   Contact form validation and submission
   ================================================================ */

const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

// Form fields
const nameInput = document.getElementById('contact-name');
const emailInput = document.getElementById('contact-email');
const phoneInput = document.getElementById('contact-phone');
const serviceSelect = document.getElementById('contact-service');
const messageTextarea = document.getElementById('contact-message');

// Error elements
const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const serviceError = document.getElementById('service-error');
const messageError = document.getElementById('message-error');

// ===== VALIDATION HELPERS =====
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showError(input, errorEl, message) {
  input.classList.add('error');
  input.classList.add('shake');
  errorEl.textContent = message;

  // Remove shake after animation
  setTimeout(() => {
    input.classList.remove('shake');
  }, 500);
}

function clearError(input, errorEl) {
  input.classList.remove('error');
  errorEl.textContent = '';
}

// ===== REAL-TIME VALIDATION =====
// Clear errors on input change
if (nameInput) {
  nameInput.addEventListener('input', () => clearError(nameInput, nameError));
}
if (emailInput) {
  emailInput.addEventListener('input', () => clearError(emailInput, emailError));
}
if (serviceSelect) {
  serviceSelect.addEventListener('change', () => clearError(serviceSelect, serviceError));
}
if (messageTextarea) {
  messageTextarea.addEventListener('input', () => clearError(messageTextarea, messageError));
}

// ===== FORM SUBMISSION =====
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate Name (required)
    if (!nameInput.value.trim()) {
      showError(nameInput, nameError, 'Please enter your full name.');
      isValid = false;
    } else {
      clearError(nameInput, nameError);
    }

    // Validate Email (required + format)
    if (!emailInput.value.trim()) {
      showError(emailInput, emailError, 'Please enter your email address.');
      isValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      showError(emailInput, emailError, 'Please enter a valid email address.');
      isValid = false;
    } else {
      clearError(emailInput, emailError);
    }

    // Validate Service (required)
    if (!serviceSelect.value) {
      showError(serviceSelect, serviceError, 'Please select a service.');
      isValid = false;
    } else {
      clearError(serviceSelect, serviceError);
    }

    // Validate Message (required)
    if (!messageTextarea.value.trim()) {
      showError(messageTextarea, messageError, 'Please describe your project.');
      isValid = false;
    } else {
      clearError(messageTextarea, messageError);
    }

    // If all valid, show success
    if (isValid) {
      // Hide form, show success
      contactForm.style.display = 'none';
      document.querySelector('.contact-form-header').style.display = 'none';
      formSuccess.classList.add('visible');

      // Scroll to top of form section
      const formWrapper = document.querySelector('.contact-form-wrapper');
      if (formWrapper) {
        formWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });
}

console.log('🏗️ Bahamian Builders — Contact page loaded');
