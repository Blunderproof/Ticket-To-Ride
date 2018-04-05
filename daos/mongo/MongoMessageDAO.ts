import { IMessageModel, Message } from '../../models/Message';
import IMessageDAO from '../IMessageDAO';

<<<<<<< HEAD
export class MongoMessageDAO {
  // findOne(data: any): Promise<IMessageModel | null> {
  //   // return new Promise();
  // }
  // remove(data: any): Promise<null> {
  //   // return new Promise();
  // }
=======
export class MongoMessageDAO implements IMessageDAO {
  find(data: any, populates: any[]): Promise<IMessageModel[]> {
    let query = Message.find(data);
    for (let index = 0; index < populates.length; index++) {
      const fieldName = populates[index];
      query.populate(fieldName);
    }
    return query.exec();
  }

  remove(data: any): Promise<void> {
    return Message.remove(data).exec();
  }
  create(data: any): Promise<IMessageModel> {
    return Message.create(data);
  }
  async save(message: IMessageModel): Promise<IMessageModel> {
    await Message.update({ _id: message._id }, message.getObject());

    return message;
  }
>>>>>>> 9b2e5048961360f5d5bbc9693655252df083bbf6
}
