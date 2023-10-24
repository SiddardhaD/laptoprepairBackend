const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Agent.init(sequelize, DataTypes);
}

class Agent extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    mobile: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    business_type: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    pincode: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    fcm: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'agents',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
