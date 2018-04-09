import IRouteDAO from '../IRouteDAO';
import { IRouteModel } from '../../models/Route';

export class DynamoRouteDAO implements IRouteDAO {
  find(data: any, populates: any[]): Promise<IRouteModel[]> {
    throw new Error('Method not implemented.');
  }
  constructor() {}
}
