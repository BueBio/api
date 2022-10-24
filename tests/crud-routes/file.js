'use strict';
const request = require('supertest');
const app = require('../mocks/app');
require('should');
const {File} = require('@models');

describe('File', function() {
    let application;

    before(() => {
        return app.start()
            .then((dataApp) => {
                application = dataApp;
            });
    });

    before(() => {
        return File.create({
            _id: '00000000000000aabb000001',
            originalname: 'Testing file 01.png',
            filename: '1658229833945_testing-file-01.png',
            mimetype: 'image/pbg',
            size: 1234
        });
    });

    after(() => {
        return File.deleteMany({})
            .then(() => {
                return app.finish();
            });
    });

    describe('GET', () => {
        it('/files - should return Unauthorized', function() {
            return request(application)
                .get('/api/files')
                .set('Accept', 'application/json')
                .expect(401)
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                });
        });

        it('/files/:id - should return Unauthorized', function() {
            return request(application)
                .get('/api/files/00000000000000aabb000001')
                .set('Accept', 'application/json')
                .expect(401)
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                });
        });
    });

    describe('PUT', () => {
        it('/files/:id - should return Unauthorized', function() {
            return request(application)
                .put('/api/files/00000000000000aabb000001')
                .set('Accept', 'application/json')
                .send({
                    originalname: 'changed name'
                })
                .expect(401)
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                });
        });
    });

    describe('DELETE', () => {
        it('/files/:id - should return Unauthorized', function() {
            return request(application)
                .delete('/api/files/00000000000000aabb000001')
                .set('Accept', 'application/json')
                .expect(401)
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                });
        });
    });

    describe('POST', () => {
        it('/files - should return Unauthorized', function() {
            return request(application)
                .post('/api/files')
                .set('Accept', 'application/json')
                .send({
                    originalname: 'Testing file 02.png',
                    filename: '1658229833945_testing-file-02.png',
                    mimetype: 'image/pbg',
                    size: 1234
                })
                .expect(401)
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                });
        });
    });
});
