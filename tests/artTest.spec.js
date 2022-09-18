const server = require('../index');
const request = require('supertest');
const chai = require('chai');
const {assert} = chai;

describe('Query art tests', () => {
    it('Query art by ID with bad ID value', async () => {
        let response = await request(server).get('/api/art/testID');
        assert.equal(response.status, 400);
    });
});

describe('Add comments on art with bad values', () => {
    it('Add comment with bad art ID', async () => {
        let testRequest = {
            userId: 99,
            name: "Test name",
            content: "Test content"
        }
        let response = await request(server).post('/api/art/badID/comments').send(testRequest);
        assert.equal(response.status, 400);
    });

    it('Add comment with no user ID or name', async () => {
        let testRequest = {
            content: "Test content'"
        }
        let response = await request(server).post('/api/art/1234/comments').send(testRequest);
        assert.equal(response.status, 400);
    })
});
