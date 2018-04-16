import IDestinationCardDAO from '../IDestinationCardDAO';
import { IDestinationCardModel, DestinationCard } from '../../models/DestinationCard';
import { DAOManager } from '../DAOManager';
import { getDestinationCards } from '../../helpers';

export class DynamoDestinationCardDAO implements IDestinationCardDAO {
  find(data: any, populates: any[]): Promise<DestinationCardModel[]> {
    let destCards = getDestinationCards();
    for (let i = 0; i < destCards.length; i++) {
      destCards[i] = new DestinationCard(destCards[i]);
    }
  }
  constructor() {}
}
