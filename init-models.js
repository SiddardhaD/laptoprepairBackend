const DataTypes = require("sequelize").DataTypes;
const _Agent = require("./Agent");
const _Assignedorder = require("./Assignedorder");
const _Auth = require("./Auth");
const _Order = require("./Order");
const _User = require("./User");

function initModels(sequelize) {
  const Agent = _Agent(sequelize, DataTypes);
  const Assignedorder = _Assignedorder(sequelize, DataTypes);
  const Auth = _Auth(sequelize, DataTypes);
  const Order = _Order(sequelize, DataTypes);
  const User = _User(sequelize, DataTypes);


  return {
    Agent,
    Assignedorder,
    Auth,
    Order,
    User,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
