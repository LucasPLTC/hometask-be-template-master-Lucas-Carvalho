const HttpStatusCode = require('../core/HttpEnums');

class AdminController {
    constructor(AdminService) {
        this.adminService = AdminService;
        this.getBestProfession = this.getBestProfession.bind(this);
        this.getBestClients = this.getBestClients.bind(this);
    }

    getBestProfession(req, res, next) {
        try {
            const dataPromise = this.adminService.getBestProfession(req);
            this.sendResponse(req, res, next, dataPromise);
        }catch (error) {
            res.status(500).json('Unexpected error occurred');
            next(error);
        }

    }

    getBestClients(req, res, next) {
        try {
            const dataPromise = this.adminService.getBestClients(req);
            this.sendResponse(req, res, next, dataPromise);
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

module.exports = AdminController;
