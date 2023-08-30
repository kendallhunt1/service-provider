const Sequelize = require('sequelize');
const sequelize = require('../config/database');


const Company = sequelize.define('Company', {
  company_id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  company_name: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'company_name'
  },
  owner: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'owner'
  },
  operator: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'operator'
  },
  selected_services: {
    type: Sequelize.TEXT,
    allowNull: false,
    field: 'selected_services'
  },
  employees: {
    type: Sequelize.TEXT, // We'll store the serialized array as text
    allowNull: false,
    field: 'employees'
  }
});

module.exports = Company;