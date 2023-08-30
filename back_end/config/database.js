const Sequelize = require('sequelize');

const sequelize = new Sequelize('service-provider', 'root', 'hiddenpassword. not the real thing', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
