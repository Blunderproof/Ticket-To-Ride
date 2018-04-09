import IRouteDAO from '../IRouteDAO';
import { IRouteModel } from '../../models/Route';

export class DynamoRouteDAO implements IRouteDAO {
  findOne(data: any, populates: any[]): Promise<IRouteModel | null> {
    throw new Error('Method not implemented.');
  }
  find(data: any, populates: any[]): Promise<IRouteModel[]> {
    throw new Error('Method not implemented.');
  }
  constructor() {}
}
