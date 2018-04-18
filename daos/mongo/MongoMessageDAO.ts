import { IMessageModel, Message } from '../../models/Message';
import IMessageDAO from '../IMessageDAO';
import { MessageModel } from '../../models/MessageModel';

export class MongoMessageDAO implements IMessageDAO {
  async find(data: any, populates: any[], sort: string, gameID: string): Promise<MessageModel[]> {
    let query = Message.find(data);
    for (let index = 0; index < populates.length; index++) {
      const fieldName = populates[index];
      await query.populate(fieldName);
    }
    query.sort(sort);
    return query.exec().then((messages: IMessageModel[]) => {
      let messageModels: MessageModel[] = [];
      messages.forEach((message: IMessageModel) => {
        messageModels.push(new MessageModel(message));
      });
      return messageModels;
    });
  }

  remove(data: any, gameID: string): Promise<void> {
    return Message.remove(data).exec();
  }
  create(data: any, gameID: string): Promise<MessageModel> {
    return Message.create(data).then((message: IMessageModel | null) => {
      return new MessageModel(message);
    });
  }
  async save(message: MessageModel, gameID: string): Promise<MessageModel> {
    await Message.update({ _id: message._id }, message.getObject());

    return message;
  }
}
