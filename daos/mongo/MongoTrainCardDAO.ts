import { TrainCard, ITrainCardModel } from '../../models/TrainCard';
import ITrainCardDAO from '../ITrainCardDAO';

export class MongoTrainCardDAO implements ITrainCardDAO {
  find(data: any, populates: any[]): Promise<ITrainCardModel[]> {
    let query = TrainCard.find(data);
    for (let index = 0; index < populates.length; index++) {
      const fieldName = populates[index];
      query.populate(fieldName);
    }
    return query.exec();
  }
}
