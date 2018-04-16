import { TrainCardModel } from '../models/TrainCardModel';

export default interface ITrainCardDAO {
  find(data: any, populates: any[]): Promise<TrainCardModel[]>;
}
