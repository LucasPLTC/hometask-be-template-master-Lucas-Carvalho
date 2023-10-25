const httpStatus = require('http-status');

const ProfileService = require('../service/profile.service');

const deposit = async (req, res) => {
    try {
        const response = await ProfileService.deposit(req);
        if (typeof response.message === 'string' && response.message.includes('Maximum deposit amount reached')) {
            res.status(httpStatus.CONFLICT).json({ message: `${response.message}` });

        } else if (typeof response.message === 'string' && response.message.includes("There are no unpaid jobs for client")) {
            res.status(httpStatus.NOT_FOUND).json({message: `${response.message}`});

        }else if (typeof response.message === 'string' && response.message.includes("Client not Found")) {
                res.status(httpStatus.BAD_REQUEST).json({ message: `${response.message}` });

        } else {
            res.status(httpStatus.OK).json(response.payload);
        }

    } catch (error) {
        console.trace(error)
        res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Error occurred while depositing amount' });
    }
};

module.exports = {
    deposit,
};
