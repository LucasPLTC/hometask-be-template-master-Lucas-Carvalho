const BaseRepository = require("./base.repository.js");
const {Contract, Job, Profile, sequelize} = require("../model.js");
const {Op} = require("sequelize");
const {logger} = require("../core/Logger.js");
const {APIError} = require("../core/BaseError");

class ProfileRepository extends BaseRepository {
    constructor() {
        super();
        this.model = Profile;
        this.sequelize = sequelize;
    }

    async findProfile(clientId, depositTransaction) {
        try {
            return await this.model.findByPk(clientId, {transaction: depositTransaction});
        } catch (error) {
            await logger.error(error.name, error.message);
            await logger.trace(error.stack, error);
            throw new APIError(error.name, error.message);
        }
    }

    async increaseProfileBalance(clientId, amountToBePaid, transaction) {
        try {
            return await this.model.update(
                { balance: sequelize.literal(`balance + ${amountToBePaid}`) },
                { where: { id: clientId } },
                { transaction: transaction },
            )
        } catch (error) {
            await logger.error(error.name, error.message);
            await logger.trace(error.stack, error);
            throw new APIError(error.name, error.message);
        }
    }

    async decreaseProfileBalance(clientId, amountToBePaid, transaction) {
        try {
            return await this.model.update(
                { balance: sequelize.literal(`balance - ${amountToBePaid}`) },
                { where: { id: clientId } },
                { transaction: transaction },
            )
        } catch (error) {
            await logger.error(error.name, error.message);
            await logger.trace(error.stack, error);
            throw new APIError(error.name, error.message);
        }
    }

    async findProfileByProfileId(profileId, transaction) {
        try {
            return await this.model.findOne({
                where: {id: profileId},
                transaction: transaction
            });
        } catch (error) {
            await logger.error(error.name, error.message);
            await logger.trace(error.stack, error);
            throw new APIError(error.name, error.message);
        }
    }

    async deposit(client, depositAmount, depositTransaction) {
        try {
            await client.increment({balance: depositAmount}, {transaction: depositTransaction});
            client.balance += depositAmount;
            return client;
        } catch (error) {
            await logger.error(error.name, error.message);
            await logger.trace(error.stack, error);
            throw new APIError(error.name, error.message);
        }
    };

    async findBestProfession(startDate, endDate, transaction) {
        try {
            //const sequelize = req.app.get('sequelize');
            const bestProfessions = await this.model.findAll({
                attributes: ['profession', [sequelize.fn('SUM', sequelize.col('price')), 'earned']],
                include: [
                    {
                        model: Contract,
                        as: 'Contractor',
                        attributes: [],
                        required: true,
                        include: [
                            {
                                model: Job,
                                required: true,
                                attributes: [],
                                where: {
                                    paid: true,
                                    paymentDate: {
                                        [Op.between]: [startDate, endDate],
                                    },
                                },
                            },
                        ],
                    },
                ],

                where: {
                    type: 'contractor',
                },
                group: ['profession'],
                order: sequelize.literal('earned DESC'),
                limit: 1,
                subQuery: false,
                transaction: transaction

            });

            return bestProfessions[0];
        } catch (error) {
            await logger.error(error.name, error.message);
            await logger.trace(error.stack, error);
            throw new APIError(error.name, error.message);
        }
    };

    async findBestClients(startDate, endDate, limit, transaction) {
        try {
            //const sequelize = req.app.get('sequelize');
            return await this.model.findAll({
                attributes: ['id',
                    [this.sequelize.literal("`Profile`.`firstName` || ' ' || `Profile`.`lastName` "), `fullName`],
                    [this.sequelize.fn('SUM', this.sequelize.col('price')), 'paid']],
                include: [
                    {
                        model: Contract,
                        as: 'Client',
                        attributes: [],
                        required: true,
                        include: [
                            {
                                model: Job,
                                required: true,
                                attributes: [],
                                where: {
                                    paid: true,
                                    paymentDate: {
                                        [Op.between]: [startDate, endDate],
                                    },
                                },
                            },
                        ],
                    },
                ],
                where: {
                    type: 'client',
                },
                order: [[this.sequelize.col('paid'), 'DESC']],
                limit: limit,
                subQuery: false,
                transaction: transaction
            });
        } catch (error) {
            await logger.error(error.name, error.message);
            await logger.trace(error.stack, error);
            throw new APIError(error.name, error.message);
        }
    };
}

module.exports = ProfileRepository;
