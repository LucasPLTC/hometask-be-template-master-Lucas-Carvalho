  const ProfileRepository = require('../repository/profile.repository');
  const JobsRepository = require('../repository/jobs.repository');
  const deposit = async (req) => {
    const clientId = req.params.userId;
    const depositAmount = req.body.amount;

    let response = {
      result: false,
      message: "",
      payload:null
    };

    const depositTransaction = await ProfileRepository.createTransaction(req);

    try{
      const client = await ProfileRepository.findProfile(clientId,depositTransaction)
      if (!client){
        response.result = false
        response.message = "Client not Found"
        await ProfileRepository.rollbackTransaction();
        return response;
      }
      const totalJobsToPay = await JobsRepository.findTotalJobsToPay(clientId,depositTransaction);

      const { totalPrice } = totalJobsToPay[0].dataValues;
      if (totalPrice == null) {
        response.result = false;
        response.message = `There are no unpaid jobs for client ${clientId}.`;
        return response;
      }

      if (validateDepositAmountOverThreshold(depositAmount, totalPrice)){
        response.message = `Deposit of ${depositAmount} is more than 25% of client ${clientId} total of jobs to pay, Maximum deposit amount reached.`;
        response.result = false;
        return response;
      }

      const clientUpdated = await ProfileRepository.deposit(client, depositAmount,depositTransaction);

      await ProfileRepository.commitTransaction(depositTransaction);

      response.result = true;
      response.message = "Success"
      response.payload = clientUpdated;
      return response;

    } catch (error) {
      await ProfileRepository.rollbackTransaction(depositTransaction);
    }

  }

    const validateDepositAmountOverThreshold = function (depositAmount, totalprice){
      const depositThreshold = totalprice * 1.25;
      return depositAmount > depositThreshold;
  };

  module.exports = {
    deposit,
  };
