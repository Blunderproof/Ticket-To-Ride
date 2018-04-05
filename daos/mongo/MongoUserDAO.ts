import { IUserModel, User } from '../../models/User';
import IUserDAO from '../IUserDAO';

<<<<<<< HEAD
export class MongoUserDAO {
  // find(data: any): Promise<IUserModel[]> {
  //   return new Promise();
  // }
  // remove(data: any): Promise<null> {
  //   return new Promise();
  // }
=======
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
>>>>>>> 9b2e5048961360f5d5bbc9693655252df083bbf6
}
