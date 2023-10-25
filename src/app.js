const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

const contractRoutes = require( './routes/contract.routes');
const jobRoutes = require( './routes/jobs.routes');

app.use('/contracts', contractRoutes);
app.use('/jobs', jobRoutes);

module.exports = app;
