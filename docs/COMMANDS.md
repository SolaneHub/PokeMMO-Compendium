# 🛠️ Comandi Utili per PokeMMO Compendium

Questo file riassume i comandi principali per lo sviluppo, il testing e il deploy del progetto.

## 🚀 Sviluppo Locale

Questi comandi servono per lavorare sul progetto nel tuo computer.

| Comando           | Descrizione                                                                                                                    |
| :---------------- | :----------------------------------------------------------------------------------------------------------------------------- |
| **`npm run dev`** | **Avvia l'applicazione.** Lancia il frontend (Vite) in modalità sviluppo.                                                      |
| `npm run preview` | Simula la build di produzione in locale. Utile per controllare che il sito funzioni come se fosse online prima di fare deploy. |

## ✨ Qualità del Codice

Usa questi comandi per mantenere il codice pulito e ordinato.

| Comando            | Descrizione                                                      |
| :----------------- | :--------------------------------------------------------------- |
| **`npm run lint`** | Cerca errori nel codice (regole ESLint).                         |
| `npm run lint:fix` | Cerca errori e prova a **correggerli automaticamente**.          |
| `npm run format`   | Formatta tutto il codice (spazi, virgole, ecc.) usando Prettier. |

## 🌐 Deploy del Sito (GitHub Pages)

Comandi per pubblicare la parte visibile del sito.

| Comando              | Descrizione                                                                                                                   |
| :------------------- | :---------------------------------------------------------------------------------------------------------------------------- |
| **`npm run deploy`** | **Pubblica il sito.** Costruisce il progetto (`npm run build`) e lo carica su GitHub Pages.                                   |
| `npm run build`      | Compila solo il progetto nella cartella `dist/` senza pubblicarlo. Crea anche la pagina `404.html` necessaria per il routing. |

## 🔥 Database (Firebase)

Comandi per gestire il database e le regole di sicurezza.

| Comando                                | Descrizione                                                                                                  |
| :------------------------------------- | :----------------------------------------------------------------------------------------------------------- |
| **`firebase deploy --only firestore`** | Pubblica le **regole di sicurezza** (`firestore.rules`) e gli indici (`firestore.indexes.json`) su Firebase. |

---

### 📝 Note Importanti

- **Routing su GitHub Pages:** Il progetto è configurato per gestire il routing SPA su GitHub Pages tramite la creazione automatica di un file `404.html` durante la build.
