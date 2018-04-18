import { TrainColor } from '../../constants';
import { UserModel } from '../UserModel';
import { GameModel } from '../GameModel';
import { RouteModel } from '../RouteModel';

export default interface TurnStateObject {
  user: UserModel;
  error: string;
  type: string;
  drawTrainCard(cardIndex: number, game: GameModel): UserModel | null;
  chooseDestinationCard(keepCards: Array<string>, game: GameModel): UserModel | null;
  claimRoute(route: RouteModel, cardColor: TrainColor, game: GameModel): UserModel | null;
  setChooseDestinationCardState(): UserModel | null;
}
