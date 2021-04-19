import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

let statementRepository: InMemoryStatementsRepository
let usersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase
let getStatementOperationUseCase: GetStatementOperationUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

interface IRequest {
  user_id: string;
  statement_id: string;
}

describe('Get Operation', () =>{
  beforeEach(async () =>{
    statementRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementRepository);
  });

  it('Should be able get specific operation by id', async() =>{
    const user = await createUserUseCase.execute({
      name: 'test',
      email: 'test@gmail.com',
      password: '1234'
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.DEPOSIT, 
      amount: 300, 
      description: 'deposit ',
    });

    const resultOperation = await getStatementOperationUseCase.execute({
      user_id: user.id!,
      statement_id: statement.id!
    });
    console.log(resultOperation);
    expect(resultOperation).toHaveProperty('id');
  });

  it('Do not should be able get all statements if user not existent', async() => {
   
    expect(async() => {
      const id = '123';
      const stId = '222'
      

      const userStatements = await getStatementOperationUseCase.execute({
        user_id: id,
        statement_id: stId
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('Do not should be able get all statements if statement not existent', async() => {
   
    expect(async() => {
      const user = await createUserUseCase.execute({
        name: 'test',
        email: 'test@gmail.com',
        password: '1234'
      });

      const stId = '222'
      

      const userStatements = await getStatementOperationUseCase.execute({
        user_id: user.id!,
        statement_id: stId
      });
    }).rejects.toBeInstanceOf(AppError);
  });
})