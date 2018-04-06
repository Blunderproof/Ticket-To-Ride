import { DestinationCard, IDestinationCardModel } from '../../models/DestinationCard';
import IDestinationCardDAO from '../IDestinationCardDAO';

export class MongoDestinationCardDAO implements IDestinationCardDAO {
  find(data: any, populates: any[]): Promise<IDestinationCardModel[]> {
    let query = DestinationCard.find(data);
    for (let index = 0; index < populates.length; index++) {
      const fieldName = populates[index];
      query.populate(fieldName);
    }
    return query.exec();
  }
}
