const { HTTP400Error, HTTP404Error }  = require("../core/BaseError.js");
const UtilsService = require('../utils/utils');
const {logger} = require("../core/Logger");

class JobsService {
  constructor(JobsRepository,ProfileRepository) {
    this.jobsRepository = JobsRepository;
    this.profileRepository = ProfileRepository;
    this.getUnpaidJobs = this.getUnpaidJobs.bind(this);
    this.payJob = this.payJob.bind(this);

  }

  async getUnpaidJobs(req) {
    try {
      const profileId = UtilsService.validateParam(req.profile.id);
      const result = await this.jobsRepository.getUnpaidJobs(profileId, null);

      await UtilsService.validateResult(result);
      return result;
    } catch (error) {
      await logger.error(error.name, error.message);
      throw error;
    }
  }


  async payJob(req) {
    const transaction = this.jobsRepository.createTransaction(req)
    try {
      const {id, balance, type} = req.profile;
      const jobId = UtilsService.validateParam(req.params.id);

      await this.validateClientType(type);

      const { job, contract } = await this.jobsRepository.findJobToPay(jobId, id, transaction);;
      await this.validateJobToPay(job,contract,profileId);

      await this.validateClientBalanceToPay(job, balance)

      const contractorId = job.Contract.ContractorId;
      const amountToBePaid = job.price;

      //transfers paid value between clients and pay
      return await this.payJobAndTransferValue(id, amountToBePaid, contractorId, jobId, job, transaction);
    } catch (error) {
      await logger.error(error.name, error.message);
      await this.jobsRepository.rollbackTransaction(transaction);
      throw error;
    }
  }

  async validateClientType(type) {
    if (type !== 'client') {
      throw new HTTP400Error('Contractor Profiles cannot pay jobs')
    }
  }

  async validateJobToPay(job,contract,profileId) {
    if (!job) {
      throw new HTTP404Error('Job not found or already paid')
    }

    if (contract.ClientId !== profileId) throw new Error('Not authorized to pay for this job.');
  }

  async validateClientBalanceToPay(job,balance) {
    const amountToBePaid = job.price;
    if (balance <= amountToBePaid) {
      throw new HTTP400Error('The client balance is not enough to pay')
    }
  }

  async payJobAndTransferValue(id,amountToBePaid, contractorId, jobId, job, transaction) {
    //subtract amount paid
    const resultDecrese = await this.profileRepository.decreaseProfileBalance(id, amountToBePaid,transaction);

    //add amount paid
    const resultIncrease = await this.profileRepository.increaseProfileBalance(contractorId, amountToBePaid,transaction);

    //payJob
    const resultPayment = await this.jobsRepository.payJob(jobId, transaction);

    if (resultDecrese === 0 || resultIncrease === 0 ||resultPayment === 0 ){
      await this.jobsRepository.rollbackTransaction(transaction);
      throw new HTTP400Error(`Payment of ${amountToBePaid} for ${job.description} failed. Please try again.`);
    }

    return `Payment of ${amountToBePaid} for ${job.description} has been made successfully.`;
  }
}

module.exports = JobsService;
