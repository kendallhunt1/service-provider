const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const Company = require('./Company');
const Service = require('./Service');

const CompanyServices = sequelize.define('CompanyServices', {
    companyServiceId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    company_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: true,
        references: {
            model: 'Companies',
            key: 'company_id',
        },
        field: 'company_id',
    },
    service_name: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'service_name',
        references: {
            model: 'Services',
            key: 'service_name',
        },
        field: 'service_name',
    },
    service_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: 'Services',
            key: 'service_id',
        },
        field: 'service_id',
    },
    service_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        field: 'service_price',
    },
});

// Define associations with Companies and Services models
CompanyServices.belongsTo(Company, { foreignKey: 'company_id' });
CompanyServices.belongsTo(Service, { foreignKey: 'service_id' });

module.exports = CompanyServices;
