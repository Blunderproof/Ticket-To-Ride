import IGameDAO from '../IGameDAO';
import { GameModel } from '../../models/GameModel';
import { Game, IGameModel } from '../../models/Game';
import { IUserModel } from '../../models/User';
import { UserModel } from '../../models/UserModel';
import { RouteModel } from '../../models/RouteModel';
import { TrainCardModel } from '../../models/TrainCardModel';
import { DestinationCardModel } from '../../models/DestinationCardModel';

export class MongoGameDAO implements IGameDAO {
  constructor() {}

  async findOne(data: any, populates: any[]): Promise<GameModel | null> {
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

  async find(data: any, populates: any[]): Promise<GameModel[]> {
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

  remove(game: GameModel): Promise<void> {
    let cleanedData = { _id: game._id };

    return Game.remove(cleanedData).exec();
  }

  create(data: any): Promise<GameModel> {
    console.log('about to create a game in create');
    console.log('data', data);
    return Game.create(data).then((game: IGameModel | null) => {
      console.log('game from mongoose', game);
      return new GameModel(game);
    });
  }

  async save(game: GameModel): Promise<GameModel> {
    let data = this.depopulate(game);

    await Game.update({ _id: game._id }, data);

    return game;
  }

  depopulate(game: GameModel): any {
    let data: any = game.getObject();
    console.log('game after getObject', data);

    data.host = data.host._id || data.host;
    data.userList = data.userList.map((model: any) => {
      return model._id || model;
    });
    data.playersReady = data.playersReady.map((model: any) => {
      return model._id || model;
    });
    data.unclaimedRoutes = data.unclaimedRoutes.map((model: any) => {
      return model._id || model;
    });
    data.trainCardDeck = data.trainCardDeck.map((model: any) => {
      return model._id || model;
    });
    data.trainCardDiscardPile = data.trainCardDiscardPile.map((model: any) => {
      return model._id || model;
    });
    data.destinationCardDeck = data.destinationCardDeck.map((model: any) => {
      return model._id || model;
    });
    data.destinationCardDiscardPile = data.destinationCardDiscardPile.map((model: any) => {
      return model._id || model;
    });

    console.log('depopulated game', data);
    return data;
  }
}
