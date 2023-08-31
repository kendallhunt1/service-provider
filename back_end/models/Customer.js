const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const Company = require('./Company');

const Customer = sequelize.define('Customer', {
  customer_id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  customer_name: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'customer_name'
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'email'
  },
  phone_number: {
    type: Sequelize.STRING,
    field: 'phone_number'
  },
  street_address: {
    type: Sequelize.STRING,
    field: 'street_address'
  },
  city: {
    type: Sequelize.STRING,
    field: 'city'
  },
  state: {
    type: Sequelize.STRING,
    field: 'state'
  },
  postal_code: {
    type: Sequelize.STRING,
    field: 'postal_code'
  },
  country: {
    type: Sequelize.STRING,
    field: 'country'
  },
  industry: {
    type: Sequelize.STRING,
    field: 'industry'
  },
  notes: {
    type: Sequelize.TEXT,
    field: 'notes'
  },
});

Customer.belongsTo(Company, { foreignKey: 'company_id' });

module.exports = Customer;
