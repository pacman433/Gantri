const server = require('../index');
const request = require('supertest');
const chai = require('chai');
const {assert} = chai;

describe('Create user test', () => {
    it('create user test no name', async () => {
        let userRequest = {
            age: 100,
            location: "test location"
        }
        let response = await request(server).post("/api/users").send(userRequest);
        assert.equal(response.status, 400);
    });

    it('create user test no age', async () => {
        let userRequest = {
            name: "Justin",
            location: "Test location"
        }
        let response = await request(server).post("/api/users").send(userRequest);
        assert.equal(response.status, 400);
    });

    it('create user test no location', async () => {
        let userRequest = {
            name: "Justin",
            age: 100
        }
        let response = await request(server).post("/api/users").send(userRequest);
        assert.equal(response.status, 400);
    });
});
