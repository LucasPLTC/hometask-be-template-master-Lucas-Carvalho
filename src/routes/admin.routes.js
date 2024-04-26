const express = require('express');

const { getProfile } = require('../middleware/getProfile');

module.exports = function({ adminController }) {
  const adminRouter = express.Router();

  adminRouter.get('/best-profession',getProfile,  adminController.getBestProfession);
  adminRouter.get('/best-clients',getProfile,  adminController.getBestClients);

  return adminRouter;
};
