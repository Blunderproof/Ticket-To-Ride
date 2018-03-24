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
    Rainbow = 'rainbow'
}

export enum PlayerColor {
    Red = 'red',
    Green = 'green',
    Blue = 'blue',
    Black = 'black',
    Yellow = 'yellow'
}

export enum RGBAColor {
    red = 'rgba(200, 80, 80, .8)',
    green = 'rgba(80, 200, 80, .8)',
    blue = 'rgba(0, 80, 200, .8)',
    black = 'rgba(80, 80, 80, .8)',
    yellow = 'rgba(255, 255, 60, .8)'
}

export enum RouteColor {
    Gy = 'gray',
    P = 'pink',
    O = 'orange',
    Be = 'blue',
    Gn = 'green',
    W = 'white',
    R = 'red',
    Bk = 'black',
    Y = 'yellow'
}

export enum MessageType {
    Chat = 'chat',
    History = 'history'
}

export enum UserState {
    LoggedOut = 1,
    LoggedIn,
    InGame,
}

export enum TurnState {
    BeginningOfTurn = 'BeginningOfTurn',
    OneTrainCardChosen = 'OneTrainCardChosen',
    ChoosingDestinationCards = 'ChoosingDestinationCards',
}