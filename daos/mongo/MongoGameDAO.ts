import { Game, IGameModel, GameSchema } from '../../models/Game';
import IGameDAO from '../IGameDAO';

export class MongoGameDAO implements IGameDAO {
  constructor() {}

  findOne(data: any, populates: any[]): Promise<IGameModel | null> {
    let query = Game.findOne(data);
    for (let index = 0; index < populates.length; index++) {
      const fieldName = populates[index];
      query.populate(fieldName);
    }
    return query.exec();
  }
  find(data: any, populates: any[]): Promise<IGameModel[]> {
    let query = Game.find(data);
    for (let index = 0; index < populates.length; index++) {
      const fieldName = populates[index];
      query.populate(fieldName);
    }
    return query.exec();
  }
  remove(data: any): Promise<void> {
    return Game.remove(data).exec();
  }
  create(data: any): Promise<IGameModel> {
    return Game.create(data);
  }

  async save(game: IGameModel): Promise<IGameModel> {
    await Game.update({ _id: game._id }, game.getObject());

    return game;
  }
}
