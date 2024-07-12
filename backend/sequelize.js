const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('hospitaldb', process.env.DB_USER, process.env.DB_PWD, {
  host: 'localhost',
  port: process.env.DB_PORT,
  dialect: 'mysql',
  logging: false
});

module.exports = sequelize;
