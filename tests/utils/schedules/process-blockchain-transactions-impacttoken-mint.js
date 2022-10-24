'use strict';
const app = require('../../mocks/app');
const should = require('should');
const processBlockchainTransactions = require('@utils/schedules/process-blockchain-transactions');
const {Production, BlockchainTransaction} = require('@models');
const BLOCKCHAIN_BUEBIO_ADDRESS = process.env.BLOCKCHAIN_BUEBIO_ADDRESS;

describe('Utils - schedules - process-blockchain-transactions (type IMPACTTOKEN_MINT)', () => {
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
                totalQuantity: 10,
                availableQuantity: 4,
                status: 'active'
            }),
            Production.create({
                _id: '00000000000000aaaa000002',
                productName: 'Product example 2',
                productDescription: 'Description product example 2',
                producedAt: new Date(),
                publishedAt: new Date(),
                batch: 'LK-102',
                totalQuantity: 200,
                availableQuantity: 200,
                status: 'active'
            }),
            Production.create({
                _id: '00000000000000aaaa000003',
                productName: 'Product example 3',
                productDescription: 'Description product example 3',
                producedAt: new Date(),
                publishedAt: new Date(),
                batch: 'LK-103',
                totalQuantity: 300,
                availableQuantity: 300,
                status: 'active'
            }),
            Production.create({
                _id: '00000000000000aaaa000004',
                productName: 'Product example 4',
                productDescription: 'Description product example 4',
                producedAt: new Date(),
                publishedAt: new Date(),
                batch: 'LK-104',
                totalQuantity: 2001,
                availableQuantity: 2001,
                status: 'active'
            }),
            Production.create({
                _id: '00000000000000aaaa000005',
                productName: 'Product example 5',
                productDescription: 'Description product example 5',
                producedAt: new Date(),
                publishedAt: new Date(),
                batch: 'LK-105',
                totalQuantity: 2001,
                availableQuantity: 2001,
                status: 'active'
            }),
            BlockchainTransaction.create({
                _id: '00000000000000aabb000001',
                type: 'IMPACTTOKEN_MINT',
                status: 'PENDING',
                references: {
                    production: '00000000000000aaaa000001'
                },
                tries: 0
            }),
            BlockchainTransaction.create({
                _id: '00000000000000aabb000002',
                type: 'IMPACTTOKEN_MINT',
                status: 'PENDING',
                references: {
                    production: '00000000000000aaaa000002'
                },
                tries: 5
            }),
            BlockchainTransaction.create({
                _id: '00000000000000aabb000003',
                type: 'IMPACTTOKEN_MINT',
                status: 'FAILED',
                references: {
                    production: '00000000000000aaaa000003'
                },
                tries: 0
            }),
            BlockchainTransaction.create({
                _id: '00000000000000aabb000004',
                type: 'IMPACTTOKEN_MINT',
                status: 'PENDING',
                references: {
                    production: '00000000000000aaaa000004'
                },
                tries: 0
            }),
            BlockchainTransaction.create({
                _id: '00000000000000aabb000005',
                type: 'IMPACTTOKEN_MINT',
                status: 'PENDING',
                references: {
                    production: '00000000000000aaaa000005'
                },
                tries: 5
            })
        ]);
    });

    after(() => {
        return Promise.all([
            Production.deleteMany({}),
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
                transactions.should.have.length(5);
                transactions[0]._id.toString().should.be.equal('00000000000000aabb000001');
                transactions[0].type.should.be.equal('IMPACTTOKEN_MINT');
                transactions[0].status.should.be.equal('PROCESSED');
                transactions[0].references.production.toString().should.be.equal('00000000000000aaaa000001');
                transactions[0].tries.should.be.equal(0);
                transactions[0].transactionId.should.be.equal(`3_10_${BLOCKCHAIN_BUEBIO_ADDRESS}`);
                transactions[0].errorLog.should.have.length(0);
                transactions[1]._id.toString().should.be.equal('00000000000000aabb000002');
                transactions[1].type.should.be.equal('IMPACTTOKEN_MINT');
                transactions[1].status.should.be.equal('PROCESSED');
                transactions[1].references.production.toString().should.be.equal('00000000000000aaaa000002');
                transactions[1].tries.should.be.equal(5);
                transactions[1].transactionId.should.be.equal(`3_200_${BLOCKCHAIN_BUEBIO_ADDRESS}`);
                transactions[1].errorLog.should.have.length(0);
                transactions[2]._id.toString().should.be.equal('00000000000000aabb000003');
                transactions[2].type.should.be.equal('IMPACTTOKEN_MINT');
                transactions[2].status.should.be.equal('FAILED');
                transactions[2].references.production.toString().should.be.equal('00000000000000aaaa000003');
                transactions[2].tries.should.be.equal(0);
                should.not.exists(transactions[2].transactionId);
                transactions[2].errorLog.should.have.length(0);
                transactions[3]._id.toString().should.be.equal('00000000000000aabb000004');
                transactions[3].type.should.be.equal('IMPACTTOKEN_MINT');
                transactions[3].status.should.be.equal('PENDING');
                transactions[3].references.production.toString().should.be.equal('00000000000000aaaa000004');
                transactions[3].tries.should.be.equal(1);
                transactions[3].transactionId.should.be.equal(`3_2001_${BLOCKCHAIN_BUEBIO_ADDRESS}`);
                transactions[3].errorLog.should.have.length(1);
                transactions[3].errorLog.should.containDeep(['rejected_transaction']);
                transactions[4]._id.toString().should.be.equal('00000000000000aabb000005');
                transactions[4].type.should.be.equal('IMPACTTOKEN_MINT');
                transactions[4].status.should.be.equal('FAILED');
                transactions[4].references.production.toString().should.be.equal('00000000000000aaaa000005');
                transactions[4].tries.should.be.equal(6);
                transactions[4].transactionId.should.be.equal(`3_2001_${BLOCKCHAIN_BUEBIO_ADDRESS}`);
                transactions[4].errorLog.should.have.length(1);
                transactions[4].errorLog.should.containDeep(['rejected_transaction']);

                return Production.find().sort('_id');
            })
            .then((productions) => {
                productions.should.have.length(5);
                productions[0]._id.toString().should.be.equal('00000000000000aaaa000001');
                productions[0].tokenId.should.be.equal(3);
                productions[0].transactionId.should.be.equal(`3_10_${BLOCKCHAIN_BUEBIO_ADDRESS}`);
                productions[1]._id.toString().should.be.equal('00000000000000aaaa000002');
                productions[1].tokenId.should.be.equal(3);
                productions[1].transactionId.should.be.equal(`3_200_${BLOCKCHAIN_BUEBIO_ADDRESS}`);
                productions[2]._id.toString().should.be.equal('00000000000000aaaa000003');
                should.not.exists(productions[2].tokenId);
                should.not.exists(productions[2].transactionId);
                productions[3]._id.toString().should.be.equal('00000000000000aaaa000004');
                productions[3].tokenId.should.be.equal(3);
                productions[3].transactionId.should.be.equal(`3_2001_${BLOCKCHAIN_BUEBIO_ADDRESS}`);
                productions[4]._id.toString().should.be.equal('00000000000000aaaa000005');
                productions[4].tokenId.should.be.equal(3);
                productions[4].transactionId.should.be.equal(`3_2001_${BLOCKCHAIN_BUEBIO_ADDRESS}`);
            });
    });
});
