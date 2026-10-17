import { describe, expect, it } from "vitest";

import {
  formatSonarReport,
  PROJECT_KEY,
  type SonarIssue,
} from "./update-sonar-report";

describe("formatSonarReport", () => {
  const fixedDate = "17/10/2026, 01:00:00";

  it("formatta correttamente l'intestazione, la data e la tabella markdown", () => {
    const issues: SonarIssue[] = [
      {
        severity: "MAJOR",
        type: "CODE_SMELL",
        component: `${PROJECT_KEY}:src/app/App.tsx`,
        line: 42,
        message: "Refactor this function",
      },
    ];

    const result = formatSonarReport(issues, 1, PROJECT_KEY, fixedDate);

    expect(result).toContain("# SonarCloud Report - Issues Aperti\n\n");
    expect(result).toContain(`Data: ${fixedDate}\n`);
    expect(result).toContain("Totale Issues: 1\n\n");
    expect(result).toContain("| Severity | Type | File | Line | Message |\n");
    expect(result).toContain("|----------|------|------|------|---------|\n");
    expect(result).toContain(
      "| MAJOR | CODE_SMELL | src/app/App.tsx | 42 | Refactor this function |\n"
    );
  });

  it("rimuove correttamente il prefisso del projectKey dal percorso del componente", () => {
    const customProjectKey = "Custom_Project_Key";
    const issues: SonarIssue[] = [
      {
        severity: "CRITICAL",
        type: "BUG",
        component: `${customProjectKey}:src/components/Button.tsx`,
        line: 12,
        message: "Potential bug",
      },
    ];

    const result = formatSonarReport(issues, 1, customProjectKey, fixedDate);

    expect(result).toContain(
      "| CRITICAL | BUG | src/components/Button.tsx | 12 | Potential bug |\n"
    );
  });

  it("sostituisce i caratteri pipe con &#124; nei messaggi per preservare la tabella", () => {
    const issues: SonarIssue[] = [
      {
        severity: "INFO",
        type: "VULNERABILITY",
        component: `${PROJECT_KEY}:src/utils/calc.ts`,
        line: 10,
        message: "Avoid using a | b syntax | check bitwise",
      },
    ];

    const result = formatSonarReport(issues, 1, PROJECT_KEY, fixedDate);

    expect(result).toContain(
      "| INFO | VULNERABILITY | src/utils/calc.ts | 10 | Avoid using a &#124; b syntax &#124; check bitwise |\n"
    );
  });

  it("sostituisce con un trattino '-' quando la proprietà line non è definita", () => {
    const issues: SonarIssue[] = [
      {
        severity: "MINOR",
        type: "CODE_SMELL",
        component: `${PROJECT_KEY}:package.json`,
        message: "Missing license specification",
      },
    ];

    const result = formatSonarReport(issues, 1, PROJECT_KEY, fixedDate);

    expect(result).toContain(
      "| MINOR | CODE_SMELL | package.json | - | Missing license specification |\n"
    );
  });

  it("gestisce un array vuoto di issues e totale pari a 0", () => {
    const result = formatSonarReport([], 0, PROJECT_KEY, fixedDate);

    expect(result).toContain("Totale Issues: 0\n\n");
    expect(result).toContain("| Severity | Type | File | Line | Message |\n");
    expect(result).toContain("|----------|------|------|------|---------|\n");
    const lines = result.trim().split("\n");
    // Dopo l'header della tabella non ci devono essere altre righe di dati
    expect(lines).toHaveLength(7);
  });
});
