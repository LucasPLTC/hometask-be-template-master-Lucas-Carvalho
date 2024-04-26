import { ContractRepository } from 'contract.repository';
import assert from 'assert';

describe('ContractRepository', () => {
    let repo;
    let contract
    let contractsList


    beforeEach(() => {
        contract = {
            "id": "1",
            "clientId": "clientId1",
            "contractorId": "contractorId1",
            "status": "active"
        };

        contractsList = [
            {
                "id": "1",
                "clientId": "clientId1",
                "contractorId": "contractorId1",
                "status": "active"
            },
            {
                "id": "2",
                "clientId": "clientId2",
                "contractorId": "contractorId2",
                "status": "terminated"
            },
            {
                "id": "3",
                "clientId": "clientId3",
                "contractorId": "contractorId3",
                "status": "active"
            },
            {
                "id": "4",
                "clientId": "clientId4",
                "contractorId": "contractorId4",
                "status": "active"
            }
        ];

        repo = new ContractRepository();
    });

    describe('#findByContractIdAndProfileId()', () => {
        it('should handle errors gracefully', async () => {
            try {
                const result = await repo.findByContractIdAndProfileId('invalidContractId', 'invalidProfileId');
                assert.fail('Should have thrown an error');
            } catch(error) {
                assert.equal(error.name, 'APIError');
            }
        });

        it('should return the correct contract', async () => {
            const sampleContract = contract
            const result = await repo.findByContractIdAndProfileId(sampleContract.id, sampleContract.clientId);
            assert.deepEqual(result, sampleContract);
        });
    });

    describe('#getNonTerminatedUserContracts()', () => {
        it('should handle errors gracefully', async () => {
            try {
                const result = await repo.getNonTerminatedUserContracts('invalidContractId');
                assert.fail('Should have thrown an error');
            } catch(error) {
                assert.equal(error.name, 'APIError');
            }
        });

        it('should return non-terminated contracts', async () => {
            const contracts = contractsList
            const nonTerminatedContracts = contracts.filter(c => c.status !== 'terminated');
            const result = await repo.getNonTerminatedUserContracts(contracts[0].ContractorId);
            assert.deepEqual(result, nonTerminatedContracts);
        });
    });
});
