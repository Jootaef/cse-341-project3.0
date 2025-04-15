const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Inventory API',
    description: 'This documentation describes the available endpoints for managing employees and departments.'
  },
  host: 'localhost:3000',
  schemes: ['http']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc)
  .then(() => {
    console.log('✅ Swagger file generated successfully!');
  })
  .catch((err) => {
    console.error('❌ Error generating Swagger file:', err);
  });
