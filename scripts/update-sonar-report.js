import fs from "fs";

/**
 * Script per aggiornare il report delle issue di SonarCloud.
 * Compatibile con Windows e macOS (Node.js 18+).
 * Recupera le issue aperte dal branch 'main' del progetto PokeMMO-Compendium.
 */

const projectKey = "SolaneHub_PokeMMO-Compendium";
const uri = `https://sonarcloud.io/api/issues/search?componentKeys=${projectKey}&resolved=false&branch=main&ps=500`;

async function updateReport() {
  console.log("\x1b[36m%s\x1b[0m", "Recupero delle issue da SonarCloud...");

  try {
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const { issues, total } = data;

    // Formattazione della data in italiano
    const dateStr = new Date().toLocaleString("it-IT", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    let md = `# SonarCloud Report - Issues Aperti\n\n`;
    md += `Data: ${dateStr}\n`;
    md += `Totale Issues: ${total}\n\n`;
    md += `| Severity | Type | File | Line | Message |\n`;
    md += `|----------|------|------|------|---------|\n`;

    for (const issue of issues) {
      // Pulisce il percorso del file rimuovendo il prefisso del progetto
      const file = issue.component.replace(`${projectKey}:`, "");
      const line = issue.line || "-";
      // Escape del carattere pipe per non rompere la tabella markdown
      const message = issue.message.replace(/\|/g, "&#124;");

      md += `| ${issue.severity} | ${issue.type} | ${file} | ${line} | ${message} |\n`;
    }

    fs.writeFileSync("sonar-full-report.md", md, "utf8");
    console.log(
      "\x1b[32m%s\x1b[0m",
      `Report aggiornato con successo: ${total} issue trovate.`
    );
  } catch (error) {
    console.error(
      "\x1b[31m%s\x1b[0m",
      `Errore durante il recupero dei dati: ${error.message}`
    );
    process.exit(1);
  }
}

updateReport();
