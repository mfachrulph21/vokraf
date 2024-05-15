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
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
      },
      image: {
        type: DataTypes.STRING,
        defaultValue:
          "https://iio.azcast.arizona.edu/sites/default/files/profile-blank-whitebg.png",
      },
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
