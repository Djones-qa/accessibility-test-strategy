/**
 * Unit-level accessibility tests for CheckoutForm using jest-axe.
 * Validates WCAG 2.1 AA compliance at the component level.
 */
import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { CheckoutForm } from '../../src/components/CheckoutForm';

expect.extend(toHaveNoViolations);

describe('CheckoutForm — Accessibility (jest-axe)', () => {
  it('has no axe violations on initial render', async () => {
    const { container } = render(<CheckoutForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no axe violations when validation errors are displayed', async () => {
    const { container, getByRole } = render(<CheckoutForm />);
    const submitButton = getByRole('button', { name: /place order/i });
    await userEvent.click(submitButton);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no axe violations after successful submission', async () => {
    const { container, getByLabelText, getByRole } = render(<CheckoutForm />);

    await userEvent.type(getByLabelText(/first name/i), 'Jane');
    await userEvent.type(getByLabelText(/last name/i), 'Doe');
    await userEvent.type(getByLabelText(/email address/i), 'jane@example.com');
    await userEvent.type(getByLabelText(/street address/i), '123 Main St');
    await userEvent.type(getByLabelText(/city/i), 'Springfield');
    await userEvent.type(getByLabelText(/zip code/i), '12345');
    await userEvent.type(getByLabelText(/card number/i), '4111111111111111');
    await userEvent.type(getByLabelText(/expiry date/i), '12/26');
    await userEvent.type(getByLabelText(/cvv/i), '123');

    await userEvent.click(getByRole('button', { name: /place order/i }));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('all form inputs have associated labels', () => {
    const { getByLabelText } = render(<CheckoutForm />);
    expect(getByLabelText(/first name/i)).toBeInTheDocument();
    expect(getByLabelText(/last name/i)).toBeInTheDocument();
    expect(getByLabelText(/email address/i)).toBeInTheDocument();
    expect(getByLabelText(/street address/i)).toBeInTheDocument();
    expect(getByLabelText(/city/i)).toBeInTheDocument();
    expect(getByLabelText(/zip code/i)).toBeInTheDocument();
    expect(getByLabelText(/card number/i)).toBeInTheDocument();
    expect(getByLabelText(/expiry date/i)).toBeInTheDocument();
    expect(getByLabelText(/cvv/i)).toBeInTheDocument();
  });

  it('marks required fields with aria-required', () => {
    const { getByLabelText } = render(<CheckoutForm />);
    const requiredFields = [
      getByLabelText(/first name/i),
      getByLabelText(/last name/i),
      getByLabelText(/email address/i),
      getByLabelText(/street address/i),
      getByLabelText(/city/i),
      getByLabelText(/zip code/i),
      getByLabelText(/card number/i),
      getByLabelText(/expiry date/i),
      getByLabelText(/cvv/i),
    ];
    requiredFields.forEach((field) => {
      expect(field).toHaveAttribute('aria-required', 'true');
    });
  });

  it('sets aria-invalid on fields with validation errors', async () => {
    const { getByLabelText, getByRole } = render(<CheckoutForm />);
    await userEvent.click(getByRole('button', { name: /place order/i }));
    expect(getByLabelText(/first name/i)).toHaveAttribute('aria-invalid', 'true');
    expect(getByLabelText(/email address/i)).toHaveAttribute('aria-invalid', 'true');
  });

  it('error messages are linked via aria-describedby', async () => {
    const { getByLabelText, getByRole } = render(<CheckoutForm />);
    await userEvent.click(getByRole('button', { name: /place order/i }));
    const firstNameInput = getByLabelText(/first name/i);
    expect(firstNameInput).toHaveAttribute('aria-describedby', 'firstName-error');
  });

  it('uses fieldset and legend for logical grouping', () => {
    const { getAllByRole } = render(<CheckoutForm />);
    const groups = getAllByRole('group');
    expect(groups.length).toBeGreaterThanOrEqual(3);
    groups.forEach((group) => {
      expect(group.querySelector('legend')).not.toBeNull();
    });
  });

  it('form has an accessible name', () => {
    const { getByRole } = render(<CheckoutForm />);
    expect(getByRole('form', { name: /checkout form/i })).toBeInTheDocument();
  });
});
