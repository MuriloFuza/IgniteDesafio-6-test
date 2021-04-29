import { Statement } from "../../entities/Statement";

export type ICreateStatementDTO =
Pick<
  Statement,
  'user_id' |
  'recipient_id' |
  'description' |
  'amount' |
  'sender_id' |
  'type'
>
