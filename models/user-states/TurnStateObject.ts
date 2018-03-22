import { IUserModel } from '../User';
import { IRouteModel } from '../Route';
import { TrainColor } from '../../constants';

export default interface TurnStateObject {
  user: IUserModel;
  error: string;
  drawTrainCard(): IUserModel | null;
  chooseDestinationCard(): IUserModel | null;
  claimRoute(route: IRouteModel, cardColor: TrainColor): IUserModel | null;
};
