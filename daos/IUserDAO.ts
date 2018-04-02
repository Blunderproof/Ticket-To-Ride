import { User, IUserModel } from '../models/User';

export default interface IUserDAO {
  findOne(data: any): Promise<IUserModel | null>;
  remove(data: any): Promise<null>;
};
