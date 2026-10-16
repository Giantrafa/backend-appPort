const tratarErros = (erro, req, res, next) => {
  if (erro.type === "entity.parse.failed") {
    return res.status(400).json({ mensagem: "JSON inválido no corpo da requisição" });
  }

  if (erro.name === "NaoEncontradoError") {
    return res.status(404).json({ mensagem: erro.message });
  }

  if (erro.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      mensagem: "Registro duplicado",
      erros: erro.errors.map((e) => e.message),
    });
  }

  if (erro.name === "SequelizeValidationError") {
    return res.status(400).json({
      mensagem: "Dados inválidos",
      erros: erro.errors.map((e) => e.message),
    });
  }

  if (erro.name === "SequelizeForeignKeyConstraintError") {
    return res.status(400).json({
      mensagem: "Registro relacionado não existe (verifique pessoa_id, experiencia_id etc.)",
    });
  }

  if (erro.name === "SequelizeDatabaseError") {
    return res.status(400).json({ mensagem: "Dados inválidos", erros: [erro.parent?.message ?? erro.message] });
  }

  console.error(erro);

  return res.status(500).json({ mensagem: "Erro interno do servidor" });
};

export default tratarErros;
