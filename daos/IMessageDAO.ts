import { MessageModel } from '../models/MessageModel';

export default interface IMessageDAO {
  find(data: any, populates: any[], sort: string, gameID: string): Promise<MessageModel[]>;
  remove(data: any, gameID: string): Promise<void>;
  create(data: any, gameID: string): Promise<MessageModel>;
  save(message: MessageModel, gameID: string): Promise<MessageModel>;
}
