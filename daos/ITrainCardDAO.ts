import { TrainCard, ITrainCardModel } from '../models/TrainCard';

export default interface ITrainCardDAO {
  find(data: any, populates: any[]): Promise<ITrainCardModel[]>;
};
