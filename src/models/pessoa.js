const getPessoaModel = (sequelize, { DataTypes }) => {
  const Pessoa = sequelize.define(
    "pessoa",
    {
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: "O nome é obrigatório" } },
      },
      titulo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Já existe uma pessoa com este e-mail" },
        validate: { isEmail: { msg: "E-mail inválido" } },
      },
      telefone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cidade: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      data_nascimento: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      resumo: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      foto_url: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { isUrl: { msg: "foto_url deve ser uma URL válida" } },
      },
    },
    {
      tableName: "pessoas",
      underscored: true,
    }
  );

  Pessoa.associate = (models) => {
    const cascata = { foreignKey: "pessoa_id", onDelete: "CASCADE" };

    Pessoa.hasMany(models.Contato, { ...cascata, as: "contatos" });
    Pessoa.hasMany(models.Formacao, { ...cascata, as: "formacoes" });
    Pessoa.hasMany(models.Experiencia, { ...cascata, as: "experiencias" });
    Pessoa.hasMany(models.Projeto, { ...cascata, as: "projetos" });
    Pessoa.hasMany(models.Certificacao, { ...cascata, as: "certificacoes" });
    Pessoa.hasMany(models.Idioma, { ...cascata, as: "idiomas" });

    Pessoa.belongsToMany(models.Habilidade, {
      through: models.PessoaHabilidade,
      foreignKey: "pessoa_id",
      otherKey: "habilidade_id",
      as: "habilidades",
    });
  };

  return Pessoa;
};

export default getPessoaModel;
