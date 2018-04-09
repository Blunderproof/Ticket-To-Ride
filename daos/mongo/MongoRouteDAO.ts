import { Route, IRouteModel } from '../../models/Route';
import IRouteDAO from '../IRouteDAO';

export class MongoRouteDAO implements IRouteDAO {
  findOne(data: any, populates: any[]): Promise<IRouteModel | null> {
    let query = Route.findOne(data);
    for (let index = 0; index < populates.length; index++) {
      const fieldName = populates[index];
      query.populate(fieldName);
    }
    return query.exec();
  }
  find(data: any, populates: any[]): Promise<IRouteModel[]> {
    let query = Route.find(data);
    for (let index = 0; index < populates.length; index++) {
      const fieldName = populates[index];
      query.populate(fieldName);
    }
    return query.exec();
  }
}
