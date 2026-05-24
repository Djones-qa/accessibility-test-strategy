/**
 * Type declarations for jest-axe v8.
 * jest-axe does not ship TypeScript definitions in this version.
 */
import type { AxeResults } from 'axe-core';

declare module 'jest-axe' {
  export interface JestAxeConfigureOptions {
    globalOptions?: Record<string, unknown>;
    impactLevels?: string[];
  }

  export function axe(
    html: Element | string,
    options?: Record<string, unknown>
  ): Promise<AxeResults>;

  export function configureAxe(options: JestAxeConfigureOptions): typeof axe;

  export const toHaveNoViolations: {
    toHaveNoViolations(received: AxeResults): {
      pass: boolean;
      message: () => string;
    };
  };
}

// Augment Jest's expect matchers to include toHaveNoViolations
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Matchers<R, T = {}> {
      toHaveNoViolations(): R;
    }
  }
}
