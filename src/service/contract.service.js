const ContractRepository = require("../repository/contract.repository.js");
const { HTTP400Error, HTTP404Error }  = require("../core/BaseError.js");
const UtilsService = require('../utils/utils')
const {logger} = require("../core/Logger");

class ContractService  {
    constructor(ContractRepository) {
        this.contractRepository = ContractRepository;
        this.getContractById = this.getContractById.bind(this);
        this.getNonTerminatedUserContracts = this.getNonTerminatedUserContracts.bind(this);
    }

    async getContractById(req) {
        try{
            const profileId = req.profile.id;
            const contractId = UtilsService.validateParam(req.params.id);
            const result = await this.contractRepository.findByContractIdAndProfileId(contractId, profileId,null);
            await UtilsService.validateResult(result);
            return result;
        }catch (error){
            await logger.error(error.name, error.message);
            throw error;
        }
    }

    async getNonTerminatedUserContracts(req) {
        try{
            const profileId = UtilsService.validateParam(req.profile.id);
            const result = await this.contractRepository.getNonTerminatedUserContracts(profileId,null);
            await UtilsService.validateResult(result);
            return result;
        }catch (error){
            await logger.error(error.name, error.message);
            throw error;
        }
    }

}

module.exports = ContractService;
