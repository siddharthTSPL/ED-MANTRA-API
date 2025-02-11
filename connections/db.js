const Sequelize = require('sequelize');
const DB = process.env.DB;
const USER = process.env.USER;
const PASS = process.env.PASS;
const HOST = process.env.HOST
const DIALECT = process.env.DIALECT

const sequelize = new Sequelize(DB,USER,PASS,
{
    host:HOST,
    dialect: DIALECT,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection to mysql has been established successfully.");
  })
  .catch((error) => {  
    console.error("Unable to connect to the database:", error);
  });

module.exports = sequelize;