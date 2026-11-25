// server.ts
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var port = Number(process.env.PORT || 3e3);
var distDir = path.resolve(__dirname, "dist");
app.disable("x-powered-by");
app.use(express.static(distDir, { index: false }));
app.get("*", (_req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});
app.listen(port, "0.0.0.0", () => {
  console.log(`DILUX GROUP server listening on port ${port}`);
});
