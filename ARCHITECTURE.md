# 🏛️ Architecture & Technical Design - PokéMMO Compendium

Questo documento delinea l'architettura, le convenzioni progettuali e le garanzie qualitative alla base della **PokéMMO Compendium Single Page Application (SPA)**.

---

## 1. Visione Architetturale e Filosofia

PokéMMO Compendium è concepita come una **Single Page Application ad alte prestazioni, deterministica e a basso consumo di risorse**:

- **Modern Web Stack**: Costruita su **React 19**, **Vite 7** e **Tailwind CSS 4**.
- **Zero Framework di Stato Esterni**: Nessuna dipendenza ingombrante di terze parti per lo stato (no Redux, no MobX, no TanStack Query / React Query). Lo stato globale è distribuito su React Context mirati e un custom caching engine reattivo.
- **Bundle Parsimonioso e Build Ultra-Rapida**: Code splitting selettivo (`manualChunks` in Rollup per isolare il vendor React e il vendor Firebase), overhead di compilazione azzerato e tempi di build di produzione nell'ordine di ~2 secondi.

---

## 2. Stratificazione dell'Applicazione

L'architettura del codice è rigorosamente suddivisa in layer indipendenti a responsabilità singola:

### 🎨 Presentation Layer

- **Pagine Feature-Scoped (`src/pages/<feature>/`)**: Componenti pagina caricati in modo asincrono (`lazy` / code-split) orchestrati dal router centrale (`src/app/router.tsx`).
- **Atomic UI Components (`src/components/ui/`)**: Primitivi atomici riutilizzabili (`PokemonSpriteCircle`, `PokemonCard`, `ItemImage`, modali e dropdown) dotati di fallback difensivi locali per gestire gracefully errori di rete o asset grafici mancanti senza crash visivi.

### 🔄 State & Context Layer (`src/context/`)

- Contesti React dedicati alla gestione delle macro-aree dell'applicazione:
  - `AuthContext`: Stato di sessione utente Firebase e privilegi amministrativi.
  - `PokedexContext`: Database indicizzato Pokémon con lookup maps (`pokemonMap`, `pokemonColorMap`).
  - `MovesContext`: Catalogo e type-mapping delle mosse Pokémon.
  - `ToastContext` & `ConfirmationContext`: Interfaccia reattiva per notifiche e dialoghi di conferma.

### ⚡ Caching & In-Flight Query Engine (`src/hooks/useDataQuery.ts`)

- Motore di interrogazione e caching in-memory progettato per sostituire librerie terze:
  - **Cache in-memory con TTL**: Time-to-live configurabile (default 5 minuti) per prevenire roundtrip ridondanti.
  - **Deduplicazione Promises in-flight**: Se una query verso una chiave è già in esecuzione, le richieste concorrenti condividono la medesima promise.
  - **Diagnostica DEV**: Accesso agli internals in ambiente di sviluppo tramite `window.__POKEMMO_CACHE__` (`getCache`, `getInflight`, `clear`, `getStats`).

### 💾 Data Access & Persistence Layer (`src/firebase/services/`)

- Utilizzo esclusivo di **Firebase Firestore Lite REST SDK** (`firebase/firestore/lite`): nessun canale WebSocket persistente o background polling non necessario, riducendo drasticamente il consumo di batteria e traffico dati.
- **Zod Schema Safe-Parsing a Runtime**: Ogni payload ricevuto da Firestore viene validato programmaticamente contro gli schemi Zod corrispondenti prima di propagarsi nell'applicazione. Questo garantisce l'isolamento totale da discrepanze o corruzioni del database.

### 📐 Domain Models & Schemas (`src/types/`)

- Schemi Zod e tipi TypeScript inferiti (`z.infer<typeof ...>`) rappresentano l'**unica fonte di verità (Single Source of Truth)** per tutti i modelli di dominio (Pokemon, BossFight, SuperTrainer, Raid, Pickup, TrainerRerun, Team).

### 🏷️ Static Domain Constants (`src/constants/`)

- Dati immutabili e costanti di calcolo di gioco (`standardPokemonList.ts`, `breedingConstants.ts`, ecc.) versionati con il codice per calcoli istantanei client-side.

---

## 3. Modello di Sicurezza e Autorizzazione

Il modello di sicurezza implementa il principio del **Defense-in-Depth** su due livelli complementari:

### 🛡️ Client Gating

- `ProtectedRoute.tsx`: Incapsula le rotte riservate agli utenti autenticati o dotati di privilegi speciali (es. creazione/modifica team e pannelli amministrativi), reindirizzando accessi non autorizzati.

### 🔒 Server Gating (`firestore/firestore.rules`)

- Regole Firestore dichiarative validate staticamente prima di ogni deploy:
  - **`isAdmin()`**: Verifica sicura che controlla i custom claims crittografati nel token JWT (`request.auth.token.admin == true`), impedendo escalation basate su campi modificabili nel documento.
  - **`isOwner(userId)`**: Controlla l'ownership puntuale dei documenti (`request.auth.uid == userId`).
  - **`notUpdating(protectedFields)`**: Blocca tassativamente la modifica di attributi sensibili (`['admin', 'role', 'permissions', 'createdAt', 'banned']`) durante gli update utente.
  - **Isolamento in Lettura e Scrittura**: Protezione stringente delle collezioni private e scrittura ristretta a `isAdmin()` per tutte le collezioni statiche di gioco (`pokedex`, `raids`, `super_trainers`, `pickup`, `boss_fights`, `trainer_rerun`, `moves`).

---

## 4. Testing Matrix e Verification Gates

La strategia di testing garantisce affidabilità, assenza di regressioni e confidenza prima del rilascio:

- **Algorithmic Domain Tests (`pnpm test:domain`)**:
  - Test unitari algoritmici ultra-veloci (<400ms) eseguiti direttamente su **Node runtime puro** (`vitest.config.domain.ts`) senza l'overhead di JSDOM.
- **Headless Component & Integration Tests (`pnpm test:run`)**:
  - Suite completa basata su **Vitest**, **JSDOM** e **React Testing Library** per testare l'interazione dei componenti, il ciclo di vita e i mock delle chiamate dati.
- **Property-Based Testing (PBT)**:
  - Utilizzo di `fast-check` per testare le formule matematiche critiche (calcolo probabilità catch rate e alberi genealogici di breeding) con centinaia di combinazioni generate casualmente.
- **Test Factories (`src/test/factories.ts`)**:
  - Funzioni generatrici di mock tipizzate al 100% per tutti i modelli di dominio, eliminando qualsiasi type assertion o cast non sicuro (`as unknown as ...`).
- **Quality Gates Pipeline (`pnpm validate`)**:
  - Pipeline unificata pre-commit e CI: `type-check` (TypeScript), `lint` (ESLint), `lint:style` (Stylelint), `format:check` (Prettier), `validate:data` (integrità referenziale dati statici) e `validate:rules` (sicurezza e sintassi regole Firestore).
