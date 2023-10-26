const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const Company = require('./Company');

const Service = sequelize.define('Service', {
    service_name: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'service_name',
    },
    service_price: {
        type: Sequelize.NUMERIC(10, 2),
        allowNull: false,
        field: 'service_price',
    },
    service_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
});

Service.belongsTo(Company, { foreignKey: 'company_id' });

module.exports = Service;