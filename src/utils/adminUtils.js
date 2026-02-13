const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ||"") .split(",") .map((email) => email.trim().toLowerCase()) .filter(Boolean); export const isAdmin = (email) => { if (!email) { return false; } return ADMIN_EMAILS.includes(email.toLowerCase());
}; 
