import IDestinationCardDAO from '../IDestinationCardDAO';
import { IDestinationCardModel } from '../../models/DestinationCard';

export class DynamoDestinationCardDAO implements IDestinationCardDAO {
  find(data: any, populates: any[]): Promise<IDestinationCardModel[]> {
    throw new Error('Method not implemented.');
  }
  constructor() {}
}
