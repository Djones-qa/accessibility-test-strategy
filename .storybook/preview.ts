import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    a11y: {
      // Run axe on every story automatically
      config: {
        rules: [
          {
            // Enforce WCAG 2.1 AA
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
      options: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21aa'],
        },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
