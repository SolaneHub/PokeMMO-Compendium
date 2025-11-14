import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();

const PORT = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Percorso assoluto al file JSON
const dataPath = path.join(process.cwd(), "src/pages/red/data/redData.json");

// GET → Leggere i dati
app.get("/api/elite-four", (req, res) => {
  try {
    const rawData = fs.readFileSync(dataPath, "utf-8");
    const data = JSON.parse(rawData);
    res.json(data);
  } catch (err) {
    console.error("Errore lettura eliteFourData.json:", err);
    res.status(500).json({ error: "Impossibile leggere i dati" });
  }
});

// POST → Salvare i dati
app.post("/api/elite-four", (req, res) => {
  try {
    const newData = req.body;

    // Scrivi i nuovi dati
    fs.writeFileSync(dataPath, JSON.stringify(newData, null, 2), "utf-8");
    res.json({ success: true, message: "Dati salvati con successo" });
  } catch (err) {
    console.error("Errore salvataggio eliteFourData.json:", err);
    res.status(500).json({ error: "Impossibile salvare i dati" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend avviato su http://localhost:${PORT}`);
});
