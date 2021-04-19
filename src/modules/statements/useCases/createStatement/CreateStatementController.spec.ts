import { Connection } from "typeorm";
import createConnection from '../../../../shared/typeorm'
import { app } from "../../../../app"
import request from 'supertest'
import {v4 as uuidV4} from 'uuid';
import { hash } from "bcryptjs";

let connection: Connection
describe('Create statement controller', () => {
  const id = uuidV4();
  const idFalse = uuidV4();
  beforeAll(async() =>{
    connection = await createConnection();
    await connection.runMigrations();

 
    const password = await hash('admin', 8)

    await connection.query(
      `INSERT INTO USERS(id, name, email, password)
          values('${id}', 'supertest','usert@fin.com.br', '${password}') 
        `,
    );
  });

  afterAll(async() => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able create a new statement like type deposit', async() => {

    const responseAuthenticate = await request(app).post('/api/v1/sessions/').send({
      email: 'usert@fin.com.br',
      password: 'admin',
    });

    const {token} = responseAuthenticate.body;

    const response = await request(app).post('/api/v1/statements/deposit').send({
      user_id: id,
      type: 'deposit',
      amount: 200,
      description: 'deposit money'
    }).set({
      Authorization: `Bearer ${token}`
    })

    expect(response.body).toHaveProperty('id');
    expect(response.status).toBe(201);
  });

  it('Should be able create a new statement like type withdraw', async() => {

    const responseAuthenticate = await request(app).post('/api/v1/sessions/').send({
      email: 'usert@fin.com.br',
      password: 'admin',
    });

    const {token} = responseAuthenticate.body;

    const response = await request(app).post('/api/v1/statements/withdraw').send({
      user_id: id,
      type: 'withdraw',
      amount: 100,
      description: 'withdraw money'
    }).set({
      Authorization: `Bearer ${token}`
    })

    expect(response.body).toHaveProperty('id');
    expect(response.status).toBe(201);
  });
})