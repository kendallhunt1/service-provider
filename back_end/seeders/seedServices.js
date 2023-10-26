const Service = require('../models/Service');

const services = [
  {
    service_name: 'Service Provider',
    service_price: 100.00,
    createdAt: new Date(), // Set the createdAt field to the current date and time
  },
  {
    service_name: 'Automated Marketing',
    service_price: 300.00,
    createdAt: new Date(), // Set the createdAt field to the current date and time
  },
  {
    service_name: 'Customer Interface',
    service_price: 500.00,
    createdAt: new Date(), // Set the createdAt field to the current date and time
  },
  // Add more services as needed
];

async function seedServices() {
  try {
    await Service.bulkCreate(services);
    console.log('Services seeded successfully.');
  } catch (error) {
    console.error('Error seeding services:', error);
  }
}

seedServices();
