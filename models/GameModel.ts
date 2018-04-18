import { IGameModel } from './Game';
import {
  GameState,
  PLAYER_COLOR_MAP,
  INITIAL_TOKEN_COUNT,
  TurnState,
  TRAIN_CARD_HAND_SIZE,
  DESTINATION_CARD_HAND_SIZE,
  TrainColor,
  PlayerColor,
} from '../constants';
import { DAOManager } from '../daos/DAOManager';
import { UserModel } from './UserModel';
import { RouteModel } from './RouteModel';
import { TrainCardModel } from './TrainCardModel';
import { DestinationCardModel } from './DestinationCardModel';
import { shuffle } from '../helpers';
import { MessageModel } from './MessageModel';

export class GameModel {
  _id?: string;
  host: UserModel;
  userList: UserModel[];
  gameState?: GameState;
  unclaimedRoutes: RouteModel[];
  trainCardDeck: TrainCardModel[];
  trainCardDiscardPile: TrainCardModel[];
  destinationCardDeck: DestinationCardModel[];
  destinationCardDiscardPile: DestinationCardModel[];
  turnNumber?: number;
  lastRound?: number;
  playersReady: UserModel[];
  messages?: MessageModel[];
  routes?: RouteModel[];
  destinationCards?: DestinationCardModel[];
  trainCards?: TrainCardModel[];

  constructor(data?: any) {
    if (data._id == null) {
      // if we're just an ObjectID
      this._id = data.toString();
    } else {
      this._id = data._id.toString();
    }
    this.lastRound = data.lastRound;
    this.turnNumber = data.turnNumber;
    this.gameState = data.gameState;

    this.host = new UserModel(data.host || {});

    this.userList = (data.userList || []).map((e: any) => {
      if (e != null) return new UserModel(e);
    });

    this.playersReady = (data.playersReady || []).map((e: any) => new UserModel(e));
    this.unclaimedRoutes = (data.unclaimedRoutes || []).map((e: any) => new RouteModel(e));
    this.trainCardDeck = (data.trainCardDeck || []).map((e: any) => new TrainCardModel(e));
    this.trainCardDiscardPile = (data.trainCardDiscardPile || []).map((e: any) => new TrainCardModel(e));
    this.destinationCardDeck = (data.destinationCardDeck || []).map((e: any) => new DestinationCardModel(e));
    this.destinationCardDiscardPile = (data.destinationCardDiscardPile || []).map((e: any) => new DestinationCardModel(e));
  }

  getObject(): any {
    let data = {
      _id: this._id,
      host: typeof this.host == 'string' ? this.host : this.host.getObject(),
      userList: this.userList.map(model => {
        return typeof model == 'string' ? model : model.getObject();
      }),
      gameState: this.gameState,
      unclaimedRoutes: this.unclaimedRoutes.map(model => {
        return typeof model == 'string' ? model : model.getObject();
      }),
      trainCardDeck: this.trainCardDeck.map(model => {
        return typeof model == 'string' ? model : model.getObject();
      }),
      trainCardDiscardPile: this.trainCardDiscardPile.map(model => {
        return typeof model == 'string' ? model : model.getObject();
      }),
      destinationCardDeck: this.destinationCardDeck.map(model => {
        return typeof model == 'string' ? model : model.getObject();
      }),
      destinationCardDiscardPile: this.destinationCardDiscardPile.map(model => {
        return typeof model == 'string' ? model : model.getObject();
      }),
      turnNumber: this.turnNumber,
      lastRound: this.lastRound,
      playersReady: this.playersReady.map(model => {
        return typeof model == 'string' ? model : model.getObject();
      }),
    };
    return data;
  }

  async initGame(): Promise<any> {
    let unclaimedRoutes: RouteModel[] = [];
    let filter = {};

    if (this.userList.length == 2) {
      filter = [{ routeNumber: 1, color: TrainColor.Gray }];
      filter = {
        $or: [
          {
            color: TrainColor.Gray,
            routeNumber: 1,
          },
          {
            color: { $ne: TrainColor.Gray },
          },
        ],
      };
    }
    await DAOManager.dao.routeDAO.find(filter, [], this._id).then((routes: RouteModel[]) => {
      if (routes) {
        for (let index = 0; index < routes.length; index++) {
          unclaimedRoutes.push(routes[index]);
        }
      } else {
        console.log('Unexpected error – there should be routes in the database.');
      }
    });

    let trainCardDeck: TrainCardModel[] = [];
    await DAOManager.dao.trainCardDAO.find({}, [], this._id).then((trainCards: TrainCardModel[]) => {
      if (trainCards) {
        for (let index = 0; index < trainCards.length; index++) {
          trainCardDeck.push(trainCards[index]);
        }
      } else {
        console.log('Unexpected error – there should be train cards in the database.');
      }
    });

    let destinationCardDeck: DestinationCardModel[] = [];
    await DAOManager.dao.destinationCardDAO.find({}, [], this._id).then((destinationCards: DestinationCardModel[]) => {
      if (destinationCards) {
        for (let index = 0; index < destinationCards.length; index++) {
          destinationCardDeck.push(destinationCards[index]);
        }
      } else {
        console.log('Unexpected error – there should be destination cards in the database.');
      }
    });

    return this.shuffleDealCards(unclaimedRoutes, trainCardDeck, destinationCardDeck);
  }

