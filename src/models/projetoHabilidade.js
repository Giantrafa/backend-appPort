const getProjetoHabilidadeModel = (sequelize, { DataTypes }) => {
  const ProjetoHabilidade = sequelize.define(
    "projeto_habilidade",
    {
      projeto_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: "projetos", key: "id" },
        onDelete: "CASCADE",
      },
      habilidade_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: "habilidades", key: "id" },
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "projeto_habilidades",
      underscored: true,
      timestamps: false,
    }
  );

  return ProjetoHabilidade;
};

export default getProjetoHabilidadeModel;
