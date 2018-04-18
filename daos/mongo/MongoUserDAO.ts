import { User, IUserModel } from '../../models/User';
import IUserDAO from '../IUserDAO';
import { UserModel } from '../../models/UserModel';

export class MongoUserDAO implements IUserDAO {
  async findOne(data: any, populates: any[]): Promise<UserModel | null> {
    let query = User.findOne(data);
    for (let index = 0; index < populates.length; index++) {
      const fieldName = populates[index];
      await query.populate(fieldName);
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
    let data = this.depopulate(user);
    await User.update({ _id: user._id }, data);

    return user;
  }

  depopulate(game: UserModel): any {
    let data: any = game.getObject();

    data.claimedRouteList = data.claimedRouteList.map((model: any) => {
      return model._id || model;
    });
    data.trainCardHand = data.trainCardHand.map((model: any) => {
      return model._id || model;
    });
    data.destinationCardHand = data.destinationCardHand.map((model: any) => {
      return model._id || model;
    });
    data.metDestinationCards = data.metDestinationCards.map((model: any) => {
      return model._id || model;
    });
    data.unmetDestinationCards = data.unmetDestinationCards.map((model: any) => {
      return model._id || model;
    });

    return data;
  }
}
