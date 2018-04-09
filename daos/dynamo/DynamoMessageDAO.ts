import IMessageDAO from '../IMessageDAO';
import { IMessageModel } from '../../models/Message';

export class DynamoMessageDAO implements IMessageDAO {
  find(data: any, populates: any[], sort: string): Promise<IMessageModel[]> {
    throw new Error('Method not implemented.');
  }
  remove(data: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
  create(data: any): Promise<IMessageModel> {
    throw new Error('Method not implemented.');
  }
  save(message: IMessageModel): Promise<IMessageModel> {
    throw new Error('Method not implemented.');
  }
  constructor() {}
}
