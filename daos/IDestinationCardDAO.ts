import { DestinationCardModel } from '../models/DestinationCardModel';

export default interface IDestinationCardDAO {
  find(data: any, populates: any[], gameID: string): Promise<DestinationCardModel[]>;
}
