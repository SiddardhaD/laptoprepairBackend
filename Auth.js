const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Auth.init(sequelize, DataTypes);
}

class Auth extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    mobile: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "mobile"
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'auth',
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
      {
        name: "mobile",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "mobile" },
        ]
      },
    ]
  });
  }
}
