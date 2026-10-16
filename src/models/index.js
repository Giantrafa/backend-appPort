import Sequelize from "sequelize";
import pg from "pg";

import getPessoaModel from "./pessoa.js";
import getContatoModel from "./contato.js";
import getFormacaoModel from "./formacao.js";
import getExperienciaModel from "./experiencia.js";
import getProjetoModel from "./projeto.js";
import getHabilidadeModel from "./habilidade.js";
import getPessoaHabilidadeModel from "./pessoaHabilidade.js";
import getProjetoHabilidadeModel from "./projetoHabilidade.js";
import getCertificacaoModel from "./certificacao.js";
import getIdiomaModel from "./idioma.js";

const usarSsl = !/localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL ?? "");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectModule: pg,
  logging: false,
  pool: { max: 3, min: 0, idle: 10000, acquire: 30000 },
  dialectOptions: usarSsl ? { ssl: { require: true, rejectUnauthorized: false } } : {},
});

const models = {
  Pessoa: getPessoaModel(sequelize, Sequelize),
  Contato: getContatoModel(sequelize, Sequelize),
  Formacao: getFormacaoModel(sequelize, Sequelize),
  Experiencia: getExperienciaModel(sequelize, Sequelize),
  Projeto: getProjetoModel(sequelize, Sequelize),
  Habilidade: getHabilidadeModel(sequelize, Sequelize),
  PessoaHabilidade: getPessoaHabilidadeModel(sequelize, Sequelize),
  ProjetoHabilidade: getProjetoHabilidadeModel(sequelize, Sequelize),
  Certificacao: getCertificacaoModel(sequelize, Sequelize),
  Idioma: getIdiomaModel(sequelize, Sequelize),
};

Object.keys(models).forEach((key) => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };
export default models;
