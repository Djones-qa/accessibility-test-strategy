/**
 * Minimal type declarations for pa11y v8.
 * Pa11y does not ship its own TypeScript definitions.
 */
declare module 'pa11y' {
  export interface Pa11yIssue {
    type: 'error' | 'warning' | 'notice';
    code: string;
    message: string;
    context: string;
    selector: string;
    runner: string;
    runnerExtras: Record<string, unknown>;
  }

  export interface Pa11yResults {
    documentTitle: string;
    pageUrl: string;
    issues: Pa11yIssue[];
  }

  export interface Pa11yOptions {
    standard?: 'Section508' | 'WCAG2A' | 'WCAG2AA' | 'WCAG2AAA';
    timeout?: number;
    wait?: number;
    chromeLaunchConfig?: {
      args?: string[];
      executablePath?: string;
    };
    runners?: string[];
    includeNotices?: boolean;
    includeWarnings?: boolean;
  }

  function pa11y(url: string, options?: Pa11yOptions): Promise<Pa11yResults>;
  export default pa11y;
}
