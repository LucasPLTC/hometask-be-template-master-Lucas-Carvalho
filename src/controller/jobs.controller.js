const HttpStatusCode = require('../core/HttpEnums');

class JobsController {
    constructor(JobsService) {
        this.jobsService = JobsService;
        this.getUnpaidJobs = this.getUnpaidJobs.bind(this);
        this.payJob = this.payJob.bind(this);
    }

    async getUnpaidJobs(req, res, next) {
        try {
            const unpaidJobs = await this.jobsService.getUnpaidJobs(req);
            this.sendResponse(req, res, next, unpaidJobs);
        } catch (error) {
            res.status(error.httpCode || 500).json(error.description || 'Unexpected error occurred');
            next(error);
        }

    }

    async payJob(req, res, next) {
        try {
            const response = await this.jobsService.payJob(req);
            this.sendResponse(req, res, next, response);
        } catch (error) {
            res.status(error.httpCode || 500).json(error.description || 'Unexpected error occurred');
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

module.exports = JobsController;
