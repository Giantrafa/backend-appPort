const criarCrudController = (service, mensagemNaoEncontrado) => {
  const naoEncontrado = (res) => res.status(404).json({ mensagem: mensagemNaoEncontrado });

  const listar = async (req, res) => {
    const registros = await service.listar(req.query);

    return res.status(200).json(registros);
  };

  const buscar = async (req, res) => {
    const registro = await service.buscarPorId(req.params.id);

    return registro ? res.status(200).json(registro) : naoEncontrado(res);
  };

  const criar = async (req, res) => {
    const registro = await service.criar(req.body ?? {});

    return res.status(201).json(registro);
  };

  const atualizar = async (req, res) => {
    const registro = await service.atualizar(req.params.id, req.body ?? {});

    return registro ? res.status(200).json(registro) : naoEncontrado(res);
  };

  const remover = async (req, res) => {
    const removido = await service.remover(req.params.id);

    return removido ? res.status(204).send() : naoEncontrado(res);
  };

  return { listar, buscar, criar, atualizar, remover };
};

export default criarCrudController;
