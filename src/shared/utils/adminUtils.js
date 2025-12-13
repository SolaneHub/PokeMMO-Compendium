// src/shared/utils/adminUtils.js
// This is a placeholder for admin email check.
// In a real application, this list would be fetched from a secure backend
// or managed via Firebase Custom Claims or a Firestore collection.

const ADMIN_EMAILS = [
  "simonelostimolo@gmail.com",  // Replace with actual admin email(s)
];

export const isAdmin = (email) => {
  if (!email) {
    return false;
  }
  return ADMIN_EMAILS.includes(email.toLowerCase());
};
