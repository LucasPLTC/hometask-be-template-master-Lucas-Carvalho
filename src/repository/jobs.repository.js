const { Op} = require('sequelize');
const {Job, Contract, sequelize, Profile} = require("../model");

const getUnpaidJobs = async (profileId) => {
    return await Job.findAll({
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
            },
        ],
        where: {
            [Op.or]: [
                {paid: false},
                {paid: null},
            ],
        },
    });
};

const findJob = async (jobId,clientId) => {
    return await Job.findOne({
        where: { id: jobId, paid: { [Op.is]: null } },
        include: [
            {
                model: Contract,
                where: { status: 'in_progress', ClientId: clientId },
            },
        ],
    });
};

const payJob = async (id, contractorId, jobId, amountToBePaid) => {
    const paymentTransaction = await sequelize.transaction();
    try {
        await Promise.all([
            Profile.update(
                { balance: sequelize.literal(`balance - ${amountToBePaid}`) },
                { where: { id } },
                { transaction: paymentTransaction },
            ),

            Profile.update(
                { balance: sequelize.literal(`balance + ${amountToBePaid}`) },
                { where: { id: contractorId } },
                { transaction: paymentTransaction },
            ),

            Job.update(
                { paid: 1, paymentDate: new Date() },
                { where: { id: jobId } },
                { transaction: paymentTransaction },
            ),
        ]);

        await paymentTransaction.commit();

        return true;
    } catch (error) {
        console.log(error);
        await paymentTransaction.rollback();
        return false;
    }
};

module.exports = { getUnpaidJobs, findJob , payJob };
