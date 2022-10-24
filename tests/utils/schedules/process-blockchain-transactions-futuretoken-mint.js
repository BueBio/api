'use strict';
const app = require('../../mocks/app');
const should = require('should');
const processBlockchainTransactions = require('@utils/schedules/process-blockchain-transactions');
const {Producer, FutureProductionOffer, BlockchainTransaction} = require('@models');

describe('Utils - schedules - process-blockchain-transactions (type FUTURETOKEN_MINT)', () => {
    before(() => {
        return app.start();
    });
    
    before(() => {
        return Promise.all([
            Producer.create({
                _id: '00000000000000aaaa000001',
                name: 'Testing company 01',
                description: 'This is a testing company with id 01',
                logo: '00000000000000aacc000010',
                walletAddress: '0x00000000000000000000000000000000abc00001'
            }),
            Producer.create({
                _id: '00000000000000aaaa000002',
                name: 'Testing company 02',
                description: 'This is a testing company with id 02',
                logo: '00000000000000aacc000020',
                walletAddress: '0x00000000000000000000000000000000abc00002'
            }),
            Producer.create({
                _id: '00000000000000aaaa000003',
                name: 'Testing company 03',
                description: 'This is a testing company with id 03',
                logo: '00000000000000aacc000030',
                walletAddress: '0x00000000000000000000000000000000abc00003'
            }),
            Producer.create({
                _id: '00000000000000aaaa000004',
                name: 'Testing company 04',
                description: 'This is a testing company with id 04',
                logo: '00000000000000aacc000040',
                walletAddress: '0x00000000000000000000000000000000abc00004'
            }),
            Producer.create({
                _id: '00000000000000aaaa000005',
                name: 'Testing company 05',
                description: 'This is a testing company with id 05',
                logo: '00000000000000aacc000050',
                walletAddress: '0x00000000000000000000000000000000abc00005'
            }),
            FutureProductionOffer.create({
                _id: '00000000000000aabb000001',
                producer: '00000000000000aaaa000001',
                productName: 'Product example 1',
                productDescription: 'Description product example 1',
                description: 'Frasco de 100mg',
                publishedAt: new Date('2022-07-18T15:45:00.000Z'),
                expiredAt: new Date('2022-12-04T03:00:00.000Z'),
                availabledAt: new Date('2022-12-01T03:00:00.000Z'),
                totalQuantity: 100,
                availableQuantity: 100,
                priceTokenAddress: '0x0000000000000000000000000000000000000010',
                priceTokenSymbol: 'MO200',
                priceTokenDecimals: 6,
                priceAmount: 10,
                image: '00000000000000aacc000001',
                status: 'active'
            }),
            FutureProductionOffer.create({
                _id: '00000000000000aabb000002',
                producer: '00000000000000aaaa000002',
                productName: 'Product example 2',
                productDescription: 'Description product example 2',
                description: 'Frasco de 200mg',
                publishedAt: new Date('2022-07-18T15:45:00.000Z'),
                expiredAt: new Date('2022-12-04T03:00:00.000Z'),
                availabledAt: new Date('2022-12-02T03:00:00.000Z'),
                totalQuantity: 200,
                availableQuantity: 200,
                priceTokenAddress: '0x0000000000000000000000000000000000000020',
                priceTokenSymbol: 'MO200',
                priceTokenDecimals: 18,
                priceAmount: 20,
                image: '00000000000000aacc000002',
                status: 'active'
            }),
            FutureProductionOffer.create({
                _id: '00000000000000aabb000003',
                producer: '00000000000000aaaa000003',
                productName: 'Product example 3',
                productDescription: 'Description product example 3',
                description: 'Frasco de 300mg',
                publishedAt: new Date('2022-07-18T15:45:00.000Z'),
                expiredAt: new Date('2022-12-04T03:00:00.000Z'),
                availabledAt: new Date('2022-12-03T03:00:00.000Z'),
                totalQuantity: 300,
                availableQuantity: 300,
                priceTokenAddress: '0x0000000000000000000000000000000000000030',
                priceTokenSymbol: 'MO200',
                priceTokenDecimals: 6,
                priceAmount: 30,
                image: '00000000000000aacc000002',
                status: 'active'
            }),
            FutureProductionOffer.create({
                _id: '00000000000000aabb000004',
                producer: '00000000000000aaaa000004',
                productName: 'Product example 4',
                productDescription: 'Description product example 4',
                description: 'Frasco de 400mg',
                publishedAt: new Date('2022-07-18T15:45:00.000Z'),
                expiredAt: new Date('2022-12-04T03:00:00.000Z'),
                availabledAt: new Date('2022-12-04T03:00:00.000Z'),
                totalQuantity: 2001,
                availableQuantity: 2001,
                priceTokenAddress: '0x0000000000000000000000000000000000000040',
                priceTokenSymbol: 'MO200',
                priceTokenDecimals: 18,
                priceAmount: 40,
                image: '00000000000000aacc000002',
                status: 'active'
            }),
            FutureProductionOffer.create({
                _id: '00000000000000aabb000005',
                producer: '00000000000000aaaa000005',
                productName: 'Product example 5',
                productDescription: 'Description product example 5',
                description: 'Frasco de 500mg',
                publishedAt: new Date('2022-07-18T15:45:00.000Z'),
                expiredAt: new Date('2022-12-04T03:00:00.000Z'),
                availabledAt: new Date('2022-12-05T03:00:00.000Z'),
                totalQuantity: 2001,
                availableQuantity: 2001,
                priceTokenAddress: '0x0000000000000000000000000000000000000050',
                priceTokenSymbol: 'MO200',
                priceTokenDecimals: 18,
                priceAmount: 50,
                image: '00000000000000aacc000002',
                status: 'active'
            }),
            BlockchainTransaction.create({
                _id: '00000000000000aacc000001',
                type: 'FUTURETOKEN_MINT',
                status: 'PENDING',
                references: {
                    futureProductionOffer: '00000000000000aabb000001'
                },
                tries: 0
            }),
            BlockchainTransaction.create({
                _id: '00000000000000aacc000002',
                type: 'FUTURETOKEN_MINT',
                status: 'PENDING',
                references: {
                    futureProductionOffer: '00000000000000aabb000002'
                },
                tries: 5
            }),
            BlockchainTransaction.create({
                _id: '00000000000000aacc000003',
                type: 'FUTURETOKEN_MINT',
                status: 'FAILED',
                references: {
                    futureProductionOffer: '00000000000000aabb000003'
                },
                tries: 0
            }),
            BlockchainTransaction.create({
                _id: '00000000000000aacc000004',
                type: 'FUTURETOKEN_MINT',
                status: 'PENDING',
                references: {
                    futureProductionOffer: '00000000000000aabb000004'
                },
                tries: 0
            }),
            BlockchainTransaction.create({
                _id: '00000000000000aacc000005',
                type: 'FUTURETOKEN_MINT',
                status: 'PENDING',
                references: {
                    futureProductionOffer: '00000000000000aabb000005'
                },
                tries: 5
            })
        ]);
    });

    after(() => {
        return Promise.all([
            Producer.deleteMany({}),
            FutureProductionOffer.deleteMany({}),
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
                transactions[0]._id.toString().should.be.equal('00000000000000aacc000001');
                transactions[0].type.should.be.equal('FUTURETOKEN_MINT');
                transactions[0].status.should.be.equal('PROCESSED');
                transactions[0].references.futureProductionOffer.toString().should.be.equal('00000000000000aabb000001');
                transactions[0].tries.should.be.equal(0);
                transactions[0].transactionId.should.be.equal('3_100_1669863600_0x0000000000000000000000000000000000000010_10000000_0x00000000000000000000000000000000abc00001');
                transactions[0].errorLog.should.have.length(0);
                transactions[1]._id.toString().should.be.equal('00000000000000aacc000002');
                transactions[1].type.should.be.equal('FUTURETOKEN_MINT');
                transactions[1].status.should.be.equal('PROCESSED');
                transactions[1].references.futureProductionOffer.toString().should.be.equal('00000000000000aabb000002');
                transactions[1].tries.should.be.equal(5);
                transactions[1].transactionId.should.be.equal('3_200_1669950000_0x0000000000000000000000000000000000000020_20000000000000000000_0x00000000000000000000000000000000abc00002');
                transactions[1].errorLog.should.have.length(0);
                transactions[2]._id.toString().should.be.equal('00000000000000aacc000003');
                transactions[2].type.should.be.equal('FUTURETOKEN_MINT');
                transactions[2].status.should.be.equal('FAILED');
                transactions[2].references.futureProductionOffer.toString().should.be.equal('00000000000000aabb000003');
                transactions[2].tries.should.be.equal(0);
                should.not.exists(transactions[2].transactionId);
                transactions[2].errorLog.should.have.length(0);
                transactions[3]._id.toString().should.be.equal('00000000000000aacc000004');
                transactions[3].type.should.be.equal('FUTURETOKEN_MINT');
                transactions[3].status.should.be.equal('PENDING');
                transactions[3].references.futureProductionOffer.toString().should.be.equal('00000000000000aabb000004');
                transactions[3].tries.should.be.equal(1);
                transactions[3].transactionId.should.be.equal('3_2001_1670122800_0x0000000000000000000000000000000000000040_40000000000000000000_0x00000000000000000000000000000000abc00004');
                transactions[3].errorLog.should.have.length(1);
                transactions[3].errorLog.should.containDeep(['rejected_transaction']);
                transactions[4]._id.toString().should.be.equal('00000000000000aacc000005');
                transactions[4].type.should.be.equal('FUTURETOKEN_MINT');
                transactions[4].status.should.be.equal('FAILED');
                transactions[4].references.futureProductionOffer.toString().should.be.equal('00000000000000aabb000005');
                transactions[4].tries.should.be.equal(6);
                transactions[4].transactionId.should.be.equal('3_2001_1670209200_0x0000000000000000000000000000000000000050_50000000000000000000_0x00000000000000000000000000000000abc00005');
                transactions[4].errorLog.should.have.length(1);
                transactions[4].errorLog.should.containDeep(['rejected_transaction']);

                return FutureProductionOffer.find().sort('_id');
            })
            .then((futureProductionOffers) => {
                futureProductionOffers.should.have.length(5);
                futureProductionOffers[0]._id.toString().should.be.equal('00000000000000aabb000001');
                futureProductionOffers[0].tokenId.should.be.equal(3);
                futureProductionOffers[0].transactionId.should.be.equal('3_100_1669863600_0x0000000000000000000000000000000000000010_10000000_0x00000000000000000000000000000000abc00001');
                futureProductionOffers[1]._id.toString().should.be.equal('00000000000000aabb000002');
                futureProductionOffers[1].tokenId.should.be.equal(3);
                futureProductionOffers[1].transactionId.should.be.equal('3_200_1669950000_0x0000000000000000000000000000000000000020_20000000000000000000_0x00000000000000000000000000000000abc00002');
                futureProductionOffers[2]._id.toString().should.be.equal('00000000000000aabb000003');
                should.not.exists(futureProductionOffers[2].tokenId);
                should.not.exists(futureProductionOffers[2].transactionId);
                futureProductionOffers[3]._id.toString().should.be.equal('00000000000000aabb000004');
                futureProductionOffers[3].tokenId.should.be.equal(3);
                futureProductionOffers[3].transactionId.should.be.equal('3_2001_1670122800_0x0000000000000000000000000000000000000040_40000000000000000000_0x00000000000000000000000000000000abc00004');
                futureProductionOffers[4]._id.toString().should.be.equal('00000000000000aabb000005');
                futureProductionOffers[4].tokenId.should.be.equal(3);
                futureProductionOffers[4].transactionId.should.be.equal('3_2001_1670209200_0x0000000000000000000000000000000000000050_50000000000000000000_0x00000000000000000000000000000000abc00005');
            });
    });
});
