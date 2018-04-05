import { IUserModel, User } from '../../models/User';
import IUserDAO from '../IUserDAO';

export class MongoUserDAO implements IUserDAO {
  findOne(data: any, populates: any[]): Promise<IUserModel | null> {
    let query = User.findOne(data);
    for (let index = 0; index < populates.length; index++) {
      const fieldName = populates[index];
      query.populate(fieldName);
    }
    return query.exec();
  }
  remove(data: any): Promise<void> {
    return User.remove(data).exec();
  }
  create(data: any): Promise<IUserModel> {
    return User.create(data);
  }
  async save(user: IUserModel): Promise<IUserModel> {
    await User.update({ _id: user._id }, user.getObject());

    return user;
  }
}
