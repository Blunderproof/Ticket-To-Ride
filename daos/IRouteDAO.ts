import { Route, IRouteModel } from '../models/Route';

export default interface IRouteDAO {
  findOne(data: any, populates: any[]): Promise<IRouteModel | null>;
  find(data: any, populates: any[]): Promise<IRouteModel[]>;
};
