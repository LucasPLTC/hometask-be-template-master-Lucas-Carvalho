const HttpStatusCode = require('../core/HttpEnums');

class ProfileController {
    constructor(ProfileService) {
        this.profileService = ProfileService;
        this.payJob = this.payJob.bind(this);
        this.deposit = this.deposit.bind(this);
    }

    async deposit(req, res, next) {
        try {
            const unpaidJobs = await this.profileService.deposit(req);
            this.sendResponse(res, unpaidJobs);
        } catch (error) {
            this.handleError(res, next, error);
        }
    }

    async payJob(req, res, next) {
        try {
            const response = await this.jobsService.payJob(req);
            this.sendResponse(res, response);
        } catch (error) {
            this.handleError(res, next, error);
        }
    }

    sendResponse(res, data) {
        res.status(HttpStatusCode.OK).json(data);
    }

    handleError(res, next, error) {
        res.status(error.httpCode || 500).json(error.message || 'Unexpected error occurred');
        next(error);
    }
}

module.exports = ProfileController;
