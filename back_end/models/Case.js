const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const Company = require('./Company');
const User = require('./User');

const Case = sequelize.define('Case', {
  case_id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  case_type: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'case_type',
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'status',
  },
  priority: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'priority',
  },
  customer_name: {
    type: Sequelize.TEXT,
    field: 'customer_name',
  },
  customer_email_address: {
    type: Sequelize.TEXT,
    field: 'customer_email_address',
  },
  customer_phone_number: {
    type: Sequelize.TEXT,
    field: 'customer_phone_number',
  },
  case_details: {
    type: Sequelize.TEXT,
    field: 'case_details',
  },
  assigned_user: {
    type: Sequelize.INTEGER,
    allowNull: true, // It can be null
    references: {
      model: User,
      key: 'id',
    },
    field: 'assigned_user', // Define the field name in the database
  },

  // Foreign key for the associated company
  company_id: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: Company,
      key: 'company_id',
    },
  },

  // Optional foreign key for the user who created the case
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: true, // If not all cases have a user_id, you can set it to allowNull: true
    references: {
      model: User,
      key: 'id',
    },
  }
});

Case.belongsTo(Company, { foreignKey: 'company_id' });

// Optional association with the user who created the case
Case.belongsTo(User, { foreignKey: 'user_id', as: 'creator' });

module.exports = Case;
