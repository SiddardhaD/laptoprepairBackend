const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Assignedorder.init(sequelize, DataTypes);
}

class Assignedorder extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    customername: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    customermobile: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    model: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    serial: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    repair: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    assignedto: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'assignedorders',
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
