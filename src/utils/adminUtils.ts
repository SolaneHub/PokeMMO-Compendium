const ADMIN_EMAILS = new Set(
  ((import.meta.env["VITE_ADMIN_EMAILS"] as string) || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
);

export const isAdmin = (email: string | null | undefined): boolean => {
  if (!email) {
    return false;
  }
  return ADMIN_EMAILS.has(email.toLowerCase());
};
