const getCertificacaoModel = (sequelize, { DataTypes }) => {
  const Certificacao = sequelize.define(
    "certificacao",
    {
      pessoa_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "pessoas", key: "id" },
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: "O nome da certificação é obrigatório" } },
      },
      emissor: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: "O emissor é obrigatório" } },
      },
      data_emissao: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      carga_horaria: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: { min: 0 },
      },
      url_credencial: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "certificacoes",
      underscored: true,
    }
  );

  Certificacao.associate = (models) => {
    Certificacao.belongsTo(models.Pessoa, { foreignKey: "pessoa_id", as: "pessoa" });
  };

  return Certificacao;
};

export default getCertificacaoModel;
