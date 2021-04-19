import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";


let usersRepositoryInMemory: InMemoryUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase

describe('Authenticate user', () =>{
  beforeEach(() =>{
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  })

  it('Should be able authenticate a user', async () =>{
    const user: ICreateUserDTO = {
      name: 'test',
      email: 'test@gmail.com',
      password: '1234'
    }

    await createUserUseCase.execute(user);

    const authenticate = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    expect(authenticate).toHaveProperty('token');
  });

  it('Do not should be able authenticate a user not existent', async() =>{
    expect(async () => {

      const authenticate = await authenticateUserUseCase.execute({
        email: 'testerro@gmail.com',
        password: '1111'
      })

    }).rejects.toBeInstanceOf(AppError);
  });

  it('Do not should be able authenticate a user with the password incorrect', async() =>{
    expect(async () => {

      const user: ICreateUserDTO = {
        name: 'testpassword',
        email: 'testpassword@gmail.com',
        password: '1234'
      }
  
      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: '1111'
      })

    }).rejects.toBeInstanceOf(AppError);
  });
})  
