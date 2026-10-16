import { Router } from "express";

import criarCrudController from "../controllers/crudController.js";
import pessoaController from "../controllers/pessoaController.js";
import projetoController from "../controllers/projetoController.js";
import validarId from "../middlewares/validarId.js";
import {
  certificacaoService,
  contatoService,
  experienciaService,
  formacaoService,
  habilidadeService,
  idiomaService,
} from "../services/index.js";
import criarCrudRouter from "./crudRouter.js";

const router = Router();

const pessoaRouter = criarCrudRouter(pessoaController);
pessoaRouter.get("/:id/curriculo", validarId, pessoaController.curriculo);
pessoaRouter.get("/:id/habilidades", validarId, pessoaController.listarHabilidades);
pessoaRouter.post("/:id/habilidades", validarId, pessoaController.vincularHabilidade);
pessoaRouter.delete("/:id/habilidades/:habilidadeId", validarId, pessoaController.desvincularHabilidade);

const projetoRouter = criarCrudRouter(projetoController);
projetoRouter.post("/:id/tecnologias", validarId, projetoController.vincularTecnologia);
projetoRouter.delete("/:id/tecnologias/:habilidadeId", validarId, projetoController.desvincularTecnologia);

router.use("/pessoas", pessoaRouter);
router.use("/projetos", projetoRouter);
router.use("/contatos", criarCrudRouter(criarCrudController(contatoService, "Contato não encontrado")));
router.use("/formacoes", criarCrudRouter(criarCrudController(formacaoService, "Formação não encontrada")));
router.use("/experiencias", criarCrudRouter(criarCrudController(experienciaService, "Experiência não encontrada")));
router.use("/habilidades", criarCrudRouter(criarCrudController(habilidadeService, "Habilidade não encontrada")));
router.use("/certificacoes", criarCrudRouter(criarCrudController(certificacaoService, "Certificação não encontrada")));
router.use("/idiomas", criarCrudRouter(criarCrudController(idiomaService, "Idioma não encontrado")));

export default router;
