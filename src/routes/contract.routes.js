const express = require('express');

const { getProfile } = require('../middleware/getProfile');

module.exports = function({ contractController }) {
  const contractRouter = express.Router();

    contractRouter.get('/',getProfile, contractController.retrieveNonTerminatedUserContracts);
    contractRouter.get('/:id', getProfile, contractController.retrieveContractById);

  return contractRouter;
};
