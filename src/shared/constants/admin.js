export const ADMIN_EMAILS = [
  "simonelostimolo@gmail.com",
];

export const isAdmin = (email) => {
  return ADMIN_EMAILS.includes(email);
};
