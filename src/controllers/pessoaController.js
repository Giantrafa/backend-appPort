import pessoaService from "../services/pessoaService.js";
import criarCrudController from "./crudController.js";

const crud = criarCrudController(pessoaService, "Pessoa não encontrada");

const curriculo = async (req, res) => {
  const pessoa = await pessoaService.curriculo(req.params.id);

  if (!pessoa) {
    return res.status(404).json({ mensagem: "Pessoa não encontrada" });
  }

  return res.status(200).json(pessoa);
};

const listarHabilidades = async (req, res) => {
  const habilidades = await pessoaService.listarHabilidades(req.params.id);

  return res.status(200).json(habilidades);
};

const vincularHabilidade = async (req, res) => {
  const { habilidade_id, nivel } = req.body ?? {};

  if (!habilidade_id) {
    return res.status(400).json({ mensagem: "O campo habilidade_id é obrigatório" });
  }

  const habilidades = await pessoaService.vincularHabilidade(req.params.id, habilidade_id, nivel);

  return res.status(200).json(habilidades);
};

const desvincularHabilidade = async (req, res) => {
  const removido = await pessoaService.desvincularHabilidade(req.params.id, req.params.habilidadeId);

  return removido
    ? res.status(204).send()
    : res.status(404).json({ mensagem: "Essa pessoa não possui essa habilidade" });
};

export default { ...crud, curriculo, listarHabilidades, vincularHabilidade, desvincularHabilidade };
