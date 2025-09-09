const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Reddit = sequelize.define('Reddit', {
  name: DataTypes.STRING,
  title: DataTypes.STRING,
  url: DataTypes.STRING,
  description: DataTypes.TEXT,
});

module.exports = Reddit;