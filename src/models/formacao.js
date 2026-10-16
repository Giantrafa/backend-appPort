const getFormacaoModel = (sequelize, { DataTypes }) => {
  const Formacao = sequelize.define(
    "formacao",
    {
      pessoa_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "pessoas", key: "id" },
      },
      instituicao: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: "A instituição é obrigatória" } },
      },
      curso: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: "O curso é obrigatório" } },
      },
      nivel: {
        type: DataTypes.ENUM(
          "ensino_medio",
          "tecnico",
          "tecnologo",
          "graduacao",
          "pos_graduacao",
          "mestrado",
          "doutorado",
          "curso_livre"
        ),
        allowNull: false,
      },
      data_inicio: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      data_fim: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "formacoes",
      underscored: true,
    }
  );

  Formacao.associate = (models) => {
    Formacao.belongsTo(models.Pessoa, { foreignKey: "pessoa_id", as: "pessoa" });
  };

  return Formacao;
};

export default getFormacaoModel;
