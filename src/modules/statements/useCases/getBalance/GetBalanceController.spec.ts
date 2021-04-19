import { Connection } from "typeorm";
import createConnection from '../../../../shared/typeorm'
import { app } from "../../../../app"
import request from 'supertest'
import {v4 as uuidV4} from 'uuid';
import { hash } from "bcryptjs";

let connection: Connection

describe('Create getBallance controller', () => {

  const id = uuidV4();
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

  it('Should be able get all statements by user', async() =>{

    const responseAuthenticate = await request(app).post('/api/v1/sessions/').send({
      email: 'usert@fin.com.br',
      password: 'admin',
    });

    const {token} = responseAuthenticate.body;

    const response = await request(app).get('/api/v1/statements/balance').send({
      user_id: id
    }).set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('statement');
    expect(response.body).toHaveProperty('balance');
  });
})