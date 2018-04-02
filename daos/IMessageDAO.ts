import { Message, IMessageModel } from '../models/Message';

export default interface IMessageDAO {
  find(data: any): Promise<IMessageModel[]>;
  remove(data: any): Promise<null>;
};
