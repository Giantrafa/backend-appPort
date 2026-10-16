import models from "../models/index.js";
import criarCrudService, { erroNaoEncontrado } from "./crudService.js";
import { includeTecnologias } from "./index.js";

const {
  Pessoa,
  Contato,
  Formacao,
  Experiencia,
  Projeto,
  Habilidade,
  PessoaHabilidade,
  Certificacao,
  Idioma,
} = models;

const crud = criarCrudService(Pessoa, { order: [["nome", "ASC"]] });

const achatarHabilidades = (habilidades) =>
  habilidades.map((habilidade) => {
    const { pessoa_habilidade, ...dados } = habilidade.toJSON();

    return { ...dados, nivel: pessoa_habilidade.nivel };
  });

const maisRecentesPrimeiro = [["data_inicio", "DESC"], ["id", "ASC"]];

const curriculo = async (id) => {
  const pessoa = await Pessoa.findByPk(id, {
    include: [
      { model: Contato, as: "contatos", separate: true, order: [["id", "ASC"]] },
      { model: Formacao, as: "formacoes", separate: true, order: maisRecentesPrimeiro },
      { model: Experiencia, as: "experiencias", separate: true, order: maisRecentesPrimeiro },
      {
        model: Projeto,
        as: "projetos",
        separate: true,
        order: maisRecentesPrimeiro,
        include: [includeTecnologias],
      },
      { model: Certificacao, as: "certificacoes", separate: true, order: [["data_emissao", "DESC"]] },
      { model: Idioma, as: "idiomas", separate: true, order: [["id", "ASC"]] },
      {
        model: Habilidade,
        as: "habilidades",
        attributes: ["id", "nome", "categoria"],
        through: { attributes: ["nivel"] },
      },
    ],
    order: [[{ model: Habilidade, as: "habilidades" }, "nome", "ASC"]],
  });

  if (!pessoa) {
    return null;
  }

  return { ...pessoa.toJSON(), habilidades: achatarHabilidades(pessoa.habilidades) };
};

const listarHabilidades = async (pessoaId) => {
  const pessoa = await Pessoa.findByPk(pessoaId, {
    include: [{ model: Habilidade, as: "habilidades", through: { attributes: ["nivel"] } }],
    order: [[{ model: Habilidade, as: "habilidades" }, "nome", "ASC"]],
  });

  if (!pessoa) {
    throw erroNaoEncontrado("Pessoa não encontrada");
  }

  return achatarHabilidades(pessoa.habilidades);
};

const vincularHabilidade = async (pessoaId, habilidadeId, nivel) => {
  const [pessoa, habilidade] = await Promise.all([
    Pessoa.findByPk(pessoaId),
    Habilidade.findByPk(habilidadeId),
  ]);

  if (!pessoa) throw erroNaoEncontrado("Pessoa não encontrada");
  if (!habilidade) throw erroNaoEncontrado("Habilidade não encontrada");

  await PessoaHabilidade.upsert({ pessoa_id: pessoaId, habilidade_id: habilidadeId, nivel });

  return listarHabilidades(pessoaId);
};

const desvincularHabilidade = async (pessoaId, habilidadeId) => {
  const removidos = await PessoaHabilidade.destroy({
    where: { pessoa_id: pessoaId, habilidade_id: habilidadeId },
  });

  return removidos > 0;
};

export default {
  ...crud,
  curriculo,
  listarHabilidades,
  vincularHabilidade,
  desvincularHabilidade,
};
