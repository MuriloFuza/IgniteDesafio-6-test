import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetBalanceUseCase } from "./GetBalanceUseCase"



let statementRepository: InMemoryStatementsRepository
let usersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase
let getBalanceUseCase: GetBalanceUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

interface IRequest {
  user_id: string;
}

describe('Get Balance', () =>{
  beforeEach(async () =>{
    statementRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementRepository);
    getBalanceUseCase = new GetBalanceUseCase(statementRepository,usersRepository);
  });

  it('Should be able get all statements by user', async() => {

    const user = await createUserUseCase.execute({
      name: 'test',
      email: 'test@gmail.com',
      password: '1234'
    });

    await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.DEPOSIT, 
      amount: 300, 
      description: 'deposit ',
    });

    await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.WITHDRAW, 
      amount: 100, 
      description: 'withdraw ',
    });

    const userStatements = await getBalanceUseCase.execute({
      user_id: user.id!
    });

    expect(userStatements).toHaveProperty('statement');
    expect(userStatements).toHaveProperty('balance');
    expect(userStatements.statement.length).toBe(2);
    expect(userStatements.balance).toBe(200);
  });

  it('Do not should be able get all statements if user not existent', async() => {
   
    expect(async() => {
      const id = '123';

      const userStatements = await getBalanceUseCase.execute({
        user_id: id
      });
    }).rejects.toBeInstanceOf(AppError);
  });
})