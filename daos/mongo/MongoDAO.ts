import IDestinationCardDAO from '../IDestinationCardDAO';
import IGameDAO from '../IGameDAO';
import IMessageDAO from '../IMessageDAO';
import IRouteDAO from '../IRouteDAO';
import ITrainCardDAO from '../ITrainCardDAO';
import IUserDAO from '../IUserDAO';
import IDAO from '../IDAO';
import { MongoGameDAO } from './MongoGameDAO';
import { MongoDestinationCardDAO } from './MongoDestinationCardDAO';
import { MongoMessageDAO } from './MongoMessageDAO';
import { MongoRouteDAO } from './MongoRouteDAO';
import { MongoTrainCardDAO } from './MongoTrainCardDAO';
import { MongoUserDAO } from './MongoUserDAO';
import * as mongoose from 'mongoose';
import { DB_NAME } from '../../constants';

class MongoDAO {
  destinationCardDAO: IDestinationCardDAO;
  gameDAO: IGameDAO;
  messageDAO: IMessageDAO;
  routeDAO: IRouteDAO;
  trainCardDAO: ITrainCardDAO;
  userDAO: IUserDAO;

  constructor() {
    this.initialize(DB_NAME);
    this.destinationCardDAO = new MongoDestinationCardDAO();
    this.gameDAO = new MongoGameDAO();
    this.messageDAO = new MongoMessageDAO();
    this.routeDAO = new MongoRouteDAO();
    this.trainCardDAO = new MongoTrainCardDAO();
    this.userDAO = new MongoUserDAO();
  }

  initialize(db_name: string): void {
    mongoose.connect('mongodb://localhost/' + db_name);
  }
}

let DAO = new MongoDAO();
export { DAO };
