
const {Op} = require('sequelize');
const {Job, Contract, sequelize} = require("../model.js");
const BaseRepository  = require("./base.repository.js");
const {logger} = require("../core/Logger.js");
const {APIError, HTTP404Error} = require("../core/BaseError");

class JobsRepository extends BaseRepository {
    constructor() {
        super();
        this.model = Job;
        this.sequelize = sequelize;
    }

    async getUnpaidJobs(profileId,transaction) {
        try {
            return await this.model.findAll({
                include: [
                    {
                        attributes: [],
                        model: Contract,
                        required: true,
                        where: {
                            [Op.or]: [{ContractorId: profileId}, {ClientId: profileId}],
                            status: {
                                [Op.eq]: 'in_progress',
                            },

                        },
                        transaction: transaction
                    },
                ],
                where: {
                    [Op.or]: [
                        {paid: false},
                        {paid: null},
                    ],
                },
                transaction: transaction


            });
        } catch (error) {
            await logger.error(error.name, error.message);

            await logger.trace(error.stack, error);

            throw new APIError(error.name,error.message);
        }
    }

    async findJobToPay(jobId, clientId,transaction) {
        try {
            const result = await this.model.findOne({
                where: {id: jobId, paid: {[Op.is]: false}},
                include: [
                    {
                        model: Contract,
                        where: {status: 'in_progress', ClientId: clientId},
                    }
                ],
                transaction: transaction
            });
            if(result === undefined){
                throw new HTTP404Error("Nenhum registro encontrado");
            }
            return result

        } catch (error) {
            await logger.error(error.name, error.message);

            await logger.trace(error.stack, error);

            throw new APIError(error.name,error.message);
        }
    }

    async findTotalJobsToPay(cliendId, transaction) {
        try {
            return await Job.findAll(
                {
                    attributes: {
                        include: [[sequelize.fn('SUM', sequelize.col('price')), 'totalPrice']],
                    },
                    include: [
                        {
                            attributes: [],
                            model: Contract,
                            required: true,
                            where: {
                                ClientId: cliendId,
                                status: 'in_progress',
                            },
                            transaction: transaction
                        },
                    ],
                    where: {
                        paid: null,
                    },
                },
                {transaction: transaction},
            );
        } catch (error) {
            await logger.error(error.name, error.message);

            await logger.trace(error.stack, error);

            throw new APIError(error.name,error.message);
        }

    }

    async payJob(jobId, transaction) {
        try {
            return await this.model.update(
                {paid: 1, paymentDate: new Date()},
                {where: {id: jobId}},
                {transaction: transaction},
            );
        } catch (error) {
            await logger.error(error.name, error.message);
            await logger.trace(error.stack, error);
            throw new APIError(error.name,error.message);
        }
    }
}

module.exports = JobsRepository;


