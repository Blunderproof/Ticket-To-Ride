import { Game, IGameModel, GameSchema } from '../../models/Game';
import { IGameDAO } from '../IGameDAO';
import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export class DynamoGameDAO implements IGameDAO {
  dbClient: DocumentClient;

  constructor() {
    this.dbClient = new AWS.DynamoDB.DocumentClient();
  }

  findOne(data: any): Promise<IGameModel | null> {
    throw new Error('Method not implemented.');
  }
  find(data: any): Promise<IGameModel[]> {
    throw new Error('Method not implemented.');
  }
  remove(data: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
  save(data: any): Promise<void> {
    return new Promise((yes, no) => {
      this.dbClient.put({
        TableName: 'something',
        Item: data,
      });
    });
  }
}
