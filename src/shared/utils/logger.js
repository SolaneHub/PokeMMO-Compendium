const IS_PRODUCTION = !import.meta.env.DEV;

export const logger = {
  log: (...args) => {
    // Log to console in both DEV and PROD for DevTools visibility
    console.log(...args);
  },
  error: (...args) => {
    // Always log to console so it's captured by DevTools and standard log aggregators
    console.error(...args);

    // In production, forward to a monitoring service or global handler if available
    if (IS_PRODUCTION) {
      // Example: Sentry.captureException(args[0]);
      if (
        typeof window !== "undefined" &&
        typeof window.reportError === "function"
      ) {
        window.reportError(...args);
      }
    }
  },
  warn: (...args) => {
    // Warn to console in both DEV and PROD
    console.warn(...args);
  },
};
