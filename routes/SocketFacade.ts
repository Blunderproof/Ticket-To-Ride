import { Message } from '../models/Message';
import { Game } from '../models/Game';
import { GameState, MessageType } from '../constants';
import { SocketCommand } from '../constants';
import { emit } from 'cluster';
import { DAOManager } from '../daos/DAOManager';

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
    this.socketCommandMap.set('updateChatHistory', this.updateChatHistory);
    this.socketCommandMap.set('updateGameHistory', this.updateGameHistory);
  };

  private static instance = new SocketFacade();

  static instanceOf() {
    if (!this.instance) {
      this.instance = new SocketFacade();
    }
    return this.instance;
  }

  execute(emitRequest: any, socketConnection: any) {
    const socketCommand: SocketCommand | undefined = this.socketCommandMap.get(emitRequest.command);

    if (!socketCommand) {
      console.log(`Yikes, '${emitRequest.command}' is not a valid socket command.`);
      return;
    }

    let sureSocketCommand: SocketCommand = socketCommand!;
    sureSocketCommand(emitRequest.data).then(emitData => {
      if (emitRequest.to) {
        socketConnection.to(emitRequest.to).emit(emitRequest.command, emitData);
      } else {
        socketConnection.emit(emitRequest.command, emitData);
      }
    });
  }

  private getOpenGameList = (data: any): Promise<any> => {
    return DAOManager.dao.gameDAO.find({ gameState: GameState.Open }, ['host', 'userList']).then(games => {
      return games;
    });
  };

  private startGame = (data: any): Promise<any> => {
    return new Promise((accept, reject) => {
      accept({ msg: 'start game!' });
    });
  };

  private updateGameState = (data: any): Promise<any> => {
    return DAOManager.dao.gameDAO
      .findOne({ _id: data.id }, [
        'host',
        'userList',
        {
          path: 'userList',
          populate: {
            path: 'trainCardHand',
            model: 'TrainCard',
          },
        },
        {
          path: 'userList',
          populate: {
            path: 'destinationCardHand',
            model: 'DestinationCard',
          },
        },
        {
          path: 'userList',
          populate: {
            path: 'claimedRouteList',
            model: 'Route',
          },
        },
        'unclaimedRoutes',
        'trainCardDeck',
        'trainCardDiscardPile',
        'destinationCardDeck',
        'destinationCardDiscardPile',
      ])
      .then(game => {
        return game;
      });
  };

  private updateChatHistory = (data: any): Promise<any> => {
    return DAOManager.dao.messageDAO.find({ game: data.id, type: MessageType.Chat }, ['user', 'game'], 'timestamp').then(chatMessages => {
      return chatMessages;
    });
  };

  private updateGameHistory = (data: any): Promise<any> => {
    return DAOManager.dao.messageDAO.find({ game: data.id, type: MessageType.History }, ['user', 'game'], '-timestamp').then(gameHistoryMessages => {
      return gameHistoryMessages;
    });
  };
}
