const Sequelize = require("sequelize");
const db = {};
const _this = db;

db.init = (config) => {
  _this.sequelize = new Sequelize(
    config.development.sql.database,
    config.development.sql.username,
    config.development.sql.password,
    config.development.sql
  );

  _this.model = {};
  _this.model.User = require("./models/User")(_this.sequelize, Sequelize)
  _this.model.Ticket = require("./models/Ticket")(_this.sequelize, Sequelize);
  _this.model.History = require("./models/History")(_this.sequelize, Sequelize);

  Object.keys(_this.model).forEach(function (modelName) {
    if (_this.model[modelName].associate) {
      _this.model[modelName].associate(_this.model);
    }
  });

  _this.sequelize.sync().then(() => {
    console.log({
      event: "Database start up",
      message: `Database connect to ${config.development.sql.database} (${config.development.sql.host})`,
    });
    console.log({ event: "Sync DB", message: "DB sync success" });
  }).catch((error) => {
    console.error("Error syncing database:", error)
  });

  process.once("SIGINT", function () {
    _this.sequelize.close();
    console.log({
      event: "Shutdown sequelize",
      message: "Shutting down sequelize",
    });
  });
};

db.getModel = () => {
  return _this.model;
};

module.exports = db;
