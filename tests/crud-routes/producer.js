'use strict';
const request = require('supertest');
const app = require('../mocks/app');
require('should');
const {Producer} = require('@models');

describe('Producer', function() {
    let application;

    before(() => {
        return app.start()
            .then((dataApp) => {
                application = dataApp;
            });
    });

    before(() => {
        return Producer.create({
            _id: '00000000000000aabb000001',
            name: 'Producer company 01',
            description: 'This is a testing producer company 01',
            logo: '00000000000000aaac000001'
        });
    });

    after(() => {
        return Producer.deleteMany({})
            .then(() => {
                return app.finish();
            });
    });

    describe('GET', () => {
        it('/producers - should return Unauthorized', function() {
            return request(application)
                .get('/api/producers')
                .set('Accept', 'application/json')
                .expect(401)
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                });
        });

        it('/producers/:id - should return Unauthorized', function() {
            return request(application)
                .get('/api/producers/00000000000000aabb000001')
                .set('Accept', 'application/json')
                .expect(401)
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                });
        });
    });

    describe('PUT', () => {
        it('/producers/:id - should return Unauthorized', function() {
            return request(application)
                .put('/api/producers/00000000000000aabb000001')
                .set('Accept', 'application/json')
                .send({
                    description: 'A new description'
                })
                .expect(401)
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                });
        });
    });

    describe('DELETE', () => {
        it('/producers/:id - should return Unauthorized', function() {
            return request(application)
                .delete('/api/producers/00000000000000aabb000001')
                .set('Accept', 'application/json')
                .expect(401)
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                });
        });
    });

    describe('POST', () => {
        it('/producers - should return Unauthorized', function() {
            return request(application)
                .post('/api/producers')
                .set('Accept', 'application/json')
                .send({
                    name: 'Producer company 02',
                    description: 'This is a testing producer company 02',
                    logo: '00000000000000aaac000002'
                })
                .expect(401)
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                });
        });
    });
});
