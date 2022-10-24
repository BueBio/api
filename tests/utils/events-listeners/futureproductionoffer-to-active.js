'use strict';
const app = require('../../mocks/app');
const should = require('should');
const futureproductionofferToActive = require('@utils/events-listeners/futureproductionoffer-to-active');
const {FutureProductionOffer, BlockchainTransaction} = require('@models');

describe('Utils - events-listeners - futureproductionoffer-to-active', () => {
    before(() => {
        return app.start();
    });
    
    before(() => {
        return Promise.all([
            FutureProductionOffer.create({
                _id: '00000000000000aabb000001',
                producer: '00000000000000aaaa000001',
                productName: 'Miel orgánica',
                productDescription: 'Frasco de 200mg',
                description: 'Frasco de 200mg',
                publishedAt: new Date('2022-07-18T15:45:00.000Z'),
                expiredAt: new Date('2022-12-04T03:00:00.000Z'),
                availabledAt: new Date('2022-12-06T03:00:00.000Z'),
                totalQuantity: 500,
                availableQuantity: 450,
                priceTokenAddress: '0x0000000000000000000000000000000000000000',
                priceTokenSymbol: 'MO200',
                priceTokenDecimals: 1,
                image: '00000000000000aacc000001',
                status: 'active'
            })
        ]);
    });

    after(() => {
        return Promise.all([
            FutureProductionOffer.deleteMany({}),
            BlockchainTransaction.deleteMany({})
        ])
            .then(() => {
                return app.finish();
            });
    });

    it('Should save a new transaction', function() {
        return futureproductionofferToActive('00000000000000aabb000001')
            .then(() => {
                return BlockchainTransaction.find();
            })
            .then((transactions) => {
                transactions.should.have.length(1);
                transactions[0].type.should.be.equal('FUTURETOKEN_MINT');
                transactions[0].status.should.be.equal('PENDING');
                transactions[0].references.futureProductionOffer.toString().should.be.equal('00000000000000aabb000001');
                transactions[0].tries.should.be.equal(0);
                should.not.exists(transactions[0].transactionId);
                transactions[0].errorLog.should.have.length(0);
            });
    });
});
