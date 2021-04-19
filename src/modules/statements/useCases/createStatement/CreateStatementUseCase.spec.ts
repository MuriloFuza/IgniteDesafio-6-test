import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let statementRepository: InMemoryStatementsRepository
let userRepository: InMemoryUsersRepository
let createStatementUseCase: CreateStatementUseCase
let createUserUseCase: CreateUserUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Create Statement', () =>{
    beforeEach(() =>{
      statementRepository = new InMemoryStatementsRepository();
      userRepository = new InMemoryUsersRepository();
      createUserUseCase = new CreateUserUseCase(userRepository);
      createStatementUseCase = new  CreateStatementUseCase(userRepository, statementRepository);
    })

    it('Should be able create a new statement like type deposit', async() =>{

      const user = await createUserUseCase.execute({
        name: 'test',
        email: 'test@gmail.com',
        password: '1234'
      })

      const statement = await createStatementUseCase.execute({
        user_id: user.id!,
        type: OperationType.DEPOSIT, 
        amount: 100, 
        description: 'deposit ',
      })

      expect(statement).toHaveProperty('id');
    });


    it('Should be able create a new statement like type withdraw', async() =>{

      const user = await createUserUseCase.execute({
        name: 'test',
        email: 'test@gmail.com',
        password: '1234'
      })

      await createStatementUseCase.execute({
        user_id: user.id!,
        type: OperationType.DEPOSIT, 
        amount: 200, 
        description: 'deposit ',
      })

      const statement = await createStatementUseCase.execute({
        user_id: user.id!,
        type: OperationType.WITHDRAW, 
        amount: 100, 
        description: 'withdraw ',
      });

      expect(statement).toHaveProperty('id');
    });

    it('Do not should be able create a new deposit to user not existent', async() =>{

      expect(async() =>{
        const user_id = '123';

        await createStatementUseCase.execute({
          user_id: user_id,
          type: OperationType.DEPOSIT, 
          amount: 200, 
          description: 'deposit ',
        });
      }).rejects.toBeInstanceOf(AppError);
    });

    it('Do not should be able create a new withdraw to user not existent', async() =>{

      expect(async() =>{
        const user_id = '123';

        await createStatementUseCase.execute({
          user_id: user_id,
          type: OperationType.WITHDRAW, 
          amount: 200, 
          description: 'withdraw ',
        });
      }).rejects.toBeInstanceOf(AppError);
    });
})