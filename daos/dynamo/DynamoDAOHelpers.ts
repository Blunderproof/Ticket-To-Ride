import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import * as AWS from 'aws-sdk';
import { GAME_TABLE_NAME } from '../../constants';
import { GameModel } from '../../models/GameModel';
import { ConfigurationOptions } from 'aws-sdk/lib/config';

export class DynamoHelpers {
  dbClient: DocumentClient;
  constructor() {
    let config: ConfigurationOptions = {
      region: 'us-east-1',
    };

    AWS.config.update(config);

    this.dbClient = new AWS.DynamoDB.DocumentClient({
      endpoint: 'http://localhost:8000',
    });
  }

  public get_game(gameID: string): Promise<GameModel> {
    var params = {
      TableName: GAME_TABLE_NAME,
    };

    return new Promise((yes, no) => {
      this.dbClient.scan(params, (err, data) => {
        console.log(gameID, data);
        if (err) {
          no(err);
        } else {
          let gamesRaw = this.query(data.Items!, { _id: gameID });
          let games: GameModel[] = [];
          for (let i = 0; i < gamesRaw.length; i++) {
            games.push(new GameModel(gamesRaw[i]));
          }
          yes(games[0]);
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
          yes(new GameModel(game));
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
    if (instance && typeof instance === 'object' && (query && typeof query === 'object')) {
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
    } else if (Array.isArray(instance)) {
      return instance.indexOf(query) >= 0;
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
