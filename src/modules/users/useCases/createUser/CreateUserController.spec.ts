import { app } from "../../../../app"
import request from 'supertest'
import { Connection } from "typeorm"
import createConnection from '../../../../shared/typeorm'

let connection: Connection
describe('CreateUserController test', () =>{

  beforeAll(async() =>{
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async() => {
    await connection.dropDatabase();
    await connection.close();
  })
  
  it('Should be able create a new user', async() => {
    const response = await request(app).post('/api/v1/users/').send({
      name: 'usersupertest',
      email: 'usersupertest@gmail.com',
      password: '1234'
    });

    expect(response.status).toBe(201);
  });

  it('Do not should be able create a new user if email already exists', async() => {
    const response = await request(app).post('/api/v1/users/').send({
      name: 'usersupertest',
      email: 'usersupertest@gmail.com',
      password: '1234'
    });

    expect(response.status).toBe(400);
  });
})