import { GameModel } from '../models/GameModel';

export default interface IGameDAO {
  findOne(data: any, populates: any[]): Promise<GameModel | null>;
  find(data: any, populates: any[]): Promise<GameModel[]>;
  remove(data: any): Promise<void>;
  create(data: any): Promise<GameModel>;
  save(game: GameModel): Promise<GameModel>;
}
