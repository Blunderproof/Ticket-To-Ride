import IMessageDAO from '../IMessageDAO';
import { IMessageModel } from '../../models/Message';
import { MessageModel } from '../../models/MessageModel';

export class DynamoMessageDAO implements IMessageDAO {
  find(data: any, populates: any[], sort: string): Promise<MessageModel[]> {
    throw new Error('Method not implemented.');
  }
  remove(data: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
  create(data: any): Promise<MessageModel> {
    throw new Error('Method not implemented.');
  }
  save(message: MessageModel): Promise<MessageModel> {
    throw new Error('Method not implemented.');
  }
  constructor() {}
}
