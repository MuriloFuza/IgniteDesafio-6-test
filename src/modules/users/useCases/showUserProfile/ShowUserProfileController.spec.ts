import { Connection } from "typeorm";
import createConnection from '../../../../shared/typeorm'
import { app } from "../../../../app"
import request from 'supertest';
import {v4 as uuidV4} from 'uuid';
import { hash } from "bcryptjs";


let connection: Connection

describe('Show user profile controller', () => {

  const id = uuidV4();

  beforeAll(async() =>{
    connection = await createConnection();
    await connection.runMigrations();


    const password = await hash('admin', 8)

    await connection.query(
      `INSERT INTO USERS(id, name, email, password)
          values('${id}', 'supertest','user@fina.com.br', '${password}') 
        `,
    );
  });

  afterAll(async() => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able show a profile of user', async() => {  

    const responseAuthenticate = await request(app).post('/api/v1/sessions/').send({
      email: 'user@fina.com.br',
      password: 'admin',
    });

    const {token} = responseAuthenticate.body;

    const responseProfile = await request(app).get('/api/v1/profile/').send({
      user_id: id
    }).set({
      Authorization: `Bearer ${token}`
    })
  
    expect(responseProfile.status).toBe(200);
    expect(responseProfile.body).toHaveProperty('id');
  });
})