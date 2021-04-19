import { Connection } from "typeorm";
import createConnection from '../../../../shared/typeorm'
import { app } from "../../../../app"
import request from 'supertest'
import {v4 as uuidV4} from 'uuid';
import { hash } from "bcryptjs";

let connection: Connection
describe('Create GetOperation controller', () =>{
  const user_id = uuidV4();
  beforeAll(async() =>{
    connection = await createConnection();
    await connection.runMigrations();

 
    const password = await hash('admin', 8)

    await connection.query(
      `INSERT INTO USERS(id, name, email, password)
          values('${user_id}', 'supertest','usert@fin.com.br', '${password}') 
        `,
    );
  });

  afterAll(async() => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able get specific operation by id', async() => {

    const responseAuthenticate = await request(app).post('/api/v1/sessions/').send({
      email: 'usert@fin.com.br',
      password: 'admin',
    });

    const {token} = responseAuthenticate.body;

    const statementResult = await request(app).post('/api/v1/statements/deposit').send({
      user_id: user_id,
      type: 'deposit',
      amount: 200,
      description: 'deposit money'
    }).set({
      Authorization: `Bearer ${token}`
    })

    const {user_id: resultUserId, id} = statementResult.body;

    const response = await request(app).get(`/api/v1/statements/${id}`).send({
      user_id: resultUserId,
    }).set({
      Authorization: `Bearer ${token}`,
    })

    expect(response.status).toBe(200);
    
  })
})