const request = require('supertest');
const app = require('./app');
const fs = require('fs');
const { exec } = require('child_process');
const dbReset = require('./dbreset');

describe('POST /api/profile', () => {
  let requestBody;
  beforeAll(async () => {
    fs.writeFileSync('./database.db', '');
    requestBody = { 
      username: "username1",
      password: "password",
      firstName: "firstNameasdf",
      lastName: "lastNameasdf",
      telephone: "telephoneasdf",
      profileImage: "profileImageasdf",
      city: "cityasdf",
      address: "addressasdf",
      province: "provinceasdf",
      country: "countryasdf"
    };
    const user = await request(app)
      .post('/api/register')
      .send({ ...requestBody });
  });

  beforeEach(() => {
    app.listen(8002);
  });
  
  afterEach(async () => {
    app.close();
  });

  it('should return 200 user profile', async () => {
    
    const responseToken = await request(app)
      .post('/api/api/token')
      .send({ username: 'username1', password: 'password' });

    const authToken = responseToken.body.token;

    const response = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${authToken}`)

    expect(response.status).toBe(200);
    const respo = { ...response.body[0], password: "password" };
    expect(respo).toMatchObject(requestBody);
  });

  it('should return 401 if no authorization', async () => {
    const responseToken = await request(app)
      .post('/api/api/token')
      .send({ username: 'username1', password: 'password' });

    const authToken = responseToken.body.token;

    const response = await request(app)
      .get('/api/profile')

    expect(response.status).toBe(401);
  });
});