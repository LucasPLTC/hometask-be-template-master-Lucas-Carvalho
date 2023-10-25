const { Profile, Job, Contract} = require("../model");
const {  Op} = require('sequelize');

const findBestProfession = async (startDate, endDate,req) => {
    const sequelize = req.app.get('sequelize');
    const bestProfessions = await Profile.findAll({
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
        order: [[sequelize.col('earned'), 'DESC']],
        limit: 1,
        subQuery: false,
    });

    return bestProfessions[0];
};

const findBestClients = async (startDate, endDate,limit,req) => {
    const sequelize = req.app.get('sequelize');
    return await Profile.findAll({
        attributes: ['id',
            [sequelize.literal("`Profile`.`firstName` || ' ' || `Profile`.`lastName` "), `fullName`],
            [sequelize.fn('SUM', sequelize.col('price')), 'paid']],
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
        order: [[sequelize.col('paid'), 'DESC']],
        limit: limit,
        subQuery: false,
    });
};

module.exports = {
    findBestProfession,
    findBestClients
};
