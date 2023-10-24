'use strict';
let Helper            =      require("../middleware/helper");
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const db     = {}
let sequelize;
let islocaldata = process.env.IsLocal
if(islocaldata==1){
  const config = require(__dirname + '/../Config/config.json')['local'];
  if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
  } else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
  }
}else{
  const config = require(__dirname + '/../config/config.json')['development'];
  if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
  } else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
  }
  // sequelize = new Sequelize("","","",{"username":"","password":"","database":"","host":"","port":3306,"dialect": "mysql"});
  // (async () => {
  //   await sequelize.beforeConnect(async (config) => {
  //     let mongoos = require("mongoose");
  //     let Company = mongoos.model('Company');
  //     console.log("Web Link :",process.env.DbUrlLink)
  //     try{
  //       let dbDet = await Company.findOne({ url:process.env.DbUrlLink});
  //       if(dbDet){
  //         config.username = await dbDet.databse_username
  //         config.password = await (dbDet.database_password==1234)?"":dbDet.database_password
  //         config.database = await dbDet.databse_name
  //         config.host     = await dbDet.database_host
  //         config.port     = await dbDet.database_port
  //         config.dialect  = await dbDet.database_dialect
  //       }
  //     }catch(err){
  //       console.log(err)
  //     }
  //   });
  // })();
  // try {
  //   (async () => {
  //     // await sequelize.authenticate();
  //     console.log("Connection has been established successfully.");
  //   })();
  // } catch (error) {
  //   console.error("Unable to connect to the database:", error);
  // }
}
fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

var initModels = require("./init-models").initModels;
initModels(sequelize);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;