export const logger = {
  log: (...args) => {
    if (import.meta.env.DEV) console.log(...args);
  },
  error: (...args) => {
    if (import.meta.env.DEV) console.error(...args);
    // In production, this could be sent to a monitoring service (e.g., Sentry)
  },
  warn: (...args) => {
    if (import.meta.env.DEV) console.warn(...args);
  }
};
