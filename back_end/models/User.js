const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const Company = require('./Company');

const User = sequelize.define('user', {
  first_name: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'first_name',
  },
  last_name: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'last_name',
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    field: 'email',
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'password',
  },
  phone_number: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'phone_number',
  },
  company_name: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'company_name',
  },
  user_role: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'user_role'
  },
  reason_for_signup: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'reason_for_signup',
  },
});

User.belongsTo(Company, { foreignKey: 'company_id' });

module.exports = User;
