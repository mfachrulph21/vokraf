module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      name: {
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
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate : {
            notNull : {
                msg : "Email is required"
            },
            notEmpty : {
                msg : "Email is required"
            },
            isEmail : {
                msg : "Wrong format email"
            }
        }
      },
      image: {
        type : DataTypes.STRING,
        defaultValue : 'https://iio.azcast.arizona.edu/sites/default/files/profile-blank-whitebg.png'
      }
    },
    {
      tableName: "users",
      timestamps: false,
      underscored: true,
    }
  );

  User.associate = function (models) {
    User.hasMany(models.Ticket, { foreignKey: "user_id", sourceKey: "id" });
  };

  return User;
};
