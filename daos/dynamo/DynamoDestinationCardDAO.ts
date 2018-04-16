import IDestinationCardDAO from '../IDestinationCardDAO';
import { IDestinationCardModel } from '../../models/DestinationCard';

export class DynamoDestinationCardDAO implements DestinationCardDAO {
  find(data: any, populates: any[]): Promise<DestinationCardModel[]> {}
  constructor() {}
}
