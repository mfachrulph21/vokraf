module.exports = function (sequelize, DataTypes) {
  const History = sequelize.define(
    "History",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate : {
            notNull : {
                msg : "Name is required"
            },
            notEmpty : {
                msg : "Email is required"
            }
        }
      },
      Date: DataTypes.DATE,
    },
    {
      tableName: "histories",
      timestamps: false,
      underscored: true,
    }
  );

  History.associate = function (models) {
    History.belongsTo(models.Ticket, { foreignKey: "ticket_id" });
  };

  return History;
};
