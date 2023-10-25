const ContractRepository = require('../repository/contract.repository');
const getContractById = async (req) => {
    const profileId = req.profile.id;
    const contractId = req.params.id;
    return await ContractRepository.findByContractIdAndProfileId(contractId, profileId);
};

const getNonTerminatedUserContracts = async (req) => {
    const profileId = req.profile.id;
    return await ContractRepository.getNonTerminatedUserContracts(profileId);
};


module.exports = { getContractById, getNonTerminatedUserContracts };
