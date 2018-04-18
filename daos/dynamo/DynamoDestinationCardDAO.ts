import IDestinationCardDAO from '../IDestinationCardDAO';
import { DAOManager } from '../DAOManager';
import { getDestinationCards } from '../../helpers';
import { DestinationCardModel } from '../../models/DestinationCardModel';
import { DynamoHelpers } from './DynamoDAOHelpers';
import { GameModel } from '../../models/GameModel';

export class DynamoDestinationCardDAO extends DynamoHelpers implements IDestinationCardDAO {
  find(query: any, populates: any[], gameID: string): Promise<DestinationCardModel[]> {
    return new Promise((yes, no) => {
      let destinationCards = getDestinationCards();
      let filtered: DestinationCardModel[] = [];
      for (let i = 0; i < destinationCards.length; i++) {
        let card = new DestinationCardModel(destinationCards[i]);
        card._id = this.new_id();
        filtered.push(card);
      }
      return filtered;
    });
  }
}
