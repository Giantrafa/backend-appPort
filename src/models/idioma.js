const getIdiomaModel = (sequelize, { DataTypes }) => {
  const Idioma = sequelize.define(
    "idioma",
    {
      pessoa_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "pessoas", key: "id" },
      },
      idioma: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: "O idioma é obrigatório" } },
      },
      nivel: {
        type: DataTypes.ENUM("basico", "intermediario", "avancado", "fluente", "nativo"),
        allowNull: false,
      },
    },
    {
      tableName: "idiomas",
      underscored: true,
    }
  );

  Idioma.associate = (models) => {
    Idioma.belongsTo(models.Pessoa, { foreignKey: "pessoa_id", as: "pessoa" });
  };

  return Idioma;
};

export default getIdiomaModel;
