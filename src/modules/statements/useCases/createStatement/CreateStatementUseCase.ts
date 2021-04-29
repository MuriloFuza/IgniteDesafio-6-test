import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { ICreateStatementDTO } from "./ICreateStatementDTO";


enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

@injectable()
export class CreateStatementUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ user_id, recipient_id, type, amount, description }: ICreateStatementDTO) {
    const user = await this.usersRepository.findById(user_id);

    if(!user) {
      throw new CreateStatementError.UserNotFound();
    }

    if(type === 'withdraw') {
      const { balance } = await this.statementsRepository.getUserBalance({ user_id });

      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds()
      }
    }

    if(type === 'transfer'){

      const { balance } = await this.statementsRepository.getUserBalance({user_id})

      if(balance < amount){
        throw new CreateStatementError.InsufficientFunds()
      }

      const userRecipient = await this.usersRepository.findById(recipient_id!)

      const id = userRecipient?.id; 

      const statementOperation = await this.statementsRepository.create({
        user_id: id!,
        type,
        sender_id: user.id,
        amount,
        description
      });

      const statementOperationSender = await this.statementsRepository.create({
        user_id,
        type: OperationType.WITHDRAW,
        amount,
        description
      });

      return statementOperation;
    }

    const statementOperation = await this.statementsRepository.create({
      user_id,
      type,
      amount,
      description
    });

    return statementOperation;
  }
}
