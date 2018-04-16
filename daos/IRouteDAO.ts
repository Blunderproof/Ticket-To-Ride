import { RouteModel } from '../models/RouteModel';

export default interface IRouteDAO {
  findOne(data: any, populates: any[]): Promise<RouteModel | null>;
  find(data: any, populates: any[]): Promise<RouteModel[]>;
}
