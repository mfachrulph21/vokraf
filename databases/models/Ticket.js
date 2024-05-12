module.exports = function (sequelize, DataTypes) {
  const Ticket = sequelize.define(
    "Ticket",
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
                msg : "Title is required"
            },
            notEmpty : {
                msg : "Title is required"
            }
        }
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate : {
            notNull : {
                msg : "Description is required"
            },
            notEmpty : {
                msg : "Description is required"
            }
        }
      },
      point: {
        type: DataTypes.INTEGER,
        allowNull: false,validate : {
            notNull : {
                msg : "Point is required"
            },
            notEmpty : {
                msg : "Point is required"
            }
        }
      },
      status : DataTypes.ENUM('To do', 'In Proggress', 'In Review', 'Done'),
      created_at: DataTypes.DATE,
    },
    {
      tableName: "tickets",
      timestamps: false,
      underscored: true,
    }
  );

  Ticket.associate = function (models) {
    Ticket.belongsTo(models.User, { foreignKey: "user_id" });
    Ticket.hasMany(models.History, {
      foreignKey: "ticket_id",
      sourceKey: "id",
    });
  };

  return Ticket;
};
