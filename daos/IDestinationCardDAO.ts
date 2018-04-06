import { DestinationCard, IDestinationCardModel } from '../models/DestinationCard';

export default interface IDestinationCardDAO {
  find(data: any, populates: any[]): Promise<IDestinationCardModel[]>;
};
