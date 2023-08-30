const Sequelize = require('sequelize');

const sequelize = new Sequelize('service-provider', 'root', 'database', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
