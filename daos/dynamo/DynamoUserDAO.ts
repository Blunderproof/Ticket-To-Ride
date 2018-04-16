import IUserDAO from '../IUserDAO';
import { IUserModel } from '../../models/User';

export class DynamoUserDAO implements IUserDAO {
  findOne(data: any, populates: any[]): Promise<IUserModel | null> {
    throw new Error('Method not implemented.');
  }
  remove(data: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
  create(data: any): Promise<IUserModel> {
    throw new Error('Method not implemented.');
  }
  save(user: IUserModel): Promise<IUserModel> {
    throw new Error('Method not implemented.');
  }
  constructor() {}
}
