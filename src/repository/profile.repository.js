const { Profile} = require("../model");

const createTransaction = async (req) => {
    const sequelize = req.app.get('sequelize');
    return await sequelize.transaction();
}

const commitTransaction = async (depositTransaction) => {
    depositTransaction.commit();
}

const rollbackTransaction = async (depositTransaction) => {
    depositTransaction.rollback();
}
const findProfile = async (clientId,depositTransaction) => {
    return await Profile.findByPk(clientId, { transaction: depositTransaction });
}

const deposit = async (client ,depositAmount,depositTransaction) => {
    await client.increment({ balance: depositAmount }, { transaction: depositTransaction });
    client.balance += depositAmount;
    return client;
};


module.exports = { createTransaction, commitTransaction, rollbackTransaction, findProfile, deposit };
