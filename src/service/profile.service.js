const { HTTP400Error, HTTP404Error }  = require("../core/BaseError.js");
const UtilsService = require('../utils/utils');
const {logger} = require("../core/Logger");

class ProfileService  {
  constructor(ProfileRepository,JobsRepository) {
    this.profileRepository = JobsRepository;
    this.jobsRepository = JobsRepository;
    this.deposit = this.deposit.bind(this);

  }

  async deposit(req) {
    const depositTransaction = await this.profileRepository.createTransaction();
    try{
      const clientId = UtilsService.validateParam(req.params.userId);
      const depositAmount = UtilsService.validateParam(req.body.amount);

      const clientResult = await this.profileRepository.findProfile(clientId,depositTransaction)
      await this.validateResult(clientResult,"Client not Found");

      const totalJobsToPay = await this.jobsRepository.findTotalJobsToPay(clientId,depositTransaction);
      await this.validateResult(totalJobsToPay,`There are no unpaid jobs for client ${clientId}.`);
      const { totalPrice } = totalJobsToPay[0].dataValues;

      if (this.validateDepositAmountOverThreshold(depositAmount, totalPrice)){
        throw new HTTP400Error(`Deposit of ${depositAmount} is more than 25% of client ${clientId} total of jobs to pay, Maximum deposit amount reached.`);
      }

      const clientUpdated = await this.profileRepository.deposit(clientResult, depositAmount,depositTransaction);
      await this.profileRepository.commitTransaction(depositTransaction);

      await this.validateResult(clientUpdated);
      return clientUpdated;
    }catch (error){
      await this.profileRepository.rollbackTransaction(depositTransaction);
      await logger.error(error.name, error.message);
      throw error;
    }
  }

  async validateResult(result,errorMessage) {
    if (result === null || (Array.isArray(result) && result.length === 0)) {
      throw new HTTP404Error(errorMessage);
    }
    return result;
  }

   validateDepositAmountOverThreshold (depositAmount, totalprice){
    const depositThreshold = totalprice * 1.25;
    return depositAmount > depositThreshold;
  };

}

module.exports = ProfileService;
