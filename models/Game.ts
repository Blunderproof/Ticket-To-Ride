import * as mongoose from 'mongoose';
import { User, IUserModel } from './User';
import { Schema } from 'mongoose';
import { Route, IRouteModel } from './Route';
import { ITrainCardModel, TrainCard } from './TrainCard';
import { IDestinationCardModel, DestinationCard } from './DestinationCard';
import { shuffle } from '../helpers';
import {
  TRAIN_CARD_HAND_SIZE,
  DESTINATION_CARD_HAND_SIZE,
  GameState,
  INITIAL_TOKEN_COUNT,
  PLAYER_COLOR_MAP,
  PlayerColor,
} from '../constants';

export interface IGameModel extends mongoose.Document {
  host: IUserModel;
  userList: IUserModel[];
  gameState: GameState;
  unclaimedRoutes: IRouteModel[];
  trainCardDeck: ITrainCardModel[];
  trainCardDiscardPile: ITrainCardModel[];
  destinationCardDeck: IDestinationCardModel[];
  destinationCardDiscardPile: IDestinationCardModel[];
  turnNumber: Number;
  numberOfPlayersReady: Number;
  initGame(): Promise<any>;
  shuffleDealCards(
    unclaimedRoutes: IRouteModel[],
    trainCardDeck: ITrainCardModel[],
    destinationCardDeck: IDestinationCardModel[]
  ): Promise<any>;
}

export var GameSchema: Schema = new Schema({
  host: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  userList: [{ type: Schema.Types.ObjectId, required: true, ref: 'User' }],
  gameState: Number,
  unclaimedRoutes: [
    { type: Schema.Types.ObjectId, required: true, ref: 'Route' },
  ],
  trainCardDeck: [
    { type: Schema.Types.ObjectId, required: true, ref: 'TrainCard' },
  ],
  trainCardDiscardPile: [
    { type: Schema.Types.ObjectId, required: true, ref: 'TrainCard' },
  ],
  destinationCardDeck: [
    { type: Schema.Types.ObjectId, required: true, ref: 'DestinationCard' },
  ],
  destinationCardDiscardPile: [
    { type: Schema.Types.ObjectId, required: true, ref: 'DestinationCard' },
  ],
  turnNumber: Number,
  numberOfPlayersReady: Number,
});

GameSchema.methods.initGame = async function() {
  let unclaimedRoutes: IRouteModel[] = [];
  let filter = {};
  if (this.userList.length == 2) {
    filter = { routeNumber: 1 };
  }
  await Route.find(filter).then(routes => {
    if (routes) {
      for (let index = 0; index < routes.length; index++) {
        unclaimedRoutes.push(routes[index]);
      }
    } else {
      console.log('Unexpected error – there should be routes in the database.');
    }
  });

  let trainCardDeck: ITrainCardModel[] = [];
  await TrainCard.find({}).then(trainCards => {
    if (trainCards) {
      for (let index = 0; index < trainCards.length; index++) {
        trainCardDeck.push(trainCards[index]);
      }
    } else {
      console.log(
        'Unexpected error – there should be train cards in the database.'
      );
    }
  });

  let destinationCardDeck: IDestinationCardModel[] = [];
  await DestinationCard.find({}).then(destinationCards => {
    if (destinationCards) {
      for (let index = 0; index < destinationCards.length; index++) {
        destinationCardDeck.push(destinationCards[index]);
      }
    } else {
      console.log(
        'Unexpected error – there should be destination cards in the database.'
      );
    }
  });

  return this.shuffleDealCards(
    unclaimedRoutes,
    trainCardDeck,
    destinationCardDeck
  );
};

GameSchema.methods.shuffleDealCards = async function(
  unclaimedRoutes: IRouteModel[],
  trainCardDeck: ITrainCardModel[],
  destinationCardDeck: IDestinationCardModel[]
) {
  let shuffledTrainCardDeck = shuffle(trainCardDeck);
  let shuffledDestinationCardDeck = shuffle(destinationCardDeck);

  let that = this;

  for (let index = 0; index < this.userList.length; index++) {
    let userID = this.userList[index].toString();
    // just in case we have real User objects, we just need the id
    if (typeof userID != 'string') {
      userID = userID._id;
    }

    let color: PlayerColor = PLAYER_COLOR_MAP[index];

    await User.findOne({ _id: userID }).then(async player => {
      if (!player) {
        return null;
      }
      for (let cardIndex = 0; cardIndex < TRAIN_CARD_HAND_SIZE; cardIndex++) {
        player.trainCardHand.push(shuffledTrainCardDeck[0]);
        shuffledTrainCardDeck.splice(0, 1);
      }

      for (
        let cardIndex = 0;
        cardIndex < DESTINATION_CARD_HAND_SIZE;
        cardIndex++
      ) {
        player.destinationCardHand.push(shuffledDestinationCardDeck[0]);
        shuffledDestinationCardDeck.splice(0, 1);
      }

      player.tokenCount = INITIAL_TOKEN_COUNT;
      player.color = color;
      return player.save();
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
  that.numberOfPlayersReady = 0;
  that.gameState = GameState.InProgress;

  return that.save();
};

export const Game: mongoose.Model<IGameModel> = mongoose.model<IGameModel>(
  'Game',
  GameSchema
);
