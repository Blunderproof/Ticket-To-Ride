import IUserDAO from '../IUserDAO';
import { IUserModel } from '../../models/User';

export class DynamoUserDAO implements IUserDAO {
  findOne(data: any, populates: any[]): Promise<UserModel | null> {
    throw new Error('Method not implemented.');
  }
  remove(data: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
  create(data: any): Promise<UserModel> {
    throw new Error('Method not implemented.');
  }
  save(user: UserModel): Promise<UserModel> {
    throw new Error('Method not implemented.');
  }
  constructor() {}
}
