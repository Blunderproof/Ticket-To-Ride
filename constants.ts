export const HASHING_SECRET = 'backrow-boys-rock';
export const EXPRESS_SECRET = 'we-rock-alot';
//                            hr * min * sec * milli
export const MAX_COOKIE_AGE = 24 * 60 * 60 * 1000;
export type FacadeCommand = (data: any) => Promise<any>;
export type SocketCommand = (datA: any) => Promise<any>;

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

export enum TurnState {
  BeginningOfTurn = 'BeginningOfTurn',
  OneTrainCardChosen = 'OneTrainCardChosen',
  ChoosingDestinationCards = 'ChoosingDestinationCards',
}

export const PLAYER_COLOR_MAP = [PlayerColor.Red, PlayerColor.Green, PlayerColor.Blue, PlayerColor.Black, PlayerColor.Yellow];

export const TRAIN_CARD_HAND_SIZE = 4;
export const DESTINATION_CARD_HAND_SIZE = 3;
export const INITIAL_TOKEN_COUNT = 45;

export enum MessageType {
  Chat = 'chat',
  History = 'history',
}

export enum GameState {
  Open = 1,
  InProgress,
  Ended,
}

export enum UserState {
  LoggedOut = 1,
  LoggedIn,
  InGame,
}

export const DB_NAME = 'tickettoride';
