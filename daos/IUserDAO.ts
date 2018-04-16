import { UserModel } from '../models/UserModel';

export default interface IUserDAO {
  findOne(data: any, populates: any[]): Promise<UserModel | null>;
  remove(data: any): Promise<void>;
  create(data: any): Promise<UserModel>;
  save(user: UserModel): Promise<UserModel>;
}
