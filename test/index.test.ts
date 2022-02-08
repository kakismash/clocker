import * as LambdaTester from 'lambda-tester';
import { handler } from '../index';
import { Clocker } from '../util';

import chai, { expect, should } from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);

const globalPath = 'https://rhsnde7a0k.execute-api.us-east-1.amazonaws.com';

describe('handler test', () => {
    it('success GET /clocker', (done) => {
        chai.request(globalPath).get('/clocker').end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res).to.be.text;
            const parsedBody: Array<Clocker> = JSON.parse(res.text);
            expect(parsedBody.length).to.be.greaterThanOrEqual(0);

            expect(parsedBody).be.a('array');
            done();
        });
    });

    it('success GET /clocker/id', (done) => {
        chai.request(globalPath).get('/clocker/7379b4beb2cc9a38d5d9e0cac2a67203').end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res).to.be.text;
            const parsedBody: Clocker = JSON.parse(res.text);
            expect(parsedBody).to.have.a.property('id');
            expect(parsedBody).to.have.a.property('firstname');
            expect(parsedBody).to.have.a.property('lastname');
            expect(parsedBody).to.have.a.property('email');
            expect(parsedBody).to.have.a.property('middleInitial');
            expect(parsedBody).to.have.a.property('gender');
            expect(parsedBody).to.have.a.property('age');
            done();
        });
    });

    it('fail PUT /clocker/id', (done) => {
        chai.request(globalPath).put('/clocker/-1').end((err, res) => {
            expect(res).to.have.status(400);
            expect(res).to.be.text;
            done();
        });
    });
});
