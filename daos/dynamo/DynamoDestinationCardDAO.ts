import IDestinationCardDAO from '../IDestinationCardDAO';
import { DAOManager } from '../DAOManager';
import { getDestinationCards } from '../../helpers';
import { DestinationCardModel } from '../../models/DestinationCardModel';
import { DynamoHelpers } from './DynamoDAOHelpers';
import { GameModel } from '../../models/GameModel';

export class DynamoDestinationCardDAO extends DynamoHelpers implements IDestinationCardDAO {
  find(query: any, populates: any[], gameID: string): Promise<DestinationCardModel[]> {
    return this.get_game(gameID).then((game: GameModel) => {
      let routes = game.routes;
      let found = this.query(routes!, query);
      let filtered: DestinationCardModel[] = [];
      for (let i = 0; i < found.length; i++) {
        filtered.push(new DestinationCardModel(found[i]));
      }
      return filtered;
    });
  }
}
