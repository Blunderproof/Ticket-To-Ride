import { Route, IRouteModel } from '../../models/Route';
import IRouteDAO from '../IRouteDAO';
import { RouteModel } from '../../models/RouteModel';

export class MongoRouteDAO implements IRouteDAO {
  async findOne(data: any, populates: any[], gameID: string): Promise<RouteModel | null> {
    let query = Route.findOne(data);
    for (let index = 0; index < populates.length; index++) {
      const fieldName = populates[index];
      await query.populate(fieldName);
    }
    return query.exec().then((route: IRouteModel | null) => {
      if (route == null) return null;
      return new RouteModel(route);
    });
  }
  async find(data: any, populates: any[], gameID: string): Promise<RouteModel[]> {
    let query = Route.find(data);
    for (let index = 0; index < populates.length; index++) {
      const fieldName = populates[index];
      await query.populate(fieldName);
    }
    return query.exec().then((routes: IRouteModel[]) => {
      let routeModels: RouteModel[] = [];
      routes.forEach((route: IRouteModel) => {
        routeModels.push(new RouteModel(route));
      });
      return routeModels;
    });
  }
}
