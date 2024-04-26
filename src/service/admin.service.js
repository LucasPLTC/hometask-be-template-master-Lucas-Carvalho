const { HTTP400Error, HTTP404Error }  = require("../core/BaseError.js");
const DEFAULT_LIMIT = 2;
const UtilsService = require('../utils/utils');
const {logger} = require("../core/Logger");

class AdminService  {
    constructor(ProfileRepository) {
        this.profileRepository = ProfileRepository;
        this.getBestProfession = this.getBestProfession.bind(this);
        this.getBestClients = this.getBestClients.bind(this);
    }

    async extractAndValidateQuery(req) {
        if (!req || !req.query) {
            throw new Error("Invalid request");
        }
        let {start, end, limit} = req.query;
        limit = parseInt(limit, 10);
        if (!Number.isInteger(limit)) {
            limit = DEFAULT_LIMIT;
        }
        await this.validateDataPayload(start, end);
        return {start, end, limit};
    }

    async getBestProfession(req) {
        try {
            const {start, end} = await this.extractAndValidateQuery(req);

            const profileTransaction = await this.profileRepository.createTransaction(req);
            const result = await this.profileRepository.findBestProfession(start, end, null)
            await this.profileRepository.commitTransaction(profileTransaction);
            await UtilsService.validateResult(result);
            return result;
        } catch (error) {
            await logger.error(error.name, error.message);
            throw error;
        }
    }

    async getBestClients(req) {
        try {
            const {start, end, limit} = await this.extractAndValidateQuery(req);

            const profileTransaction = await this.profileRepository.createTransaction(req);
            const result = await this.profileRepository.findBestClients(start, end, limit, profileTransaction)
            await this.profileRepository.commitTransaction(profileTransaction);
            await UtilsService.validateResult(result);
            return result;
        }catch (error){
            await logger.error(error.name, error.message);
            throw error;
        }
    }

    async validateDataPayload(startDate,endDate){
        if (!startDate || !endDate){
            throw new HTTP400Error("Date not Received");
        }
        if (!UtilsService.isValidDateParameter(startDate) || !UtilsService.isValidDateParameter(endDate)){
            throw new HTTP400Error("Invalid Date Received");
        }
        // Removed the duplicated validation
        if (!UtilsService.isValidDateRange(startDate,endDate)){
            throw new HTTP400Error("DateRange invalid");
        }
    }
}

module.exports = AdminService;
