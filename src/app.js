import cors from "cors";
import express from "express";

import tratarErros from "./middlewares/tratarErros.js";
import routes from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({
    mensagem: "API de currículos executando...",
    recursos: [
      "/pessoas",
      "/pessoas/:id/curriculo",
      "/contatos",
      "/formacoes",
      "/experiencias",
      "/projetos",
      "/habilidades",
      "/certificacoes",
      "/idiomas",
    ],
  });
});

app.use(routes);

app.use((req, res) => {
  return res.status(404).json({ mensagem: `Rota ${req.method} ${req.path} não encontrada` });
});

app.use(tratarErros);

export default app;
