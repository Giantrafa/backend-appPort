import { Router } from "express";
import validarId from "../middlewares/validarId.js";

const criarCrudRouter = (controller) => {
  const router = Router();

  router.get("/", controller.listar);
  router.get("/:id", validarId, controller.buscar);
  router.post("/", controller.criar);
  router.put("/:id", validarId, controller.atualizar);
  router.patch("/:id", validarId, controller.atualizar);
  router.delete("/:id", validarId, controller.remover);

  return router;
};

export default criarCrudRouter;
