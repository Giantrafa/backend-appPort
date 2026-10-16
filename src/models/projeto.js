const getProjetoModel = (sequelize, { DataTypes }) => {
  const Projeto = sequelize.define(
    "projeto",
    {
      pessoa_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "pessoas", key: "id" },
      },
      experiencia_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "experiencias", key: "id" },
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: "O nome do projeto é obrigatório" } },
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      url_repositorio: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      url_demo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      data_inicio: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      data_fim: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
    },
    {
      tableName: "projetos",
      underscored: true,
    }
  );

  Projeto.associate = (models) => {
    Projeto.belongsTo(models.Pessoa, { foreignKey: "pessoa_id", as: "pessoa" });
    Projeto.belongsTo(models.Experiencia, { foreignKey: "experiencia_id", as: "experiencia" });

    Projeto.belongsToMany(models.Habilidade, {
      through: models.ProjetoHabilidade,
      foreignKey: "projeto_id",
      otherKey: "habilidade_id",
      as: "tecnologias",
    });
  };

  return Projeto;
};

export default getProjetoModel;
