const JobsRepository = require('../repository/jobs.repository');

const getUnpaidJobs = async (req) => {
  const profileId = req.profile.id;
  return await JobsRepository.getUnpaidJobs(profileId);
};

const payJob = async (req) => {
  const { id, balance, type } = req.profile;
  const jobId = req.params.id;
  let response = {
    result: false,
    message: ''
  }

  if (type !== 'client'){
    response.result = false;
    response.message =  'Contractor Profiles cannot pay jobs';
    return response;
  }

  const job = await JobsRepository.findJob(jobId, id);

  if (job && type === 'client') {
    const amountToBePaid = job.price;
    const contractorId = job.Contract.ContractorId;
    if (balance >= amountToBePaid) {
      const result = await JobsRepository.payJob(id, contractorId, jobId, amountToBePaid);
      const queryResponse = result ? `Payment of ${amountToBePaid} for ${job.description} has been made successfully.`
          : `Payment of ${amountToBePaid} for ${job.description} failed. Please try again.`;
      response.result = result;
      response.message = queryResponse;

    }else{
      response.result = false;
      response.message = 'The client balance is not enough to pay'
    }
  } else {
    response.result = false;
    response.message = `The job was not found`;
  }
  return response;
};

module.exports = {
  getUnpaidJobs,
  payJob,
};
