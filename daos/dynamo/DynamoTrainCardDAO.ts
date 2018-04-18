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
    return this.get_game(gameID).then((game: GameModel) => {
      let routes = game.routes;
      let found = this.query(routes!, query);
      let filtered: TrainCardModel[] = [];
      for (let i = 0; i < found.length; i++) {
        filtered.push(new TrainCardModel(found[i]));
      }
      return filtered;
    });
  }
}
