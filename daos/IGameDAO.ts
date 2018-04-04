import { Game, IGameModel } from '../models/Game';

export interface IGameDAO {
  findOne(data: any, populates: any[]): Promise<IGameModel | null>;
  find(data: any, populates: any[]): Promise<IGameModel[]>;
  remove(data: any): Promise<void>;
  create(data: any): Promise<IGameModel>;
  save(game: IGameModel): Promise<IGameModel>;
}
