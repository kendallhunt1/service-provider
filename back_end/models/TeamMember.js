const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const Company = require('./Company');


const TeamMember = sequelize.define('TeamMember', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'name'
  },
  phone_number: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'phone_number'
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'email'
  },
  user_role: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'user_role'
  },
});

TeamMember.belongsTo(Company);

module.exports = TeamMember;
