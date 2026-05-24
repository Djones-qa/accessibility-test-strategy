/**
 * Accessible checkout form validation.
 * Manages aria-invalid, aria-describedby, and error announcements.
 */
(function () {
  'use strict';

  const form = document.getElementById('checkout-form');
  const successMessage = document.getElementById('success-message');

  const fields = [
    { id: 'firstName', label: 'First name' },
    { id: 'lastName', label: 'Last name' },
    { id: 'email', label: 'Email address', type: 'email' },
    { id: 'address', label: 'Street address' },
    { id: 'city', label: 'City' },
    { id: 'zipCode', label: 'ZIP code' },
    { id: 'cardNumber', label: 'Card number' },
    { id: 'expiryDate', label: 'Expiry date' },
    { id: 'cvv', label: 'CVV' },
  ];

  function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + '-error');
    if (!input || !errorEl) return;

    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', fieldId + '-error');
    errorEl.textContent = message;
    errorEl.removeAttribute('hidden');
  }

  function clearError(fieldId) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + '-error');
    if (!input || !errorEl) return;

    input.removeAttribute('aria-invalid');
    // Restore original describedby if hint exists
    const hintEl = document.getElementById(fieldId + '-hint');
    if (hintEl) {
      input.setAttribute('aria-describedby', fieldId + '-hint');
    } else {
      input.removeAttribute('aria-describedby');
    }
    errorEl.textContent = '';
    errorEl.setAttribute('hidden', '');
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validate() {
    let isValid = true;
    let firstErrorId = null;

    fields.forEach(function (field) {
      const input = document.getElementById(field.id);
      if (!input) return;

      const value = input.value.trim();

      if (!value) {
        showError(field.id, field.label + ' is required');
        isValid = false;
        if (!firstErrorId) firstErrorId = field.id;
      } else if (field.type === 'email' && !validateEmail(value)) {
        showError(field.id, 'Enter a valid email address');
        isValid = false;
        if (!firstErrorId) firstErrorId = field.id;
      } else {
        clearError(field.id);
      }
    });

    // Move focus to first error for screen reader announcement
    if (firstErrorId) {
      document.getElementById(firstErrorId).focus();
    }

    return isValid;
  }

  // Clear errors on input
  fields.forEach(function (field) {
    const input = document.getElementById(field.id);
    if (input) {
      input.addEventListener('input', function () {
        clearError(field.id);
      });
    }
  });

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validate()) {
        form.setAttribute('hidden', '');
        if (successMessage) {
          successMessage.removeAttribute('hidden');
          successMessage.focus();
        }
      }
    });
  }
})();
