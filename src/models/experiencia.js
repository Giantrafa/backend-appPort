const getExperienciaModel = (sequelize, { DataTypes }) => {
  const Experiencia = sequelize.define(
    "experiencia",
    {
      pessoa_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "pessoas", key: "id" },
      },
      empresa: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: "A empresa é obrigatória" } },
      },
      cargo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: "O cargo é obrigatório" } },
      },
      tipo: {
        type: DataTypes.ENUM("clt", "pj", "estagio", "freelancer", "voluntario", "outro"),
        allowNull: false,
        defaultValue: "clt",
      },
      local: {
        type: DataTypes.STRING,
        allowNull: true,
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
      tableName: "experiencias",
      underscored: true,
    }
  );

  Experiencia.associate = (models) => {
    Experiencia.belongsTo(models.Pessoa, { foreignKey: "pessoa_id", as: "pessoa" });
    Experiencia.hasMany(models.Projeto, {
      foreignKey: "experiencia_id",
      as: "projetos",
      onDelete: "SET NULL",
    });
  };

  return Experiencia;
};

export default getExperienciaModel;
