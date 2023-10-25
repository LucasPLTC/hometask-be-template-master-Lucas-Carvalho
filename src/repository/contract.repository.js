const { Op } = require('sequelize');
const {Contract} = require("../model");

const findByContractIdAndProfileId = async (contractId, profileId) => {
  return await Contract.findOne({
    where: {
      id: contractId,
      [Op.or]: [{ContractorId: profileId}, {ClientId: profileId}],
    },
  });
};

const getNonTerminatedUserContracts = async (profileId) => {
  return await Contract.findAll({
    where: {
      [Op.or]: [{ContractorId: profileId}, {ClientId: profileId}],
      status: {
        [Op.ne]: 'terminated',
      },
    },
  });
};

module.exports = { findByContractIdAndProfileId, getNonTerminatedUserContracts };
