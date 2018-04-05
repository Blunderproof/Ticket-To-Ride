import { User, IUserModel } from '../models/User';

export default interface IUserDAO {
  findOne(data: any, populates: any[]): Promise<IUserModel | null>;
  remove(data: any): Promise<void>;
  create(data: any): Promise<IUserModel>;
  save(user: IUserModel): Promise<IUserModel>;
};
