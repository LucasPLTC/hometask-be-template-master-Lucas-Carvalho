const httpStatus = require('http-status');

const JobsService = require('../service/jobs.service');

const getUnpaidJobs = async (req, res) => {
    try {
        const unpaidJobs = await JobsService.getUnpaidJobs(req);
        if (!unpaidJobs ) {
            res.sendStatus(httpStatus.NOT_FOUND);
        } else {
            res
                .status(httpStatus.OK)
                .json(unpaidJobs);
        }
    } catch (error) {
        res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ error });
    }
};

const payJob = async (req, res) => {
    try {
        const response = await JobsService.payJob(req);

        if (response.result){
            res.status(httpStatus.OK).json({ message: response });
        } else {
            if (response.message === 'The job was not found') {
                res.status(httpStatus.NOT_FOUND).json({message: `The job was not found`});

            } else if (typeof response.message === 'string' && response.message.includes('Contractor Profiles cannot pay jobs')) {
                res.status(httpStatus.CONFLICT).json({message: response.message});
            } else if (typeof response.message === 'string' && response.message.includes('failed. Please try again.')) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: response.message});

            } else if (typeof response.message === 'string' && response.message.includes('The client balance is not enough to pay')) {
                res.status(httpStatus.BAD_REQUEST).json({message: response.message});
            }
        }
    } catch (error) {
        res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Error occurred while paying for a job', error });
    }
};

module.exports = {
    getUnpaidJobs,
    payJob,
};
