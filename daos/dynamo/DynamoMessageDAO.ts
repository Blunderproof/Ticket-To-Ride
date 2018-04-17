import IMessageDAO from '../IMessageDAO';
import { IMessageModel } from '../../models/Message';
import { MessageModel } from '../../models/MessageModel';
import { DynamoHelpers } from './DynamoDAOHelpers';

export class DynamoMessageDAO extends DynamoHelpers implements IMessageDAO {
  constructor() {
    super();
  }

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
}
