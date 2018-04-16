import ITrainCardDAO from '../ITrainCardDAO';
import { ITrainCardModel } from '../../models/TrainCard';
import { TrainCardModel } from '../../models/TrainCardModel';

export class DynamoTrainCardDAO implements ITrainCardDAO {
  find(data: any, populates: any[]): Promise<TrainCardModel[]> {
    //read csv
  }
  constructor() {}
}
