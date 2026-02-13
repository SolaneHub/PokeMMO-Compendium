# 🛠️ Comandi Utili per PokeMMO Compendium

Questo file riassume i comandi principali per lo sviluppo, il testing e il deploy del progetto.

## 🚀 Sviluppo Locale

Questi comandi servono per lavorare sul progetto nel tuo computer.

| Comando | Descrizione |
| :--- | :--- |
| **`npm run dev`** | **Avvia tutto.** Lancia sia il frontend (Vite) che il backend locale (Express) contemporaneamente. Usa questo per sviluppare. |
| `npm run server` | Avvia **solo** il backend locale (utile se vuoi testare solo le API su `localhost:3001`). |
| `npm run preview` | Simula la build di produzione in locale. Utile per controllare che il sito funzioni come se fosse online prima di fare deploy. |

## ✨ Qualità del Codice

Usa questi comandi per mantenere il codice pulito e ordinato.

| Comando | Descrizione |
| :--- | :--- |
| **`npm run lint`** | Cerca errori nel codice (regole ESLint). |
| `npm run lint:fix` | Cerca errori e prova a **correggerli automaticamente**. |
| `npm run format` | Formatta tutto il codice (spazi, virgole, ecc.) usando Prettier. |

## 🌐 Deploy del Sito (GitHub Pages)

Comandi per pubblicare la parte visibile del sito.

| Comando | Descrizione |
| :--- | :--- |
| **`npm run deploy`** | **Pubblica il sito.** Costruisce il progetto (`npm run build`) e lo carica su GitHub Pages. |
| `npm run build` | Compila solo il progetto nella cartella `dist/` senza pubblicarlo. Crea anche la pagina `404.html` necessaria per il routing. |

## 🔥 Database (Firebase)

Comandi per gestire il database e le regole di sicurezza.

| Comando | Descrizione |
| :--- | :--- |
| **`firebase deploy --only firestore`** | Pubblica le **regole di sicurezza** (`firestore.rules`) e gli indici (`firestore.indexes.json`) su Firebase. |

---

### 📝 Note Importanti
*   **Backend Locale vs Firebase:** Il comando `npm run server` gestisce solo i dati "statici" modificabili tramite l'editor (es. team della lega). I dati degli utenti ("My Teams") sono gestiti direttamente da Firebase e non passano per questo server locale.
*   **Functions:** Non ci sono Cloud Functions attive in questo progetto (sono state rimosse per compatibilità col piano gratuito).
