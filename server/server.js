import cors from "cors";
import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

const DATA_DIR = path.join(process.cwd(), "src/data");

const getFilePath = (fileName) => {
  const safeName = path.basename(fileName);
  return path.join(DATA_DIR, safeName);
};

app.get("/api/files", (req, res) => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      return res.status(404).json({ error: "Directory dati non trovata" });
    }
    const files = fs
      .readdirSync(DATA_DIR)
      .filter((file) => file.endsWith(".json"));
    res.json(files);
  } catch (err) {
    console.error("Errore lettura directory:", err);
    res.status(500).json({ error: "Impossibile leggere la directory" });
  }
});

app.get("/api/data", (req, res) => {
  const fileName = req.query.file;
  if (!fileName) {
    return res.status(400).json({ error: "Nome file mancante" });
  }

  try {
    const filePath = getFilePath(fileName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File non trovato" });
    }
    const rawData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(rawData);
    res.json(data);
  } catch (err) {
    console.error(`Errore lettura ${fileName}:`, err);
    res.status(500).json({ error: "Impossibile leggere il file" });
  }
});

app.post("/api/data", (req, res) => {
  const fileName = req.query.file;
  if (!fileName) {
    return res.status(400).json({ error: "Nome file mancante" });
  }

  try {
    const newData = req.body;
    const filePath = getFilePath(fileName);

    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), "utf-8");
    res.json({
      success: true,
      message: `File ${fileName} salvato con successo`,
    });
  } catch (err) {
    console.error(`Errore salvataggio ${fileName}:`, err);
    res.status(500).json({ error: "Impossibile salvare il file" });
  }
});

app.get("/api/proxy-image", async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).send("URL parameter is required");
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).send("Failed to fetch image");
    }

    const contentType = response.headers.get("content-type");
    if (contentType) {
      res.setHeader("Content-Type", contentType);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.send(buffer);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).send("Proxy error");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend avviato su http://localhost:${PORT}`);
  console.log(`📂 Cartella dati: ${DATA_DIR}`);
});
