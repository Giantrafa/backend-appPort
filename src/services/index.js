import models from "../models/index.js";
import criarCrudService, { erroNaoEncontrado } from "./crudService.js";

const { Contato, Formacao, Experiencia, Projeto, Habilidade, ProjetoHabilidade, Certificacao, Idioma } =
  models;

const maisRecentesPrimeiro = [["data_inicio", "DESC"], ["id", "ASC"]];

export const includeTecnologias = {
  model: Habilidade,
  as: "tecnologias",
  attributes: ["id", "nome", "categoria"],
  through: { attributes: [] },
};

export const contatoService = criarCrudService(Contato, { filtros: ["pessoa_id", "tipo"] });

export const formacaoService = criarCrudService(Formacao, {
  filtros: ["pessoa_id", "nivel"],
  order: maisRecentesPrimeiro,
});

export const experienciaService = criarCrudService(Experiencia, {
  filtros: ["pessoa_id", "tipo"],
  order: maisRecentesPrimeiro,
});

export const certificacaoService = criarCrudService(Certificacao, {
  filtros: ["pessoa_id"],
  order: [["data_emissao", "DESC"], ["id", "ASC"]],
});

export const idiomaService = criarCrudService(Idioma, { filtros: ["pessoa_id"] });

export const habilidadeService = criarCrudService(Habilidade, {
  filtros: ["categoria"],
  order: [["nome", "ASC"]],
});

const projetoCrud = criarCrudService(Projeto, {
  filtros: ["pessoa_id", "experiencia_id"],
  include: [includeTecnologias],
  order: maisRecentesPrimeiro,
});

const vincularTecnologia = async (projetoId, habilidadeId) => {
  const [projeto, habilidade] = await Promise.all([
    Projeto.findByPk(projetoId),
    Habilidade.findByPk(habilidadeId),
  ]);

  if (!projeto) throw erroNaoEncontrado("Projeto não encontrado");
  if (!habilidade) throw erroNaoEncontrado("Habilidade não encontrada");

  await ProjetoHabilidade.findOrCreate({
    where: { projeto_id: projetoId, habilidade_id: habilidadeId },
  });

  return projetoCrud.buscarPorId(projetoId);
};

const desvincularTecnologia = async (projetoId, habilidadeId) => {
  const removidos = await ProjetoHabilidade.destroy({
    where: { projeto_id: projetoId, habilidade_id: habilidadeId },
  });

  return removidos > 0;
};

export const projetoService = { ...projetoCrud, vincularTecnologia, desvincularTecnologia };
