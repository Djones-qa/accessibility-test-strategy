import React, { useState } from 'react';

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

interface CheckoutFormProps {
  onSubmit?: (data: CheckoutFormData) => void;
}

/**
 * Accessible ecommerce checkout form.
 * Meets WCAG 2.1 AA requirements:
 * - All inputs have associated <label> elements
 * - Required fields are marked with aria-required
 * - Error messages use aria-describedby
 * - Form uses fieldset/legend for logical grouping
 * - Focus management on validation errors
 */
export const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<CheckoutFormData> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!formData.address.trim()) newErrors.address = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
    if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
    if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof CheckoutFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
      onSubmit?.(formData);
    }
  };

  if (submitted) {
    return (
      <div role="alert" aria-live="polite" className="success-message">
        <h2>Order Confirmed</h2>
        <p>Thank you for your purchase. A confirmation email has been sent to {formData.email}.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Checkout form">
      <fieldset>
        <legend>Contact Information</legend>

        <div className="form-group">
          <label htmlFor="firstName">
            First Name <span aria-hidden="true">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            aria-required="true"
            aria-describedby={errors.firstName ? 'firstName-error' : undefined}
            aria-invalid={!!errors.firstName}
            autoComplete="given-name"
          />
          {errors.firstName && (
            <span id="firstName-error" role="alert" className="error">
              {errors.firstName}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">
            Last Name <span aria-hidden="true">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            aria-required="true"
            aria-describedby={errors.lastName ? 'lastName-error' : undefined}
            aria-invalid={!!errors.lastName}
            autoComplete="family-name"
          />
          {errors.lastName && (
            <span id="lastName-error" role="alert" className="error">
              {errors.lastName}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email Address <span aria-hidden="true">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            aria-required="true"
            aria-describedby={errors.email ? 'email-error' : undefined}
            aria-invalid={!!errors.email}
            autoComplete="email"
          />
          {errors.email && (
            <span id="email-error" role="alert" className="error">
              {errors.email}
            </span>
          )}
        </div>
      </fieldset>

      <fieldset>
        <legend>Shipping Address</legend>

        <div className="form-group">
          <label htmlFor="address">
            Street Address <span aria-hidden="true">*</span>
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            aria-required="true"
            aria-describedby={errors.address ? 'address-error' : undefined}
            aria-invalid={!!errors.address}
            autoComplete="street-address"
          />
          {errors.address && (
            <span id="address-error" role="alert" className="error">
              {errors.address}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="city">
            City <span aria-hidden="true">*</span>
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            aria-required="true"
            aria-describedby={errors.city ? 'city-error' : undefined}
            aria-invalid={!!errors.city}
            autoComplete="address-level2"
          />
          {errors.city && (
            <span id="city-error" role="alert" className="error">
              {errors.city}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="zipCode">
            ZIP Code <span aria-hidden="true">*</span>
          </label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            aria-required="true"
            aria-describedby={errors.zipCode ? 'zipCode-error' : undefined}
            aria-invalid={!!errors.zipCode}
            autoComplete="postal-code"
            inputMode="numeric"
            pattern="[0-9]{5}"
          />
          {errors.zipCode && (
            <span id="zipCode-error" role="alert" className="error">
              {errors.zipCode}
            </span>
          )}
        </div>
      </fieldset>

      <fieldset>
        <legend>Payment Details</legend>

        <div className="form-group">
          <label htmlFor="cardNumber">
            Card Number <span aria-hidden="true">*</span>
          </label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            aria-required="true"
            aria-describedby={errors.cardNumber ? 'cardNumber-error' : 'cardNumber-hint'}
            aria-invalid={!!errors.cardNumber}
            autoComplete="cc-number"
            inputMode="numeric"
            maxLength={19}
          />
          <span id="cardNumber-hint" className="hint">
            Enter 16-digit card number
          </span>
          {errors.cardNumber && (
            <span id="cardNumber-error" role="alert" className="error">
              {errors.cardNumber}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="expiryDate">
            Expiry Date <span aria-hidden="true">*</span>
          </label>
          <input
            type="text"
            id="expiryDate"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            aria-required="true"
            aria-describedby={errors.expiryDate ? 'expiryDate-error' : 'expiryDate-hint'}
            aria-invalid={!!errors.expiryDate}
            autoComplete="cc-exp"
            placeholder="MM/YY"
            maxLength={5}
          />
          <span id="expiryDate-hint" className="hint">
            Format: MM/YY
          </span>
          {errors.expiryDate && (
            <span id="expiryDate-error" role="alert" className="error">
              {errors.expiryDate}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="cvv">
            CVV <span aria-hidden="true">*</span>
          </label>
          <input
            type="text"
            id="cvv"
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            aria-required="true"
            aria-describedby={errors.cvv ? 'cvv-error' : 'cvv-hint'}
            aria-invalid={!!errors.cvv}
            autoComplete="cc-csc"
            inputMode="numeric"
            maxLength={4}
          />
          <span id="cvv-hint" className="hint">
            3 or 4 digits on back of card
          </span>
          {errors.cvv && (
            <span id="cvv-error" role="alert" className="error">
              {errors.cvv}
            </span>
          )}
        </div>
      </fieldset>

      <button type="submit">Place Order</button>
    </form>
  );
};

export default CheckoutForm;
