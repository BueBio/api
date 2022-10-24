'use strict';
const app = require('../mocks/app');
const request = require('supertest');
const should = require('should');
const {Types} = require('mongoose');
const {Production, ProductionRewardCode, BlockchainTransaction} = require('@models');

describe('POST /tokens/impacttoken/assign', () => {
    let application;

    before(() => {
        return app.start()
            .then((dataApp) => {
                application = dataApp;
            });
    });

    beforeEach(() => {
        return Promise.all([
            Production.create({
                _id: '00000000000000aabb000001',
                productName: 'Product example 1',
                productDescription: 'Description product example 1',
                producedAt: new Date(),
                publishedAt: new Date(),
                batch: 'LK-103',
                totalQuantity: 3,
                availableQuantity: 2,
                status: 'active'
            }),
            Production.create({
                _id: '00000000000000aabb000002',
                producer: '00000000000000aacc000001',
                productName: 'Miel',
                productDescription: 'Frasco de 100mg',
                producedAt: new Date('2022-06-01T03:00:00.000Z'),
                publishedAt: new Date('2022-08-01T15:30:00.000Z'),
                batch: 'testing0002',
                totalQuantity: 3,
                availableQuantity: 2,
                status: 'active'
            }),
            ProductionRewardCode.create({
                _id: '00000000000000aaaa000001',
                code: 'test-0001',
                status: 'available',
                production: '00000000000000aabb000001'
            }),
            ProductionRewardCode.create({
                _id: '00000000000000aaaa000002',
                code: 'test-0002',
                status: 'used',
                production: '00000000000000aabb000001',
                walletAddress: 'fakewalletaddress02'
            }),
            ProductionRewardCode.create({
                _id: '00000000000000aaaa000003',
                code: 'test-0003',
                status: 'cancelled',
                production: '00000000000000aabb000001'
            }),
            ProductionRewardCode.create({
                _id: '00000000000000aaaa000011',
                production: '00000000000000aabb000002',
                code: 'TEST-CODE02',
                status: 'available'
            }),
            ProductionRewardCode.create({
                _id: '00000000000000aaaa000012',
                production: '00000000000000aabb000002',
                code: 'TEST-CODE02',
                status: 'used',
                walletAddress: 'fakewalletaddress03'
            }),
            ProductionRewardCode.create({
                _id: '00000000000000aaaa000013',
                production: '00000000000000aabb000002',
                code: 'TEST-CODE02',
                status: 'available'
            })
        ]);
    });

    afterEach(() => {
        return Promise.all([
            Production.deleteMany({}),
            ProductionRewardCode.deleteMany({}),
            BlockchainTransaction.deleteMany({})
        ]);
    });

    after(() => {
        return app.finish();
    });

    it('Should fail without code', function() {
        return request(application)
            .post('/api/tokens/impacttoken/assign')
            .set('Accept', 'application/json')
            .send({
                wallet: '0x796867C8024Ec53dc06e801919944CB934Afbbe9'
            })
            .expect(400)
            .then((response) => {
                response.body.code.should.be.equal('invalid_fields');
                response.body.message.should.be.equal('Invalid field - "code" is required');
            });
    });

    it('Should fail without wallet', function() {
        return request(application)
            .post('/api/tokens/impacttoken/assign')
            .set('Accept', 'application/json')
            .send({
                code: 'test-0001'
            })
            .expect(400)
            .then((response) => {
                response.body.code.should.be.equal('invalid_fields');
                response.body.message.should.be.equal('Invalid field - "wallet" is required');
            });
    });

    it('Should fail with invalid wallet format', function() {
        return request(application)
            .post('/api/tokens/impacttoken/assign')
            .set('Accept', 'application/json')
            .send({
                code: 'test-0001',
                wallet: 'invalidwallet'
            })
            .expect(400)
            .then((response) => {
                response.body.code.should.be.equal('invalid_fields');
                response.body.message.should.be.equal('Invalid field - "wallet" with value "invalidwallet" ' +
                    'fails to match the required pattern: /^0x[a-fA-F0-9]{40}$/');
            });
    });

    it('Should fail with used reward-code', function() {
        return request(application)
            .post('/api/tokens/impacttoken/assign')
            .set('Accept', 'application/json')
            .send({
                code: 'test-0002',
                wallet: '0x796867C8024Ec53dc06e801919944CB934Afbbe9'
            })
            .expect(400)
            .then((response) => {
                response.body.code.should.be.equal('invalid_or_used_code');
                response.body.message.should.be.equal('Invalid or used reward code');
            });
    });

    it('Should fail with cancelled reward-code', function() {
        return request(application)
            .post('/api/tokens/impacttoken/assign')
            .set('Accept', 'application/json')
            .send({
                code: 'test-0003',
                wallet: '0x796867C8024Ec53dc06e801919944CB934Afbbe9'
            })
            .expect(400)
            .then((response) => {
                response.body.code.should.be.equal('invalid_or_used_code');
                response.body.message.should.be.equal('Invalid or used reward code');
            });
    });

    it('Should update reward-code and generate a new blockchain-transaction', function() {
        return request(application)
            .post('/api/tokens/impacttoken/assign')
            .set('Accept', 'application/json')
            .send({
                code: 'test-0001',
                wallet: '0x796867C8024Ec53dc06e801919944CB934Afbbe9'
            })
            .expect(200)
            .then(() => {
                return ProductionRewardCode.find({production: '00000000000000aabb000001'});
            })
            .then((rewardCodes) => {
                rewardCodes.should.have.length(3);
                rewardCodes.should.containDeep([{
                    _id: Types.ObjectId('00000000000000aaaa000001'),
                    code: 'test-0001',
                    status: 'used',
                    production: Types.ObjectId('00000000000000aabb000001'),
                    walletAddress: '0x796867C8024Ec53dc06e801919944CB934Afbbe9'
                }, {
                    _id: Types.ObjectId('00000000000000aaaa000002'),
                    code: 'test-0002',
                    status: 'used',
                    production: Types.ObjectId('00000000000000aabb000001'),
                    walletAddress: 'fakewalletaddress02'
                }, {
                    _id: Types.ObjectId('00000000000000aaaa000003'),
                    code: 'test-0003',
                    status: 'cancelled',
                    production: Types.ObjectId('00000000000000aabb000001')
                }]);
                return BlockchainTransaction.find();
            })
            .then((transactions) => {
                transactions.should.have.length(1);
                transactions[0].type.should.be.equal('IMPACTTOKEN_ASSIGN');
                transactions[0].status.should.be.equal('PENDING');
                transactions[0].references.production.toString().should.be.equal('00000000000000aabb000001');
                transactions[0].references.productionRewardCode.toString().should.be.equal('00000000000000aaaa000001');
                transactions[0].tries.should.be.equal(0);
                should.not.exists(transactions[0].transactionId);
                return Production.findById('00000000000000aabb000001');
            })
            .then((production) => {
                production.availableQuantity.should.be.equal(1);
            });
    });

    it('Should update reward-code and generate a new blockchain-transaction (with repeated code)', function() {
        let usedRewardCodeId;
        return request(application)
            .post('/api/tokens/impacttoken/assign')
            .set('Accept', 'application/json')
            .send({
                code: 'TEST-CODE02',
                wallet: '0x796867C8024Ec53dc06e801919944CB934Afbbe9'
            })
            .expect(200)
            .then(() => {
                return ProductionRewardCode.find({production: '00000000000000aabb000002'});
            })
            .then((rewardCodes) => {
                rewardCodes.should.have.length(3);
                rewardCodes.should.containDeep([{
                    _id: Types.ObjectId('00000000000000aaaa000012'),
                    code: 'TEST-CODE02',
                    status: 'used',
                    production: Types.ObjectId('00000000000000aabb000002'),
                    walletAddress: 'fakewalletaddress03'
                }, {
                    code: 'TEST-CODE02',
                    status: 'used',
                    production: Types.ObjectId('00000000000000aabb000002'),
                    walletAddress: '0x796867C8024Ec53dc06e801919944CB934Afbbe9'
                }, {
                    code: 'TEST-CODE02',
                    status: 'available',
                    production: Types.ObjectId('00000000000000aabb000002')
                }]);
                usedRewardCodeId = rewardCodes.find((elem) => {
                    return elem._id.toString() !== '00000000000000aaaa000012' && elem.status === 'used';
                })._id.toString();
                return BlockchainTransaction.find();
            })
            .then((transactions) => {
                transactions.should.have.length(1);
                transactions[0].type.should.be.equal('IMPACTTOKEN_ASSIGN');
                transactions[0].status.should.be.equal('PENDING');
                transactions[0].references.production.toString().should.be.equal('00000000000000aabb000002');
                transactions[0].references.productionRewardCode.toString().should.be.equal(usedRewardCodeId);
                transactions[0].tries.should.be.equal(0);
                should.not.exists(transactions[0].transactionId);
                return Production.findById('00000000000000aabb000002');
            })
            .then((production) => {
                production.availableQuantity.should.be.equal(1);
            });
    });
});
