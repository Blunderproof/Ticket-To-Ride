import ITrainCardDAO from '../ITrainCardDAO';
import { ITrainCardModel } from '../../models/TrainCard';

export class DynamoTrainCardDAO implements ITrainCardDAO {
  find(data: any, populates: any[]): Promise<ITrainCardModel[]> {
    throw new Error('Method not implemented.');
  }
  constructor() {}
}
