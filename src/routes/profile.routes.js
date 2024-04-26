const express = require('express');

const { getProfile } = require('../middleware/getProfile');

module.exports = function({ profileController }) {
  const profileRoutes = express.Router();

profileRoutes.post('/deposit/:userId',getProfile ,profileController.deposit);

  return profileRoutes;
};
