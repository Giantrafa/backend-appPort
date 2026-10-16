export const erroNaoEncontrado = (mensagem) => {
  const erro = new Error(mensagem);
  erro.name = "NaoEncontradoError";

  return erro;
};

const criarCrudService = (Model, { include = [], filtros = [], order = [["id", "ASC"]] } = {}) => {
  const listar = (query = {}) => {
    const where = {};

    filtros.forEach((campo) => {
      if (query[campo] !== undefined) {
        where[campo] = query[campo];
      }
    });

    return Model.findAll({ where, include, order });
  };

  const buscarPorId = (id) => Model.findByPk(id, { include });

  const criar = async (dados) => {
    const { id: _id, ...campos } = dados;
    const registro = await Model.create(campos);

    return buscarPorId(registro.id);
  };

  const atualizar = async (id, dados) => {
    const registro = await Model.findByPk(id);

    if (!registro) {
      return null;
    }

    const { id: _id, ...campos } = dados;
    await registro.update(campos);

    return buscarPorId(id);
  };

  const remover = async (id) => {
    const removidos = await Model.destroy({ where: { id } });

    return removidos > 0;
  };

  return { listar, buscarPorId, criar, atualizar, remover };
};

export default criarCrudService;
