import { Route, IRouteModel } from '../models/Route';

export default interface IRouteDAO {
  find(data: any, populates: any[]): Promise<IRouteModel[]>;
};
