const JobsRepository = require('../repository/jobs.repository');

const getUnpaidJobs = async (req) => {
  const profileId = req.profile.id;
  return await JobsRepository.getUnpaidJobs(profileId);
};

const payJob = async (req) => {
  const { id, balance, type } = req.profile;
  const jobId = req.params.id;

  const job = await JobsRepository.findJob(jobId, id);

  let response = '';

  if (job && type === 'client') {
    const amountToBePaid = job.price;
    const contractorId = job.Contract.ContractorId;
    if (balance >= amountToBePaid) {
      const result = await JobsRepository.payJob(id, contractorId, jobId, amountToBePaid);
      response = result ? `Payment of ${amountToBePaid} for ${job.description} has been made successfully.` : `Payment of ${amountToBePaid} for ${job.description} failed. Please try again.`;
    }
  } else {
    response = `The job is not available to pay`;
  }
  return response;
};

module.exports = {
  getUnpaidJobs,
  payJob,
};
