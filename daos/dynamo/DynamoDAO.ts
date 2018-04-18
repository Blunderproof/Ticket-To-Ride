import IDestinationCardDAO from '../IDestinationCardDAO';
import IMessageDAO from '../IMessageDAO';
import IRouteDAO from '../IRouteDAO';
import ITrainCardDAO from '../ITrainCardDAO';
import IUserDAO from '../IUserDAO';
import IGameDAO from '../IGameDAO';
import IDAO from '../IDAO';

import * as AWS from 'aws-sdk';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import { DB_NAME, GAME_TABLE_NAME, USER_TABLE_NAME } from '../../constants';
import { DynamoDestinationCardDAO } from './DynamoDestinationCardDAO';
import { DynamoGameDAO } from './DynamoGameDAO';
import { DynamoMessageDAO } from './DynamoMessageDAO';
import { DynamoRouteDAO } from './DynamoRouteDAO';
import { DynamoTrainCardDAO } from './DynamoTrainCardDAO';
import { DynamoUserDAO } from './DynamoUserDAO';
import { DynamoDB } from 'aws-sdk';
import { CreateTableInput } from 'aws-sdk/clients/dynamodb';

// java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb

export class DynamoDAO implements IDAO {
  destinationCardDAO: IDestinationCardDAO;
  gameDAO: IGameDAO;
  messageDAO: IMessageDAO;
  routeDAO: IRouteDAO;
  trainCardDAO: ITrainCardDAO;
  userDAO: IUserDAO;

  db?: DynamoDB;

  constructor() {
    this.destinationCardDAO = new DynamoDestinationCardDAO();
    this.gameDAO = new DynamoGameDAO();
    this.messageDAO = new DynamoMessageDAO();
    this.routeDAO = new DynamoRouteDAO();
    this.trainCardDAO = new DynamoTrainCardDAO();
    this.userDAO = new DynamoUserDAO();
    this.initialize();
  }

  initialize(): void {
    let serviceConfigOptions: ServiceConfigurationOptions = {
      region: 'us-east-1',
      endpoint: 'http://localhost:8000',
    };
    this.db = new AWS.DynamoDB(serviceConfigOptions);
    let game_table: CreateTableInput = {
      TableName: GAME_TABLE_NAME,
      KeySchema: [{ AttributeName: '_id', KeyType: 'HASH' }],
      AttributeDefinitions: [{ AttributeName: '_id', AttributeType: 'S' }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    };
    let user_table: CreateTableInput = {
      TableName: USER_TABLE_NAME,
      KeySchema: [{ AttributeName: '_id', KeyType: 'HASH' }],
      AttributeDefinitions: [{ AttributeName: '_id', AttributeType: 'S' }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    };

    this.db.createTable(game_table, (err, data) => {
      if (!err) console.log('game table created');
    });
    this.db.createTable(user_table, (err, data) => {
      if (!err) console.log('user table created');
    });
  }
}

let DAO = new DynamoDAO();
export { DAO };
