const AdminRepository = require('../repository/admin.repository');

const getBestProfession = async (req) => {
    const { start, end } = req.query;

    return await AdminRepository.findBestProfession(start,end,req);
};

const getBestClients = async (req) => {
    const { start, end, limit } = req.query;

    return await AdminRepository.findBestClients(start,end,limit,req);
};

module.exports = {
    getBestProfession,
    getBestClients
};
