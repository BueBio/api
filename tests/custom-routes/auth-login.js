'use strict';

const app = require('../mocks/app');
const request = require('supertest');
require('should');
const {User} = require('@models');
const jwt = require('jsonwebtoken');

function decodedToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

describe('POST /auth/login', () => {
    let application;
    before(() => {
        return app.start()
            .then((dataApp) => {
                application = dataApp;
                return User.deleteMany({});
            })
            .then(() => {
                return Promise.all([
                    User.create({
                        _id: '00000000000000aabb000001',
                        fullname: 'User One',
                        email: 'userone@mail.com',
                        role: 'admin',
                        password: 'soyunapassword'
                    }),
                    User.create({
                        _id: '00000000000000aabb000002',
                        fullname: 'User Two',
                        email: 'usertwo@mail.com',
                        role: 'producer',
                        password: 'soyunapassword'
                    })
                ]);
            });
    });

    after(() => {
        return User.deleteMany({})
            .then(() => {
                return app.finish();
            });
    });

    it('Should return body is empty', function() {
        return request(application)
            .post('/api/auth/login')
            .set('Accept', 'application/json')
            .expect(400)
            .then((response) => {
                response.body.message.should.be.equal('Missing params');
                response.body.code.should.be.equal('missing_params');
            });
    });

    it('Should return user not found', function() {
        return request(application)
            .post('/api/auth/login')
            .set('Accept', 'application/json')
            .send({
                email: 'userone@gmail.com',
                password: 'soyunapassword'
            })
            .expect(400)
            .then((response) => {
                response.body.message.should.be.equal('Authentication failed');
                response.body.code.should.be.equal('authentication_failed');
            });
    });

    it('Should return authentication failed', function() {
        return request(application)
            .post('/api/auth/login')
            .set('Accept', 'application/json')
            .send({
                email: 'userone@mail.com',
                password: 'soyunapasswords'
            })
            .expect(400)
            .then((response) => {
                response.body.message.should.be.equal('Authentication failed');
                response.body.code.should.be.equal('authentication_failed');
            });
    });

    it('Should return user admin with token valid', function() {
        return request(application)
            .post('/api/auth/login')
            .set('Accept', 'application/json')
            .send({
                email: 'userone@mail.com',
                password: 'soyunapassword'
            })
            .expect(200)
            .then((response) => {
                response.statusCode.should.be.equal(200);
                response.body.token.should.be.a.String();
                const result = decodedToken(response.body.token, process.env.JWT_SECRET);
                result.iss.should.be.equal(process.env.JWT_ISSUER);
                result.email.should.be.equal('userone@mail.com');
                result.role.should.be.equal('admin');
                result.sub.should.be.equal('00000000000000aabb000001');
            });
    });

    it('Should return user producer with token valid', function() {
        return request(application)
            .post('/api/auth/login')
            .set('Accept', 'application/json')
            .send({
                email: 'usertwo@mail.com',
                password: 'soyunapassword'
            })
            .expect(200)
            .then((response) => {
                response.statusCode.should.be.equal(200);
                response.body.token.should.be.a.String();
                const result = decodedToken(response.body.token, process.env.JWT_SECRET);
                result.iss.should.be.equal(process.env.JWT_ISSUER);
                result.email.should.be.equal('usertwo@mail.com');
                result.role.should.be.equal('producer');
                result.sub.should.be.equal('00000000000000aabb000002');
            });
    });
});
