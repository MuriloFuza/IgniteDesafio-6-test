import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "./CreateUserUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe('Create User', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  })

  it('Should be able create a new user', async () => {
    const user = await createUserUseCase.execute({
      name: 'test',
      email: 'test@gmail.com',
      password: '1234'
    });

    expect(user).toHaveProperty('id');
  })

  it('Do not should be able create a new user if email by user already exists', async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: 'test',
        email: 'test@gmail.com',
        password: '1234'
      });
  
      const user = await createUserUseCase.execute({
        name: 'test',
        email: 'test@gmail.com',
        password: '1234'
      });
    }).rejects.toBeInstanceOf(AppError);
  })
})