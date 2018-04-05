import { Game, IGameModel, GameSchema } from '../../models/Game';

export class MongoGameDAO {
  findOne(data: any): Promise<IGameModel | null> {
    return Game.findOne(data).exec();
  }
  find(data: any): Promise<IGameModel[]> {
    return Game.find(data).exec();
  }
  remove(data: any): Promise<void> {
    return Game.remove(data).exec();
  }

  saveGame(game: IGameModel): Promise<IGameModel> {
    return game.save();
  }
}
