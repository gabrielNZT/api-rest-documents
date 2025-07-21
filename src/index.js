const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const authRoutes = require('./routes/auth.routes');
const datasetRoutes = require('./routes/dataset.routes');
const recordRoutes = require('./routes/record.routes');
const queryRoutes = require('./routes/query.routes');
const meRoutes = require('./routes/me.routes');

dotenv.config();

const app = express();
app.use(express.json());

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Rest Documents',
      version: '1.0.0',
      description: 'API for document management',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/auth', authRoutes);
app.use('/datasets', datasetRoutes);
app.use('/records', recordRoutes);
app.use('/queries', queryRoutes);
app.use('/me', meRoutes);


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
