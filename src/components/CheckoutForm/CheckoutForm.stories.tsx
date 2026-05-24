import type { Meta, StoryObj } from '@storybook/react';
import { CheckoutForm, type CheckoutFormData } from './CheckoutForm';

const meta: Meta<typeof CheckoutForm> = {
  title: 'Ecommerce/CheckoutForm',
  component: CheckoutForm,
  tags: ['autodocs'],
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'label', enabled: true },
          { id: 'aria-required-attr', enabled: true },
        ],
      },
    },
    docs: {
      description: {
        component:
          'Accessible checkout form meeting WCAG 2.1 AA. All inputs have labels, required fields use aria-required, errors use aria-describedby.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CheckoutForm>;

export const Default: Story = {};

export const WithSubmitHandler: Story = {
  args: {
    onSubmit: (data: CheckoutFormData) => {
      console.log('Form submitted:', data);
    },
  },
};
