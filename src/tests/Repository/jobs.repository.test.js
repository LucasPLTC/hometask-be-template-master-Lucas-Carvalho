const JobsRepository = require('../../repository/jobs.repository.js');
import {expect} from 'chai';

const sinon = require('sinon');

const stubFunction = (repository, functionName, returnValue) => {
    sinon.stub(repository, functionName).resolves(returnValue);
};

describe('JobsRepository', function () {
    let repository;
    beforeEach(() => {
        repository = new JobsRepository();
    });
    afterEach(function () {
        // Restore the default sandbox here
        sinon.restore();
    });
    describe('#getUnpaidJobs()', function () {
        it('should fetch unpaid jobs of a given profile', async function () {
            const mockProfileId = 1;
            const mockJobs = [{id: 1, paid: false}, {id: 2, paid: false}];
            stubFunction(repository.model, 'findAll', mockJobs);
            const jobs = await repository.getUnpaidJobs(mockProfileId, null);
            expect(jobs).to.deep.equal(mockJobs);
        });
    });

    describe('#findJobToPay()', function() {
        it('should fetch a job record to be paid', async function() {
            const repository = new JobsRepository();
            const mockJobId = 1;
            const mockClientId = 1;
            const mockJob = { id: mockJobId, paid: null };
            sinon.stub(repository.model, 'findOne').resolves(mockJob);

            const job = await repository.findJobToPay(mockJobId, mockClientId, null);
            expect(job).to.deep.equal(mockJob);
        });
    });

    describe('#findTotalJobsToPay()', function() {
        it('should fetch total payment of the jobs to be paid', async function() {
            const repository = new JobsRepository();
            const mockClientId = 1;
            const mockResult = [
                { dataValues: { totalPrice: 5000 } }
            ];
            sinon.stub(repository.sequelize, 'findAll').resolves(mockResult);

            const totalJobsToPay = await repository.findTotalJobsToPay(mockClientId, null);
            expect(totalJobsToPay).to.deep.equal(mockResult);
        });
    });

    describe('#payJob()', function() {
        it('should update a job as paid', async function() {
            const repository = new JobsRepository();
            const mockJobId = 1;
            sinon.stub(repository.model, 'update').resolves([1]);

            const result = await repository.payJob(mockJobId, null);
            expect(result).to.deep.equal([1]);
        });
    });
});
