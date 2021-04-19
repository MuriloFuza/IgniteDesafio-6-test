import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase
let userRepositoryInMemory: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe('Show profile by user', () =>{
  beforeEach(() =>{
    userRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(userRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  })

  it('Should be able show profile by user', async() =>{
    const user = await createUserUseCase.execute({
      name: 'test',
      email: 'test@gmail.com',
      password: '1234'
    });

    const id = user.id;

    const resultFind = await showUserProfileUseCase.execute(id!);

    expect(resultFind).toHaveProperty('id');
  });

  it('Do not should be able show profile by user if not existent', async() =>{

    expect(async () =>{
      const id = '123';

      await showUserProfileUseCase.execute(id!);
    }).rejects.toBeInstanceOf(AppError)
  });
})