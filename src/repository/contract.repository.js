const {HttpStatusCode} = require("../core/HttpEnums.js");
const { logger } = require('../core/Logger');

const { Op } = require('sequelize');
const { Contract, sequelize } = require("../model.js");
const { APIError} = require('../core/BaseError')
const BaseRepository = require("./base.repository.js");

class ContractRepository extends BaseRepository {
  constructor() {
    super();
    this.contract = Contract;
    this.sequelize = sequelize;
  }

  async findByContractIdAndProfileId(contractId, profileId,transaction) {
    try{    return await this.contract.findOne({
      where: {
        id: contractId,
        [Op.or]: [{ContractorId: profileId}, {ClientId: profileId}],

      },
      transaction: transaction
    });
    }catch (error){
      await logger.error(error.name, error.message);

      await logger.trace(error.stack, error);

      throw new APIError(error.name,error.message);
    }

  }

  async getNonTerminatedUserContracts(profileId,transaction) {
    try{
    return await this.contract.findAll({
      where: {
        [Op.or]: [{ContractorId: profileId}, {ClientId: profileId},],
        status: {
          [Op.ne]: 'terminated',

        },
      },
      transaction: transaction

    });
  }catch (error){
    await logger.error(error.name, error.message);

    await logger.trace(error.stack, error);

      throw new APIError(error.name,error.message);
  }
  }
}

module.exports = ContractRepository;
