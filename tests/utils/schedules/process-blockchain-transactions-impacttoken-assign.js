'use strict';
const app = require('../../mocks/app');
const should = require('should');
const processBlockchainTransactions = require('@utils/schedules/process-blockchain-transactions');
const {Production, ProductionRewardCode, BlockchainTransaction} = require('@models');
const BLOCKCHAIN_BUEBIO_ADDRESS = process.env.BLOCKCHAIN_BUEBIO_ADDRESS;

describe('Utils - schedules - process-blockchain-transactions (type IMPACTTOKEN_ASSIGN)', () => {
    before(() => {
        return app.start();
    });
    
    before(() => {
        return Promise.all([
            Production.create({
                _id: '00000000000000aaaa000001',
                productName: 'Product example 1',
                productDescription: 'Description product example 1',
                producedAt: new Date(),
                publishedAt: new Date(),
                batch: 'LK-101',
                totalQuantity: 3,
                availableQuantity: 2,
                status: 'active',
                tokenId: 11
            }),
            Production.create({
                _id: '00000000000000aaaa000002',
                productName: 'Product example 2',
                productDescription: 'Description product example 2',
                producedAt: new Date(),
                publishedAt: new Date(),
                batch: 'LK-102',
                totalQuantity: 2,
                availableQuantity: 1,
                status: 'active',
                tokenId: 12
            }),
            ProductionRewardCode.create({
                _id: '00000000000000aacc000001',
                production: '00000000000000aaaa000001',
                code: '001001',
                status: 'used',
                walletAddress: 'afakewalletaddress'
            }),
            ProductionRewardCode.create({
                _id: '00000000000000aacc000002',
                production: '00000000000000aaaa000001',
                code: '001002',
                status: 'used',
                walletAddress: '0x6501039C2Dcc177B57A7896Bf8d1f1614def7FB2'
            }),
            ProductionRewardCode.create({
                _id: '00000000000000aacc000003',
                production: '00000000000000aaaa000001',
                code: '001003',
                status: 'available'
            }),
            ProductionRewardCode.create({
                _id: '00000000000000aacc000004',
                production: '00000000000000aaaa000002',
                code: '002001',
                status: 'available',
                walletAddress: '0x8fCD534aDE65fC7c8BB1e408c57e23f37cAF12b0'
            }),
            ProductionRewardCode.create({
                _id: '00000000000000aacc000005',
                production: '00000000000000aaaa000002',
                code: '002002',
                status: 'used',
                walletAddress: 'afakewalletaddress'
            }),
            BlockchainTransaction.create({
                _id: '00000000000000aabb000001',
                type: 'IMPACTTOKEN_ASSIGN',
                status: 'PENDING',
                references: {
                    production: '00000000000000aaaa000001',
                    productionRewardCode: '00000000000000aacc000002'
                },
                tries: 0
            }),
            BlockchainTransaction.create({
                _id: '00000000000000aabb000002',
                type: 'IMPACTTOKEN_ASSIGN',
                status: 'PENDING',
                references: {
                    production: '00000000000000aaaa000002',
                    productionRewardCode: '00000000000000aacc000004'
                },
                tries: 5
            }),
            BlockchainTransaction.create({
                _id: '00000000000000aabb000003',
                type: 'IMPACTTOKEN_ASSIGN',
                status: 'FAILED',
                references: {
                    production: '00000000000000aaaa000002',
                    productionRewardCode: '00000000000000aacc000003'
                },
                tries: 0
            }),
            BlockchainTransaction.create({
                _id: '00000000000000aabb000004',
                type: 'IMPACTTOKEN_ASSIGN',
                status: 'PROCESSED',
                references: {
                    production: '00000000000000aaaa000002',
                    productionRewardCode: '00000000000000aacc000005'
                },
                tries: 0,
                transactionId: 'faketransactionid4'
            })
        ]);
    });

    after(() => {
        return Promise.all([
            Production.deleteMany({}),
            ProductionRewardCode.deleteMany({}),
            BlockchainTransaction.deleteMany({})
        ])
            .then(() => {
                return app.finish();
            });
    });

    it('Should process transactions', function() {
        return processBlockchainTransactions()
            .then(() => {
                return BlockchainTransaction.find().sort('_id');
            })
            .then((transactions) => {
                transactions.should.have.length(4);
                transactions[0]._id.toString().should.be.equal('00000000000000aabb000001');
                transactions[0].type.should.be.equal('IMPACTTOKEN_ASSIGN');
                transactions[0].status.should.be.equal('PROCESSED');
                transactions[0].references.productionRewardCode.toString().should.be.equal('00000000000000aacc000002');
                transactions[0].tries.should.be.equal(0);
                transactions[0].transactionId.should.be.equal(`11_1_${BLOCKCHAIN_BUEBIO_ADDRESS}_0x6501039C2Dcc177B57A7896Bf8d1f1614def7FB2`);
                transactions[0].errorLog.should.have.length(0);
                transactions[1]._id.toString().should.be.equal('00000000000000aabb000002');
                transactions[1].type.should.be.equal('IMPACTTOKEN_ASSIGN');
                transactions[1].status.should.be.equal('PROCESSED');
                transactions[1].references.productionRewardCode.toString().should.be.equal('00000000000000aacc000004');
                transactions[1].tries.should.be.equal(5);
                transactions[1].transactionId.should.be.equal(`12_1_${BLOCKCHAIN_BUEBIO_ADDRESS}_0x8fCD534aDE65fC7c8BB1e408c57e23f37cAF12b0`);
                transactions[1].errorLog.should.have.length(0);
                transactions[2]._id.toString().should.be.equal('00000000000000aabb000003');
                transactions[2].type.should.be.equal('IMPACTTOKEN_ASSIGN');
                transactions[2].status.should.be.equal('FAILED');
                transactions[2].references.productionRewardCode.toString().should.be.equal('00000000000000aacc000003');
                transactions[2].tries.should.be.equal(0);
                should.not.exists(transactions[2].transactionId);
                transactions[2].errorLog.should.have.length(0);
                transactions[3]._id.toString().should.be.equal('00000000000000aabb000004');
                transactions[3].type.should.be.equal('IMPACTTOKEN_ASSIGN');
                transactions[3].status.should.be.equal('PROCESSED');
                transactions[3].references.productionRewardCode.toString().should.be.equal('00000000000000aacc000005');
                transactions[3].tries.should.be.equal(0);
                transactions[3].transactionId.should.be.equal('faketransactionid4');

                return ProductionRewardCode.find().sort('_id');
            })
            .then((rewardCodes) => {
                rewardCodes.should.have.length(5);
                rewardCodes[0]._id.toString().should.be.equal('00000000000000aacc000001');
                should.not.exists(rewardCodes[0].transactionId);
                rewardCodes[1]._id.toString().should.be.equal('00000000000000aacc000002');
                rewardCodes[1].transactionId.should.be.equal(`11_1_${BLOCKCHAIN_BUEBIO_ADDRESS}_0x6501039C2Dcc177B57A7896Bf8d1f1614def7FB2`);
                rewardCodes[2]._id.toString().should.be.equal('00000000000000aacc000003');
                should.not.exists(rewardCodes[2].transactionId);
                rewardCodes[3]._id.toString().should.be.equal('00000000000000aacc000004');
                rewardCodes[3].transactionId.should.be.equal(`12_1_${BLOCKCHAIN_BUEBIO_ADDRESS}_0x8fCD534aDE65fC7c8BB1e408c57e23f37cAF12b0`);
                rewardCodes[4]._id.toString().should.be.equal('00000000000000aacc000005');
                should.not.exists(rewardCodes[4].transactionId);
            });
    });
});
