import { IUserModel } from '../User';
import { IRouteModel } from '../Route';
import { TrainColor } from '../../constants';
import { IGameModel } from '../Game';

export default interface TurnStateObject {
  user: IUserModel;
  error: string;
  drawTrainCard(cardIndex: number, game: IGameModel): IUserModel | null;
  chooseDestinationCard(keepCards: Array<string>, game: IGameModel): IUserModel | null;
  claimRoute(route: IRouteModel, cardColor: TrainColor, game: IGameModel): IUserModel | null;
};
