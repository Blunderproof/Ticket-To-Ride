import { DestinationCardModel } from '../models/DestinationCardModel';

export default interface IDestinationCardDAO {
  find(data: any, populates: any[]): Promise<DestinationCardModel[]>;
}
