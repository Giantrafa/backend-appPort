import { projetoService } from "../services/index.js";
import criarCrudController from "./crudController.js";

const crud = criarCrudController(projetoService, "Projeto não encontrado");

const vincularTecnologia = async (req, res) => {
  const { habilidade_id } = req.body ?? {};

  if (!habilidade_id) {
    return res.status(400).json({ mensagem: "O campo habilidade_id é obrigatório" });
  }

  const projeto = await projetoService.vincularTecnologia(req.params.id, habilidade_id);

  return res.status(200).json(projeto);
};

const desvincularTecnologia = async (req, res) => {
  const removido = await projetoService.desvincularTecnologia(req.params.id, req.params.habilidadeId);

  return removido
    ? res.status(204).send()
    : res.status(404).json({ mensagem: "Esse projeto não usa essa tecnologia" });
};

export default { ...crud, vincularTecnologia, desvincularTecnologia };
