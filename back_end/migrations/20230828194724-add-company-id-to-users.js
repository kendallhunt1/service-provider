'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'company_id', {
      type: Sequelize.UUID,
      references: {
        model: 'Companies', // Name of the companies table
        key: 'company_id', // Primary key of the companies table
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'company_id');
  }
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Cases', 'assigned_user', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Users', // Assuming your User model is named 'Users'
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Cases', 'assigned_user');
  },
};
