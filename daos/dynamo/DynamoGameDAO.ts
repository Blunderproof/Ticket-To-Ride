import { Game, IGameModel, GameSchema } from '../../models/Game';
import IGameDAO from '../IGameDAO';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { GAME_TABLE_NAME } from '../../constants';
import { GameModel } from '../../models/GameModel';
import { DynamoHelpers } from './DynamoDAOHelpers';
import { getTrainCards, getDestinationCards, getRoutes } from '../../helpers';

export class DynamoGameDAO extends DynamoHelpers implements IGameDAO {
  constructor() {
    super();
  }

  findOne(query: any): Promise<GameModel | null> {
    return this.find(query).then(data => {
      return this.populateUsers(data[0]);
    });
  }

  find(query: any): Promise<GameModel[]> {
    var params = {
      TableName: GAME_TABLE_NAME,
    };

    return new Promise((yes, no) => {
      this.dbClient.scan(params, (err, data) => {
        if (err) {
          no(err);
        } else {
          let gamesRaw = this.query(data.Items!, query);
          let games: GameModel[] = [];
          for (let i = 0; i < gamesRaw.length; i++) {
            games.push(new GameModel(gamesRaw[i]));
          }
          yes(games);
        }
      });
    });
  }

  remove(data: any): Promise<void> {
    var params = {
      TableName: GAME_TABLE_NAME,
      Key: data,
    };

    return new Promise((yes, no) => {
      this.dbClient.delete(params, (err, data) => {
        if (err) {
          no(err);
        } else {
          yes();
        }
      });
    });
  }

  save(game: GameModel): Promise<GameModel> {
    return this.populateUsers(game).then(game => {
      return this.save_game(game);
    });
  }

  create(game: any): Promise<GameModel> {
    game._id = this.new_id();
    return this.save_game(game);
  }

  private populateUsers(game: GameModel): Promise<GameModel> {
    let requests = [];
    if (game && game.host) {
      requests.push(this.get_user(game.host._id!));
    }

    if (game && game.userList) {
      for (let i = 0; i < game.userList.length; i++) {
        requests.push(this.get_user(game.userList[i]._id!));
      }
    }
    return Promise.all(requests).then(users => {
      if (game && game.host) {
        game.host = users[0];
        users.shift();
      }
      if (game) game.userList = users;
      return game;
    });
  }
}
