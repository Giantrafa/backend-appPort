const validarId = (req, res, next) => {
  const invalido = Object.entries(req.params).find(
    ([nome, valor]) => /id$/i.test(nome) && !/^[1-9]\d*$/.test(valor)
  );

  if (invalido) {
    return res.status(400).json({ mensagem: `Parâmetro ${invalido[0]} inválido` });
  }

  return next();
};

export default validarId;
