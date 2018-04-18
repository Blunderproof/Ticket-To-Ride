import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import * as AWS from 'aws-sdk';
import { GAME_TABLE_NAME } from '../../constants';
import { GameModel } from '../../models/GameModel';

export class DynamoHelpers {
  dbClient: DocumentClient;
  constructor() {
    this.dbClient = new AWS.DynamoDB.DocumentClient();
  }

  public get_game(gameID: string): Promise<GameModel> {
    var params = {
      TableName: GAME_TABLE_NAME,
      Key: {
        _id: gameID,
      },
      Limit: 1,
    };

    return new Promise((yes, no) => {
      this.dbClient.get(params, function(err, data) {
        if (err) {
          no(err);
        } else {
          yes(new GameModel(data.Item));
        }
      });
    });
  }

  public save_game(game: any): Promise<GameModel> {
    let params = {
      Item: game,
      TableName: GAME_TABLE_NAME,
    };

    return new Promise((yes, no) => {
      this.dbClient.put(params, (err, data) => {
        if (err) {
          no(err);
        } else {
          yes(new GameModel(data.Attributes));
        }
      });
    });
  }

  public new_id() {
    return (
      '_' +
      Math.random()
        .toString(36)
        .substring(2) +
      Math.random()
        .toString(36)
        .substring(2)
    );
  }

  public query(data: any[], query: any): any[] {
    let matched = [];
    if (data) {
      for (let i = 0; i < data.length; i++) {
        if (this.compare(data[i], query)) {
          matched.push(data[i]);
        }
      }
    }
    return matched;
  }

  public compare(instance: any, query: any) {
    if (typeof instance === 'object') {
      let keys = Object.keys(query);

      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (key === '$or') {
          if (!this.compare_or(instance, query[key])) return false;
        } else if (key == '$ne') {
          if (instance !== query[key]) return false;
        } else {
          if (!this.compare(instance[key], query[key])) return false;
        }
      }
      return true;
    } else {
      return instance === query;
    }
  }

  private compare_or(instance: any, queries: any[]) {
    for (let i = 0; i < queries.length; i++) {
      if (this.compare(instance, queries[i])) return true;
    }
    return false;
  }
}
