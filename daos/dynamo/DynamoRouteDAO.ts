import IRouteDAO from '../IRouteDAO';
import { IRouteModel } from '../../models/Route';
import { RouteModel } from '../../models/RouteModel';

export class DynamoRouteDAO implements IRouteDAO {
  findOne(data: any, populates: any[]): Promise<RouteModel | null> {
    throw new Error('Method not implemented.');
  }
  find(data: any, populates: any[]): Promise<RouteModel[]> {
    throw new Error('Method not implemented.');
  }
  constructor() {}
}
