import IRouteDAO from '../IRouteDAO';
import { IRouteModel } from '../../models/Route';
import { RouteModel } from '../../models/RouteModel';
import { DynamoHelpers } from './DynamoDAOHelpers';
import { GameModel } from '../../models/GameModel';

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
    return this.get_game(gameID).then((game: GameModel) => {
      let routes = game.routes;
      let found = this.query(routes!, query);
      let filtered: RouteModel[] = [];
      for (let i = 0; i < found.length; i++) {
        filtered.push(new RouteModel(found[i]));
      }
      return filtered;
    });
  }
}