  async shuffleDealCards(unclaimedRoutes: RouteModel[], trainCardDeck: TrainCardModel[], destinationCardDeck: DestinationCardModel[]): Promise<any> {
    let shuffledTrainCardDeck = shuffle(trainCardDeck);
    let shuffledDestinationCardDeck = shuffle(destinationCardDeck);

    let that = this;

    for (let index = 0; index < this.userList.length; index++) {
      let userID: any = this.userList[index]._id;

      let color: PlayerColor = PLAYER_COLOR_MAP[index];

      await DAOManager.dao.userDAO.findOne({ _id: userID }, []).then(async (player: UserModel) => {
        if (!player) {
          return null;
        }

        player.claimedRouteList = [];
        player.trainCardHand = [];
        player.destinationCardHand = [];
        player.unmetDestinationCards = [];
        player.metDestinationCards = [];
        player.points = {
          public: 0,
          private: 0,
          total: 0,
          detailed: {
            routes: 0,
            longestRoute: 0,
            positiveDestinationCards: 0,
            negativeDestinationCards: 0,
          },
        };

        player.tokenCount = INITIAL_TOKEN_COUNT;
        player.color = color;
        player.longestRoute = 0;
        player.turnState = TurnState.ChoosingDestinationCards;

        for (let cardIndex = 0; cardIndex < TRAIN_CARD_HAND_SIZE; cardIndex++) {
          player.trainCardHand.push(shuffledTrainCardDeck[0]);
          shuffledTrainCardDeck.splice(0, 1);
        }

        for (let cardIndex = 0; cardIndex < DESTINATION_CARD_HAND_SIZE; cardIndex++) {
          player.destinationCardHand.push(shuffledDestinationCardDeck[0]);
          shuffledDestinationCardDeck.splice(0, 1);
        }
        return DAOManager.dao.userDAO.save(player);
      });
    }

    for (let index = 0; index < shuffledTrainCardDeck.length; index++) {
      that.trainCardDeck.push(shuffledTrainCardDeck[index]);
    }
    for (let index = 0; index < shuffledDestinationCardDeck.length; index++) {
      that.destinationCardDeck.push(shuffledDestinationCardDeck[index]);
    }
    for (let index = 0; index < unclaimedRoutes.length; index++) {
      that.unclaimedRoutes.push(unclaimedRoutes[index]);
    }

    that.turnNumber = -1;
    that.lastRound = -1;
    that.playersReady = [];
    that.gameState = GameState.InProgress;

    return DAOManager.dao.gameDAO.save(that);
  }

  getCurrentUserIndex(): number {
    return this.turnNumber! % this.userList.length;
  }

  async updatePoints(): Promise<any> {
    let lengths = [];
    for (let i = 0; i < this.userList.length; i++) {
      this.userList[i].points.detailed.longestRoute = 0;
      lengths.push(this.userList[i].longestRoute!);
    }
    let maxRoute = Math.max(...lengths);

    for (let i = 0; i < this.userList.length; i++) {
      if (this.userList[i].longestRoute == maxRoute && maxRoute > 0) this.userList[i].points.detailed.longestRoute = 10;
    }

    for (let i = 0; i < this.userList.length; i++) {
      await this.userList[i].updatePoints();
      await DAOManager.dao.userDAO.save(this.userList[i]);
    }
  }

  reshuffleDestinationCards(): void {
    let shuffledDestinationCards = shuffle(this.destinationCardDiscardPile);
    this.destinationCardDeck = shuffledDestinationCards;
    this.destinationCardDiscardPile = [];
  }

  reshuffleTrainCards(): void {
    let shuffledTrainCards = shuffle(this.trainCardDiscardPile);
    this.trainCardDeck = this.trainCardDeck.concat(shuffledTrainCards);
    this.trainCardDiscardPile = [];
  }
}
