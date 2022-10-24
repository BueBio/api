'use strict';
const request = require('supertest');
const app = require('../mocks/app');
const path = require('path');
require('should');
const {File, Producer, User} = require('@models');

describe('POST /files', function() {
    let application;

    before(() => {
        return app.start()
            .then((dataApp) => {
                application = dataApp;
            });
    });

    before(() => {
        return Promise.all([
            Producer.create({
                _id: '00000000000000aaaa000001',
                name: 'Testing company 01',
                description: 'This is a testing company with id 01',
                logo: '00000000000000aaee000001'
            }),
            User.create({
                _id: process.env.TESTING_ADMIN_01_ID,
                email: process.env.TESTING_ADMIN_01_EMAIL,
                fullName: 'Admin testing 01',
                role: 'admin'
            }),
            User.create({
                _id: process.env.TESTING_PRODUCER_01_ID,
                email: process.env.TESTING_PRODUCER_01_EMAIL,
                fullName: 'Producer testing 01',
                role: 'producer',
                producer: '00000000000000aaaa000001'
            })
        ]);
    });

    afterEach(() => {
        return File.deleteMany({});
    });

    after(() => {
        return Promise.all([
            Producer.deleteMany({}),
            User.deleteMany({})
        ])
            .then(() => {
                return app.finish();
            });
    });

    it('should return Unauthorized without token', function() {
        return request(application)
            .post('/api/files')
            .set('Accept', 'application/json')
            .attach('file', path.resolve('./tests/mocks/resources/burns excellent.jpg'))
            .expect(401)
            .then((response) => {
                response.body.code.should.be.equal('unauthorized');
                response.body.message.should.be.equal('Unauthorized');
            });
    });

    it('should save file with admin token', function() {
        let newId;
        let filenameTimestamp;
        return request(application)
            .post('/api/files')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${process.env.TESTING_ADMIN_01_TOKEN}`)
            .attach('file', path.resolve('./tests/mocks/resources/burns excellent.jpg'))
            .expect(201)
            .then((response) => {
                newId = response.body._id;
                response.body.originalname.should.be.equal('burns excellent.jpg');
                filenameTimestamp = response.body.filename.split('_')[0];
                response.body.filename.should.be.equal(`${filenameTimestamp}_burns_excellent.jpg`);
                response.body.size.should.be.equal(17476);
                response.body.mimetype.should.be.equal('image/jpeg');
                return File.find();
            })
            .then((files) => {
                files.should.have.length(1);
                files[0]._id.toString().should.be.equal(newId);
                files[0].originalname.should.be.equal('burns excellent.jpg');
                files[0].filename.should.be.equal(`${filenameTimestamp}_burns_excellent.jpg`);
                files[0].size.should.be.equal(17476);
                files[0].mimetype.should.be.equal('image/jpeg');
            });
    });

    it('should save file with producer token', function() {
        let newId;
        let filenameTimestamp;
        return request(application)
            .post('/api/files')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${process.env.TESTING_PRODUCER_01_TOKEN}`)
            .attach('file', path.resolve('./tests/mocks/resources/burns excellent.jpg'))
            .expect(201)
            .then((response) => {
                newId = response.body._id;
                response.body.originalname.should.be.equal('burns excellent.jpg');
                filenameTimestamp = response.body.filename.split('_')[0];
                response.body.filename.should.be.equal(`${filenameTimestamp}_burns_excellent.jpg`);
                response.body.size.should.be.equal(17476);
                response.body.mimetype.should.be.equal('image/jpeg');
                return File.find();
            })
            .then((files) => {
                files.should.have.length(1);
                files[0]._id.toString().should.be.equal(newId);
                files[0].originalname.should.be.equal('burns excellent.jpg');
                files[0].filename.should.be.equal(`${filenameTimestamp}_burns_excellent.jpg`);
                files[0].size.should.be.equal(17476);
                files[0].mimetype.should.be.equal('image/jpeg');
            });
    });
});
