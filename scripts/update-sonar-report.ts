/* eslint-disable no-console */
import fs from "node:fs";

export interface SonarIssue {
  severity: string;
  type: string;
  component: string;
  line?: number | undefined;
  message: string;
}

export interface SonarSearchResponse {
  total: number;
  issues: SonarIssue[];
}

export const PROJECT_KEY = "SolaneHub_PokeMMO-Compendium";
export const SONAR_API_URL =
  "https://sonarcloud.io/api/issues/search?componentKeys=" +
  PROJECT_KEY +
  "&resolved=false&branch=main&ps=500";

export function formatSonarReport(
  issues: SonarIssue[],
  total: number,
  projectKey: string = PROJECT_KEY,
  dateStr: string = new Date().toLocaleString("it-IT", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
): string {
  let md = `# SonarCloud Report - Issues Aperti\n\n`;
  md += `Data: ${dateStr}\n`;
  md += `Totale Issues: ${total}\n\n`;
  md += `| Severity | Type | File | Line | Message |\n`;
  md += `|----------|------|------|------|---------|\n`;

  for (const issue of issues) {
    const file = issue.component.replace(`${projectKey}:`, "");
    const line = issue.line !== undefined ? String(issue.line) : "-";
    const message = issue.message.replace(/\|/g, "&#124;");
    md += `| ${issue.severity} | ${issue.type} | ${file} | ${line} | ${message} |\n`;
  }
  return md;
}

export async function updateReport(
  outputPath = "sonar-full-report.md",
  apiUrl = SONAR_API_URL,
  projectKey = PROJECT_KEY
): Promise<void> {
  console.log("\x1b[36m%s\x1b[0m", "Recupero delle issue da SonarCloud...");

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as SonarSearchResponse;
    const { issues, total } = data;

    const md = formatSonarReport(issues, total, projectKey);

    fs.writeFileSync(outputPath, md, "utf8");
    console.log(
      "\x1b[32m%s\x1b[0m",
      `Report aggiornato con successo: ${total} issue trovate.`
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(
      "\x1b[31m%s\x1b[0m",
      `Errore durante il recupero dei dati: ${message}`
    );
    process.exit(1);
  }
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("update-sonar-report.ts")) {
  void updateReport();
}
