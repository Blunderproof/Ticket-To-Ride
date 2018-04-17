import ITrainCardDAO from '../ITrainCardDAO';
import { ITrainCardModel } from '../../models/TrainCard';
import { TrainCardModel } from '../../models/TrainCardModel';
import { getTrainCards } from '../../helpers';

export class DynamoTrainCardDAO implements ITrainCardDAO {
  constructor() {}
  find(data: any, populates: any[]): Promise<TrainCardModel[]> {
    return new Promise((yes, no) => {
      let trainCards = getTrainCards();
      let trainCardModels: TrainCardModel[] = [];
      for (let i = 0; i < trainCards.length; i++) {
        trainCardModels.push(new TrainCardModel(trainCards[i]));
      }
      yes(trainCardModels);
    });
  }
}
