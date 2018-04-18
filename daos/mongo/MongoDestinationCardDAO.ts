import { DestinationCard, IDestinationCardModel } from '../../models/DestinationCard';
import IDestinationCardDAO from '../IDestinationCardDAO';
import { DestinationCardModel } from '../../models/DestinationCardModel';

export class MongoDestinationCardDAO implements IDestinationCardDAO {
  find(data: any, populates: any[], gameID:string): Promise<DestinationCardModel[]> {
    let query = DestinationCard.find(data);
    for (let index = 0; index < populates.length; index++) {
      const fieldName = populates[index];
      query.populate(fieldName);
    }
    return query.exec().then((destinationCards: IDestinationCardModel[]) => {
      let destinationCardModels: DestinationCardModel[] = [];
      destinationCards.forEach((destinationCard: IDestinationCardModel) => {
        destinationCardModels.push(new DestinationCardModel(destinationCard));
      });
      return destinationCardModels;
    });
  }
}
