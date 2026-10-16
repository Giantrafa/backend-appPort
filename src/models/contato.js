const getContatoModel = (sequelize, { DataTypes }) => {
  const Contato = sequelize.define(
    "contato",
    {
      pessoa_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "pessoas", key: "id" },
      },
      tipo: {
        type: DataTypes.ENUM("email", "telefone", "whatsapp", "github", "linkedin", "site", "outro"),
        allowNull: false,
      },
      valor: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: "O valor do contato é obrigatório" } },
      },
      url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "contatos",
      underscored: true,
    }
  );

  Contato.associate = (models) => {
    Contato.belongsTo(models.Pessoa, { foreignKey: "pessoa_id", as: "pessoa" });
  };

  return Contato;
};

export default getContatoModel;
