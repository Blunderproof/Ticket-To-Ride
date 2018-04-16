import { MessageModel } from '../models/MessageModel';

export default interface IMessageDAO {
  find(data: any, populates: any[], sort: string): Promise<MessageModel[]>;
  remove(data: any): Promise<void>;
  create(data: any): Promise<MessageModel>;
  save(message: MessageModel): Promise<MessageModel>;
}
