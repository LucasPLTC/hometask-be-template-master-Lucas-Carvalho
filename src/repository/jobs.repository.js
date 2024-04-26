
const {Op} = require('sequelize');
const {Job, Contract, sequelize} = require("../model.js");
const BaseRepository  = require("./base.repository.js");
const {logger} = require("../core/Logger.js");
const {APIError, HTTP404Error} = require("../core/BaseError");

class JobsRepository extends BaseRepository {
    constructor() {
        super();
        this.job = Job;
        this.sequelize = sequelize;
    }

    async getUnpaidJobs(profileId,transaction) {
        try {
            return await this.job.findAll({
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
            const result = await this.job.findAll({
                where: {id: jobId},
                include: [
                    {
                        model: Contract,
                        where: {ClientId: clientId},
                    }
                ],
                transaction: transaction
            });
            if(result === undefined){
                throw new HTTP404Error("Job not found");
            }
            return result

        } catch (error) {
            await logger.error(error.name, error.message);
            await logger.trace(error.stack, error);
            throw new APIError(error.name,error.message);
        }
    }

    // async findJobToPay(jobId, clientId,transaction) {
    //     try {
    //         const job = await this.job.findByPk(jobId, { transaction });
    //         if (!job || job.paid) throw new HTTP400Error('Job not found or already paid.');
    //
    //         const contract = await Contract.findByPk(job.ContractId, { transaction });
    //         if (!contract || contract.status !== 'in_progress') throw new HTTP404Error('Contract not found or not active.');
    //
    //         return { job, contract };
    //     } catch (error) {
    //         await logger.error(error.name, error.message);
    //         await logger.trace(error.stack, error);
    //         throw new APIError(error.name,error.message);
    //     }
    // }

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
                        paid: false,
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
            return await this.job.update(
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


