import IDestinationCardDAO from '../IDestinationCardDAO';
import { DAOManager } from '../DAOManager';
import { getDestinationCards } from '../../helpers';
import { DestinationCardModel } from '../../models/DestinationCardModel';

export class DynamoDestinationCardDAO implements IDestinationCardDAO {
  find(data: any, populates: any[]): Promise<DestinationCardModel[]> {
    return new Promise((yes, no) => {
      let destCards = getDestinationCards();
      let destCarModels: DestinationCardModel[] = [];
      for (let i = 0; i < destCards.length; i++) {
        destCarModels.push(new DestinationCardModel(destCards[i]));
      }
      yes(destCarModels);
    });
  }
}
