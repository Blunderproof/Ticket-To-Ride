import { TrainCard, ITrainCardModel } from '../../models/TrainCard';
import ITrainCardDAO from '../ITrainCardDAO';
import { TrainCardModel } from '../../models/TrainCardModel';

export class MongoTrainCardDAO implements ITrainCardDAO {
  find(data: any, populates: any[], gameID:string): Promise<TrainCardModel[]> {
    let query = TrainCard.find(data);
    for (let index = 0; index < populates.length; index++) {
      const fieldName = populates[index];
      query.populate(fieldName);
    }
    return query.exec().then((trainCards: ITrainCardModel[]) => {
      let trainCardModels: TrainCardModel[] = [];
      trainCards.forEach((trainCard: ITrainCardModel) => {
        trainCardModels.push(new TrainCardModel(trainCard));
      });
      return trainCardModels;
    });
  }
}
