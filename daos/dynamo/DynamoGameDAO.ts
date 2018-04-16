import { Game, IGameModel, GameSchema } from '../../models/Game';
import IGameDAO from '../IGameDAO';
import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { GAME_TABLE_NAME } from '../../constants';
import { GameModel } from '../../models/GameModel';

export class DynamoGameDAO implements IGameDAO {
  dbClient: DocumentClient;

  constructor() {
    this.dbClient = new AWS.DynamoDB.DocumentClient();
  }

  findOne(data: any): Promise<GameModel | null> {
    var params = {
      TableName: GAME_TABLE_NAME,
      Key: data,
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
  find(data: any): Promise<GameModel[]> {
    var params = {
      TableName: GAME_TABLE_NAME,
      Key: data,
    };

    return new Promise((yes, no) => {
      this.dbClient.get(params, function(err, data) {
        if (err) {
          no(err);
        } else {
          let games: GameModel[] = [];
          for (let i = 0; i < data.length; i++) {
            games.push(new GameModel(data));
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
      this.dbClient.delete(params, function(err, data) {
        if (err) {
          no(err);
        } else {
          yes();
        }
      });
    });
  }
  save(game: GameModel): Promise<GameModel> {
    return new Promise((yes, no) => {
      this.dbClient.put(
        {
          TableName: GAME_TABLE_NAME,
          Item: game,
        },
        function(err, data) {
          if (err) {
            no(err);
          } else {
            yes(new GameModel(data));
          }
        }
      );
    });
  }
  create(data: any): Promise<GameModel> {
    //load cards from csv
    //create game

    return this.save(data);
  }
}
