const ADMIN_EMAILS = ((import.meta.env.VITE_ADMIN_EMAILS as string) || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export const isAdmin = (email: string | null | undefined): boolean => {
  if (!email) {
    return false;
  }
  return ADMIN_EMAILS.includes(email.toLowerCase());
};
