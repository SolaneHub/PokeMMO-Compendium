# PokeMMO Compendium - Color Palette

This document contains the official color palette and references to the Tailwind classes used in the project.

## Primary Colors

| Color Name | Tailwind Class | HEX/RGB Code | Intended Usage |
| :--- | :--- | :--- | :--- |
| **Background Deep** | `bg-[#0f1014]` | `#0F1014` | Main application background. |
| **Surface/Sidebar** | `bg-[#1a1b20]` | `#1A1B20` | Sidebar and elevated panels background. |
| **Primary Accent** | `bg-blue-600` / `text-blue-400` | `#2563EB` / `#60A5FA` | Primary color for buttons, active states, and icons. |
| **Text Primary** | `text-slate-200` | `#E2E8F0` | Main text and titles. |
| **Text Secondary** | `text-slate-400` | `#94A3B8` | Secondary text and inactive icons. |
| **Text Muted** | `text-slate-500` | `#64748B` | Metadata and disabled states. |
| **Border Dark** | `border-white/5` | `rgba(255,255,255,0.05)` | Thin borders and separators. |
| **Brand Gradient** | `from-blue-400 to-purple-400` | `#60A5FA` → `#C084FC` | Logo and high-impact titles. |
| **Danger/Alert** | `text-red-400` | `#F87171` | Error messages or destructive actions. |

## Technical Notes (Tailwind v4)
The project uses the standard values of the **Slate** scale from Tailwind CSS for grays and the **Blue** scale for accents.

- **Scrollbar:** Uses `slate-700` (`#334155`) for the thumb.
- **Interactivity:** Hover states on the sidebar usually use `white/5` as a semi-transparent background.
- **Dark Mode:** `color-scheme: dark` is forced in the root CSS.