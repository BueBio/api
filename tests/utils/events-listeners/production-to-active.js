'use strict';
const app = require('../../mocks/app');
const should = require('should');
const productionToActive = require('@utils/events-listeners/production-to-active');
const {Production, BlockchainTransaction} = require('@models');

describe('Utils - events-listeners - production-to-active', () => {
    before(() => {
        return app.start();
    });
    
    before(() => {
        return Promise.all([
            Production.create({
                _id: '00000000000000aabb000001',
                productName: 'Product example 1',
                productDescription: 'Description product example 1',
                producedAt: new Date(),
                publishedAt: new Date(),
                batch: 'LK-103',
                totalQuantity: 10,
                availableQuantity: 4,
                status: 'pending'
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

    it('Should save a new transaction', function() {
        return productionToActive('00000000000000aabb000001')
            .then(() => {
                return BlockchainTransaction.find();
            })
            .then((transactions) => {
                transactions.should.have.length(1);
                transactions[0].type.should.be.equal('IMPACTTOKEN_MINT');
                transactions[0].status.should.be.equal('PENDING');
                transactions[0].references.production.toString().should.be.equal('00000000000000aabb000001');
                transactions[0].tries.should.be.equal(0);
                should.not.exists(transactions[0].transactionId);
                transactions[0].errorLog.should.have.length(0);
            });
    });
});
