const express = require('express');

const { getProfile } = require('../middleware/getProfile');

module.exports = function({ jobsController }) {
  const jobRoutes = express.Router();

jobRoutes.get('/unpaid', getProfile, jobsController.getUnpaidJobs);
jobRoutes.post('/:id/pay', getProfile, jobsController.payJob);

  return jobRoutes;
};
