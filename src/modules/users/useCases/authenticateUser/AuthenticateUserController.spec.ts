import { Connection } from "typeorm";
import createConnection from '../../../../shared/typeorm'
import { app } from "../../../../app"
import request from 'supertest'
import {v4 as uuidV4} from 'uuid';
import { hash } from "bcryptjs";

let connection: Connection
describe('Authenticate user controller', () =>{

  beforeAll(async() =>{
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash('admin', 8)

    await connection.query(
      `INSERT INTO USERS(id, name, email, password)
          values('${id}', 'supertest','usert@fin.com.br', '${password}') 
        `,
    );
  })

  afterAll(async() => {
    await connection.dropDatabase();
    await connection.close();
  })

  it('Should be able authenticate a user', async() =>{
    const responseAuthenticate = await request(app).post('/api/v1/sessions/').send({
      email: 'usert@fin.com.br',
      password: 'admin',
    });
    
    expect(responseAuthenticate.body).toHaveProperty('token');
  });
  
})