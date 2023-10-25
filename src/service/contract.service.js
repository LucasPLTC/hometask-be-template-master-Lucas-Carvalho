const { Op } = require('sequelize');
const ContractRepository = require('../repository/contract.repository');

const getContractById = async (req) => {
    const profileId = req.profile.id;
    const contractId = req.params.id;
    return await ContractRepository.findByContractIdAndProfileId(contractId, profileId);
};

const getNonTerminatedUserContracts = async (req) => {
    const { Contract } = req.app.get('models');
    const profileId = req.profile.id;

    return await Contract.findAll({
        where: {
            [Op.or]: [{ContractorId: profileId}, {ClientId: profileId}],
            status: {
                [Op.ne]: 'terminated',
            },
        },
    });
};


module.exports = { getContractById, getNonTerminatedUserContracts };
