import ITrainCardDAO from '../ITrainCardDAO';
import { ITrainCardModel } from '../../models/TrainCard';
import { TrainCardModel } from '../../models/TrainCardModel';
import { getTrainCards } from '../../helpers';
import { DynamoHelpers } from './DynamoDAOHelpers';
import { GameModel } from '../../models/GameModel';

export class DynamoTrainCardDAO extends DynamoHelpers implements ITrainCardDAO {
  constructor() {
    super();
  }

  find(query: any, populates: any[], gameID: string): Promise<TrainCardModel[]> {
    return new Promise((yes, no) => {
      let trainCards = getTrainCards();
      let filtered: TrainCardModel[] = [];
      for (let i = 0; i < trainCards.length; i++) {
        filtered.push(new TrainCardModel(trainCards[i]));
      }
      return filtered;
    });
  }
}
