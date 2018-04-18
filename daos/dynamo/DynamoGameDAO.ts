import { Game, IGameModel, GameSchema } from '../../models/Game';
import IGameDAO from '../IGameDAO';
import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { GAME_TABLE_NAME } from '../../constants';
import { GameModel } from '../../models/GameModel';
import { DynamoHelpers } from './DynamoDAOHelpers';
import { getTrainCards, getDestinationCards } from '../../helpers';

export class DynamoGameDAO extends DynamoHelpers implements IGameDAO {
  dbClient: DocumentClient;

  constructor() {
    super();
    this.dbClient = new AWS.DynamoDB.DocumentClient();
  }

  findOne(query: any): Promise<GameModel | null> {
    var params = {
      TableName: GAME_TABLE_NAME,
      Key: query,
      Limit: 1,
    };

    return new Promise((yes, no) => {
      this.dbClient.get(params, function(err, data) {
        if (err) {
          no(err);
        } else {
          yes(new GameModel(data));
        }
      });
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
    return this.save_game(game);
  }

  create(game: any): Promise<GameModel> {
    game.destinationCardDeck = getDestinationCards();
    game.trainCardDeck = getTrainCards();
    game._id = this.new_id();
    return this.save_game(game);
  }
}
