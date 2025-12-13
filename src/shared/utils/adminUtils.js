// src/shared/utils/adminUtils.js
// This is a placeholder for admin email check.
// In a real application, this list would be fetched from a secure backend
// or managed via Firebase Custom Claims or a Firestore collection.

const ADMIN_EMAILS = [
  // Add admin emails here, e.g., "admin@example.com", "your.email@example.com"
  // For now, it's an empty list to prevent accidental admin access.
  // The user can populate this list with their admin emails.
];

export const isAdmin = (email) => {
  if (!email) {
    return false;
  }
  return ADMIN_EMAILS.includes(email.toLowerCase());
};
