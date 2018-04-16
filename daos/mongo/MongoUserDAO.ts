import { User, IUserModel } from '../../models/User';
import IUserDAO from '../IUserDAO';
import { UserModel } from '../../models/UserModel';

export class MongoUserDAO implements IUserDAO {
  findOne(data: any, populates: any[]): Promise<UserModel | null> {
    let query = User.findOne(data);
    for (let index = 0; index < populates.length; index++) {
      const fieldName = populates[index];
      query.populate(fieldName);
    }
    return query.exec().then((user: IUserModel | null) => {
      if (user == null) return null;
      return new UserModel(user);
    });
  }
  remove(data: any): Promise<void> {
    return User.remove(data).exec();
  }
  create(data: any): Promise<UserModel> {
    return User.create(data).then((newUser: IUserModel) => {
      return new UserModel(newUser);
    });
  }
  async save(user: UserModel): Promise<UserModel> {
    await User.update({ _id: user._id }, user.getObject());

    return user;
  }
}
