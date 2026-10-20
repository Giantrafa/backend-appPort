import "dotenv/config";
import models, { sequelize } from "../models/index.js";
import { habilidades, pessoas } from "./dados.js";

const {
  Pessoa,
  Contato,
  Formacao,
  Experiencia,
  Projeto,
  Habilidade,
  PessoaHabilidade,
  ProjetoHabilidade,
  Certificacao,
  Idioma,
} = models;

const comPessoa = (lista = [], pessoa_id) => lista.map((item) => ({ ...item, pessoa_id }));

const semear = async () => {
  await sequelize.sync({ force: true });

  await sequelize.transaction(async (transaction) => {
    const criadas = await Habilidade.bulkCreate(habilidades, { transaction });
    const habilidadePorNome = Object.fromEntries(criadas.map((h) => [h.nome, h.id]));

    const idDaHabilidade = (nome) => {
      if (!habilidadePorNome[nome]) {
        throw new Error(`Habilidade "${nome}" não está na lista de habilidades do seed`);
      }

      return habilidadePorNome[nome];
    };

    for (const dados of pessoas) {
      const { contatos, formacoes, experiencias, projetos, habilidades: suas, certificacoes, idiomas, ...perfil } =
        dados;

      const pessoa = await Pessoa.create(perfil, { transaction });
      const pessoa_id = pessoa.id;

      await Contato.bulkCreate(comPessoa(contatos, pessoa_id), { transaction });
      await Formacao.bulkCreate(comPessoa(formacoes, pessoa_id), { transaction });
      await Certificacao.bulkCreate(comPessoa(certificacoes, pessoa_id), { transaction });
      await Idioma.bulkCreate(comPessoa(idiomas, pessoa_id), { transaction });

      const experienciasCriadas = await Experiencia.bulkCreate(comPessoa(experiencias, pessoa_id), {
        transaction,
      });

      const idDaExperiencia = (referencia) => {
        if (!referencia) return null;

        const encontradas = experienciasCriadas.filter(
          (e) => e.empresa === referencia || e.cargo === referencia || `${e.empresa} - ${e.cargo}` === referencia
        );

        if (encontradas.length !== 1) {
          throw new Error(
            `Experiência "${referencia}" de ${perfil.nome} ${encontradas.length ? "é ambígua (use \"Empresa - Cargo\")" : "não existe"}`
          );
        }

        return encontradas[0].id;
      };

      for (const { tecnologias = [], experiencia, ...projeto } of projetos) {
        const criado = await Projeto.create(
          { ...projeto, pessoa_id, experiencia_id: idDaExperiencia(experiencia) },
          { transaction }
        );

        await ProjetoHabilidade.bulkCreate(
          tecnologias.map((nome) => ({ projeto_id: criado.id, habilidade_id: idDaHabilidade(nome) })),
          { transaction }
        );
      }

      await PessoaHabilidade.bulkCreate(
        suas.map(({ nome, nivel }) => ({ pessoa_id, habilidade_id: idDaHabilidade(nome), nivel })),
        { transaction }
      );

      console.log(`✔ ${pessoa.nome} (id ${pessoa_id})`);
    }
  });
};

semear()
  .then(() => console.log("Seed concluído!"))
  .catch((erro) => {
    console.error("Erro no seed:", erro.message);
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());
