import IGameDAO from '../IGameDAO';
import { GameModel } from '../../models/GameModel';
import { Game, IGameModel } from '../../models/Game';

export class MongoGameDAO implements IGameDAO {
  constructor() {}

  findOne(data: any, populates: any[]): Promise<GameModel | null> {
    let query = Game.findOne(data);
    for (let index = 0; index < populates.length; index++) {
      const fieldName = populates[index];
      query.populate(fieldName);
    }
    return query.exec().then((game: IGameModel | null) => {
      if (game == null) return null;
      return new GameModel(game);
    });
  }
  find(data: any, populates: any[]): Promise<GameModel[]> {
    let query = Game.find(data);
    for (let index = 0; index < populates.length; index++) {
      const fieldName = populates[index];
      query.populate(fieldName);
    }
    return query.exec().then((games: IGameModel[]) => {
      let gameModels: GameModel[] = [];
      games.forEach((game: IGameModel) => {
        gameModels.push(new GameModel(game));
      });
      return gameModels;
    });
  }
  remove(data: any): Promise<void> {
    return Game.remove(data).exec();
  }
  create(data: any): Promise<GameModel> {
    return Game.create(data).then((game: IGameModel | null) => {
      return new GameModel(game);
    });
  }

  async save(game: GameModel): Promise<GameModel> {
    await Game.update({ _id: game._id }, game.getObject());

    return game;
  }
}
