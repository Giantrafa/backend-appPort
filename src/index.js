import "dotenv/config";
import app from "./app.js";
import { sequelize } from "./models/index.js";

const port = process.env.PORT || 3000;

if (!process.env.VERCEL) {
  sequelize
    .sync()
    .then(() => {
      app.listen(port, () => console.log(`Servidor rodando na porta ${port}!`));
    })
    .catch((erro) => {
      console.error("Erro ao conectar com o banco de dados:", erro.message);
      process.exit(1);
    });
}

export default app;
