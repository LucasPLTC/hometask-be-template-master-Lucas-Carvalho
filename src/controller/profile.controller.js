const HttpStatusCode = require('../core/HttpEnums');

class ProfileController {
    constructor(ProfileService) {
        this.profileService = ProfileService;
        this.payJob = this.payJob.bind(this);
    }

    async deposit(req, res, next) {
        try {
            const unpaidJobs = await this.profileService.deposit(req);
            await this.sendResponse(req, res, next, unpaidJobs);
        }catch (error) {
            res.status(500).json('Unexpected error occurred');
            next(error);
        }
    }

    async payJob(req, res, next) {
        try {
            const response = await this.jobsService.payJob(req);
            this.sendResponse(req, res, next, response);
        }catch (error) {
            res.status(500).json('Unexpected error occurred');
            next(error);
        }
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

module.exports = ProfileController;
