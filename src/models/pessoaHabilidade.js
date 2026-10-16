const getPessoaHabilidadeModel = (sequelize, { DataTypes }) => {
  const PessoaHabilidade = sequelize.define(
    "pessoa_habilidade",
    {
      pessoa_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: "pessoas", key: "id" },
        onDelete: "CASCADE",
      },
      habilidade_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: "habilidades", key: "id" },
        onDelete: "CASCADE",
      },
      nivel: {
        type: DataTypes.ENUM("basico", "intermediario", "avancado"),
        allowNull: false,
        defaultValue: "basico",
      },
    },
    {
      tableName: "pessoa_habilidades",
      underscored: true,
    }
  );

  return PessoaHabilidade;
};

export default getPessoaHabilidadeModel;
