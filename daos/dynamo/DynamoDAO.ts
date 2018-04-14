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

export class DynamoDAO implements IDAO {
  destinationCardDAO: IDestinationCardDAO;
  gameDAO: IGameDAO;
  messageDAO: IMessageDAO;
  routeDAO: IRouteDAO;
  trainCardDAO: ITrainCardDAO;
  userDAO: IUserDAO;

  db: any;

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
      region: 'us-west-2',
      endpoint: 'http://localhost:8000',
    };
    this.db = new AWS.DynamoDB(serviceConfigOptions);
    this.db.createTable({
      TableName: GAME_TABLE_NAME,
    });
    this.db.createTable({
      TableName: USER_TABLE_NAME,
    });
  }
}
