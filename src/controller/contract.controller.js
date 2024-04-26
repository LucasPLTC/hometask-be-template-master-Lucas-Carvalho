const HttpStatusCode = require('../core/HttpEnums');

class ContractController {
    constructor(ContractService) {
        this.contractService = ContractService;
        this.retrieveContractById = this.retrieveContractById.bind(this);
        this.retrieveNonTerminatedUserContracts = this.retrieveNonTerminatedUserContracts.bind(this);
    }

    async retrieveContractById(req, res, next) {
        const contract = await this.contractService.getContractById(req);
        this.sendResponse(req, res, next, contract);
    }

    async retrieveNonTerminatedUserContracts(req, res, next) {
        const contracts = await this.contractService.getNonTerminatedUserContracts(req);
        this.sendResponse(req, res, next, contracts);
    }

    async sendResponse(req, res, next, dataPromise) {
        try {
            const data = await dataPromise;
            res.status(HttpStatusCode.OK).json(data);
        } catch (error) {
            res.status(error.httpCode || 500).json(error.description || 'Unexpected error occurred');
            next(error);
        }
    }
}

module.exports = ContractController;
