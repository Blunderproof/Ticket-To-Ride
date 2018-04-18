import IRouteDAO from '../IRouteDAO';
import { IRouteModel } from '../../models/Route';
import { RouteModel } from '../../models/RouteModel';
import { DynamoHelpers } from './DynamoDAOHelpers';
import { GameModel } from '../../models/GameModel';
import { getRoutes } from '../../helpers';

export class DynamoRouteDAO extends DynamoHelpers implements IRouteDAO {
  constructor() {
    super();
  }

  findOne(query: any, populates: any[], gameID: string): Promise<RouteModel | null> {
    return this.find(query, populates, gameID).then(data => {
      return data[0];
    });
  }

  find(query: any, populates: any[], gameID: string): Promise<RouteModel[]> {
    return new Promise((yes, no) => {
      let routes = getRoutes();
      let filtered: RouteModel[] = [];
      for (let i = 0; i < routes.length; i++) {
        let route = new RouteModel(routes[i]);
        route._id = this.new_id();
        filtered.push(route);
      }
      return filtered;
    });
  }
}
