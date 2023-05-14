const request = require('supertest');
const app = require('./app');
const fs = require('fs');
const { exec } = require('child_process');


describe('POST /api/register', () => {
  beforeAll(() => {
    fs.writeFileSync('./database.db', '');
  });
  
  beforeEach(() => {
    app.listen(8001);
  });

  afterEach(async () => {
    app.close();
  });

  it('should return a list of users', async () => {
    const requestBody = { 
      username: "username2",
      firstName: "firstNameasdf",
      lastName: "lastNameasdf",
      telephone: "telephoneasdf",
      profileImage: "profileImageasdf",
      city: "cityasdf",
      province: "provinceasdf",
      country: "countryasdf"
    };
    const response = await request(app)
      .post('/api/register')
      .send({ ...requestBody, password: "password" });
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(requestBody);
  });
});

