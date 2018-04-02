import { Game, IGameModel } from '../models/Game';

export interface IGameDAO {
  findOne(data: any): Promise<IGameModel | null>;
  find(data: any): Promise<IGameModel[]>;
  remove(data: any): Promise<null>;
}
