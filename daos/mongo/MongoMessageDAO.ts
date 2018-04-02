import { IMessageModel } from '../../models/Message';

export class MongoMessageDAO {
  findOne(data: any): Promise<IMessageModel | null> {
    return new Promise();
  }
  remove(data: any): Promise<null> {
    return new Promise();
  }
}
