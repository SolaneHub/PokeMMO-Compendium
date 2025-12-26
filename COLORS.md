# PokeMMO Compendium - Color Palette

Questo documento contiene la palette colori ufficiale e i riferimenti alle classi Tailwind utilizzate nel progetto.

## Colori Principali

| Nome Colore | Classe Tailwind | Codice HEX/RGB | Utilizzo Intuito |
| :--- | :--- | :--- | :--- |
| **Background Deep** | `bg-[#0f1014]` | `#0F1014` | Sfondo principale dell'applicazione. |
| **Surface/Sidebar** | `bg-[#1a1b20]` | `#1A1B20` | Sfondo della sidebar e dei pannelli elevati. |
| **Primary Accent** | `bg-blue-600` / `text-blue-400` | `#2563EB` / `#60A5FA` | Colore primario per bottoni, stati attivi e icone. |
| **Text Primary** | `text-slate-200` | `#E2E8F0` | Testo principale e titoli. |
| **Text Secondary** | `text-slate-400` | `#94A3B8` | Testo secondario e icone inattive. |
| **Text Muted** | `text-slate-500` | `#64748B` | Metadati e stati disabilitati. |
| **Border Dark** | `border-white/5` | `rgba(255,255,255,0.05)` | Bordi sottili e separatori. |
| **Brand Gradient** | `from-blue-400 to-purple-400` | `#60A5FA` → `#C084FC` | Logo e titoli di grande impatto. |
| **Danger/Alert** | `text-red-400` | `#F87171` | Messaggi di errore o azioni distruttive. |

## Note Tecniche (Tailwind v4)
Il progetto utilizza i valori standard della scala **Slate** di Tailwind CSS per i grigi e la scala **Blue** per gli accenti. 

- **Scrollbar:** Utilizza `slate-700` (`#334155`) per il thumb.
- **Interattività:** Gli stati hover sulla sidebar usano solitamente `white/5` come background semi-trasparente.
- **Dark Mode:** `color-scheme: dark` è forzato nel root CSS.
