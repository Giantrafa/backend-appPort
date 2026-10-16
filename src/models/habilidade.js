const getHabilidadeModel = (sequelize, { DataTypes }) => {
  const Habilidade = sequelize.define(
    "habilidade",
    {
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Já existe uma habilidade com este nome" },
        validate: { notEmpty: { msg: "O nome da habilidade é obrigatório" } },
      },
      categoria: {
        type: DataTypes.ENUM("linguagem", "framework", "banco_de_dados", "ferramenta", "soft_skill", "outro"),
        allowNull: false,
        defaultValue: "outro",
      },
    },
    {
      tableName: "habilidades",
      underscored: true,
    }
  );

  Habilidade.associate = (models) => {
    Habilidade.belongsToMany(models.Pessoa, {
      through: models.PessoaHabilidade,
      foreignKey: "habilidade_id",
      otherKey: "pessoa_id",
      as: "pessoas",
    });

    Habilidade.belongsToMany(models.Projeto, {
      through: models.ProjetoHabilidade,
      foreignKey: "habilidade_id",
      otherKey: "projeto_id",
      as: "projetos",
    });
  };

  return Habilidade;
};

export default getHabilidadeModel;
