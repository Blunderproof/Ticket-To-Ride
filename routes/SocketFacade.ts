import { Message } from '../models/Message';
import { Game } from '../models/Game';
import { GameState } from '../constants';
import { SocketCommand } from '../constants';

export default class SocketFacade {
  socketCommandMap: Map<string, SocketCommand>;

  private constructor() {
    this.socketCommandMap = new Map<string, SocketCommand>();
    this.configureSocketCommandMap();
  }

  private configureSocketCommandMap = () => {
    // user commands
    this.socketCommandMap.set('gameList', this.getOpenGameList);
    this.socketCommandMap.set('startGame', this.startGame);
    this.socketCommandMap.set('updateGameState', this.updateGameState);
  };

  private static instance = new SocketFacade();

  static instanceOf() {
    if (!this.instance) {
      this.instance = new SocketFacade();
    }
    return this.instance;
  }

  execute(emitRequest: any, socketConnection: any) {
    console.log(emitRequest);
    const socketCommand: SocketCommand | undefined = this.socketCommandMap.get(
      emitRequest.command
    );

    if (!socketCommand) {
      console.log(
        `Yikes, '${emitRequest.command}' is not a valid socket command.`
      );
      return;
    }

    let sureSocketCommand: SocketCommand = socketCommand!;
    sureSocketCommand(emitRequest.data).then(emitData => {
      console.log(emitData);
      if (emitRequest.to) {
        socketConnection.to(emitRequest.to).emit(emitRequest.command, emitData);
      } else {
        socketConnection.emit(emitRequest.command, emitData);
      }
    });
  }

  private getOpenGameList = (data: any): Promise<any> => {
    return Game.find({ gameState: GameState.Open })
      .populate('host')
      .populate('userList')
      .then(games => {
        return games;
      });
  };

  private startGame = (data: any): Promise<any> => {
    return new Promise((accept, reject) => {
      accept({ msg: 'start game!' });
    });
  };

  private updateGameState = (data: any): Promise<any> => {
    return Game.findById(data.id)
      .populate('host')
      .populate('userList')
      .populate('unclaimedRouteFiles')
      .populate('faceUpTrainCards')
      .populate('trainCardDeck')
      .populate('trainCardDiscardPile')
      .populate('destinationCardDeck')
      .populate('destinationCardDiscardPile')
      .then(game => {
        return game;
      });
  };

  private updateChatHistory = (data: any): Promise<any> => {
    return Game.findById(data.id)
      .populate('host')
      .populate('userList')
      .populate('unclaimedRouteFiles')
      .populate('faceUpTrainCards')
      .populate('trainCardDeck')
      .populate('trainCardDiscardPile')
      .populate('destinationCardDeck')
      .populate('destinationCardDiscardPile')
      .then(game => {
        return game;
      });
  };

  private updateGameHistory = (data: any): Promise<any> => {
    return Game.findById(data.id)
      .populate('host')
      .populate('userList')
      .populate('unclaimedRouteFiles')
      .populate('faceUpTrainCards')
      .populate('trainCardDeck')
      .populate('trainCardDiscardPile')
      .populate('destinationCardDeck')
      .populate('destinationCardDiscardPile')
      .then(game => {
        return game;
      });
  };
}
