import { Message, IMessageModel } from '../models/Message';

export default interface IMessageDAO {
  find(data: any, populates: any[]): Promise<IMessageModel[]>;
  remove(data: any): Promise<void>;
  create(data: any): Promise<IMessageModel>;
  save(message: IMessageModel): Promise<IMessageModel>;
};
