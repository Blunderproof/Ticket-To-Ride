export const HASHING_SECRET = 'backrow-boys-rock';
export const EXPRESS_SECRET = 'we-rock-alot';
//                            hr * min * sec * milli
export const MAX_COOKIE_AGE = 24 * 60 * 60 * 1000;
export type FacadeCommand = (data: any) => Promise<any>;
export type SocketCommand = () => Promise<any>;

export enum TrainColor {
  Red = 'red',
  Green = 'green',
  Blue = 'blue',
  Black = 'black',
  Yellow = 'yellow',
  Pink = 'pink',
  White = 'white',
  Orange = 'orange',
  Gray = 'gray',
  Rainbow = 'rainbow',
}

export enum PlayerColor {
  Red = 'red',
  Green = 'green',
  Blue = 'blue',
  Black = 'black',
  Yellow = 'yellow',
}
