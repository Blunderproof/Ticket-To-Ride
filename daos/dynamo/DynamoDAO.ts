import { IDAO } from '../IDAO';
import IDestinationCardDAO from '../IDestinationCardDAO';
import { IGameDAO } from '../IGameDAO';
import IMessageDAO from '../IMessageDAO';
import IRouteDAO from '../IRouteDAO';
import ITrainCardDAO from '../ITrainCardDAO';
import IUserDAO from '../IUserDAO';

export class DynamoDAO implements IDAO {
  destinationCardDAO: IDestinationCardDAO;
  gameDAO: IGameDAO;
  messageDAO: IMessageDAO;
  routeDAO: IRouteDAO;
  trainCardDAO: ITrainCardDAO;
  userDAO: IUserDAO;

  constructor() {}
}
