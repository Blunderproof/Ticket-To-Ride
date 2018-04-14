import { Game, IGameModel, GameSchema } from '../../models/Game';
import IGameDAO from '../IGameDAO';
import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { GAME_TABLE_NAME } from '../../constants';

export class DynamoGameDAO implements IGameDAO {
  dbClient: DocumentClient;

  constructor() {
    this.dbClient = new AWS.DynamoDB.DocumentClient();
  }

  findOne(data: any): Promise<IGameModel | null> {
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
          yes(data);
        }
      });
    });
  }
  find(data: any): Promise<IGameModel[]> {
    var params = {
      TableName: GAME_TABLE_NAME,
      Key: data,
    };

    return new Promise((yes, no) => {
      this.dbClient.get(params, function(err, data) {
        if (err) {
          no(err);
        } else {
          yes(data);
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
          yes(data);
        }
      });
    });
  }
  save(game: IGameModel): Promise<IGameModel> {
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
            yes(data);
          }
        }
      );
    });
  }
  create(data: any): Promise<IGameModel> {
    //load cards from csv
    //create game

    return this.save;
  }
}
