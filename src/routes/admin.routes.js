const express = require('express');
const { getBestProfession } = require('../controller/admin.controller');
const {getBestClients} = require("../service/admin.service");

const contractRouter = express.Router();

contractRouter.get('/best-profession', getBestProfession);

contractRouter.get('/best-clients', getBestClients);

module.exports = contractRouter;
