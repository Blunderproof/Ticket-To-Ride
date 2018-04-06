// import { GameState, TrainColor } from '../constants';

// export class GameModel {
//   host: IUserModel;
//   userList: IUserModel[];
//   gameState: GameState;
//   unclaimedRoutes: IRouteModel[];
//   trainCardDeck: ITrainCardModel[];
//   trainCardDiscardPile: ITrainCardModel[];
//   destinationCardDeck: IDestinationCardModel[];
//   destinationCardDiscardPile: IDestinationCardModel[];
//   turnNumber: number;
//   lastRound: number;
//   playersReady: IUserModel[];
//   initGame(): Promise<any>;
//   shuffleDealCards(unclaimedRoutes: IRouteModel[], trainCardDeck: ITrainCardModel[], destinationCardDeck: IDestinationCardModel[]): Promise<any>;
//   getCurrentUserIndex(): number;
//   updatePoints(): Promise<any>;
//   reshuffleDestinationCards(): void;
//   reshuffleTrainCards(): void;

//   constructor(data: any) {
//     //do something
//   }

//   async initGame() {
//     let unclaimedRoutes: IRouteModel[] = [];
//     let filter = {};

//     if (this.userList.length == 2) {
//       filter = [{ routeNumber: 1, color: TrainColor.Gray }];
//       filter = {
//         $or: [
//           {
//             color: TrainColor.Gray,
//             routeNumber: 1,
//           },
//           {
//             color: { $ne: TrainColor.Gray },
//           },
//         ],
//       };
//     }
//     await Route.find(filter).then(routes => {
//       if (routes) {
//         for (let index = 0; index < routes.length; index++) {
//           unclaimedRoutes.push(routes[index]);
//         }
//       } else {
//         console.log('Unexpected error – there should be routes in the database.');
//       }
//     });

//     let trainCardDeck: ITrainCardModel[] = [];
//     await TrainCard.find({}).then(trainCards => {
//       if (trainCards) {
//         for (let index = 0; index < trainCards.length; index++) {
//           trainCardDeck.push(trainCards[index]);
//         }
//       } else {
//         console.log('Unexpected error – there should be train cards in the database.');
//       }
//     });

//     let destinationCardDeck: IDestinationCardModel[] = [];
//     await DestinationCard.find({}).then(destinationCards => {
//       if (destinationCards) {
//         for (let index = 0; index < destinationCards.length; index++) {
//           destinationCardDeck.push(destinationCards[index]);
//         }
//       } else {
//         console.log('Unexpected error – there should be destination cards in the database.');
//       }
//     });

//     return this.shuffleDealCards(unclaimedRoutes, trainCardDeck, destinationCardDeck);
//   }

//   async shuffleDealCards(unclaimedRoutes: IRouteModel[], trainCardDeck: ITrainCardModel[], destinationCardDeck: IDestinationCardModel[]) {
//     let shuffledTrainCardDeck = shuffle(trainCardDeck);
//     let shuffledDestinationCardDeck = shuffle(destinationCardDeck);

//     let that = this;

//     for (let index = 0; index < this.userList.length; index++) {
//       let userID = this.userList[index].toString();
//       // just in case we have real User objects, we just need the id
//       if (typeof userID != 'string') {
//         userID = userID._id;
//       }

//       let color: PlayerColor = PLAYER_COLOR_MAP[index];

//       await User.findOne({ _id: userID }).then(async player => {
//         if (!player) {
//           return null;
//         }

//         player.claimedRouteList = [];
//         player.trainCardHand = [];
//         player.destinationCardHand = [];
//         player.unmetDestinationCards = [];
//         player.metDestinationCards = [];
//         player.points = {
//           public: 0,
//           private: 0,
//           total: 0,
//           detailed: {
//             routes: 0,
//             longestRoute: 0,
//             positiveDestinationCards: 0,
//             negativeDestinationCards: 0,
//           },
//         };

//         player.tokenCount = INITIAL_TOKEN_COUNT;
//         player.color = color;
//         player.longestRoute = 0;
//         player.turnState = TurnState.ChoosingDestinationCards;

//         for (let cardIndex = 0; cardIndex < TRAIN_CARD_HAND_SIZE; cardIndex++) {
//           player.trainCardHand.push(shuffledTrainCardDeck[0]._id);
//           shuffledTrainCardDeck.splice(0, 1);
//         }

//         for (let cardIndex = 0; cardIndex < DESTINATION_CARD_HAND_SIZE; cardIndex++) {
//           player.destinationCardHand.push(shuffledDestinationCardDeck[0]._id);
//           shuffledDestinationCardDeck.splice(0, 1);
//         }

//         return player.save();
//       });
//     }

//     for (let index = 0; index < shuffledTrainCardDeck.length; index++) {
//       that.trainCardDeck.push(shuffledTrainCardDeck[index]._id);
//     }
//     for (let index = 0; index < shuffledDestinationCardDeck.length; index++) {
//       that.destinationCardDeck.push(shuffledDestinationCardDeck[index]._id);
//     }
//     for (let index = 0; index < unclaimedRoutes.length; index++) {
//       that.unclaimedRoutes.push(unclaimedRoutes[index]._id);
//     }

//     that.turnNumber = -1;
//     that.lastRound = -1;
//     that.playersReady = [];
//     that.gameState = GameState.InProgress;

//     return that.save();
//   }

//   getCurrentUserIndex() {
//     return this.turnNumber % this.userList.length;
//   }

//   async updatePoints() {
//     await this.populate('userList').execPopulate();

//     let lengths = [];
//     for (let i = 0; i < this.userList.length; i++) {
//       this.userList[i].points.detailed.longestRoute = 0;
//       lengths.push(this.userList[i].longestRoute);
//     }
//     let maxRoute = Math.max(...lengths);

//     for (let i = 0; i < this.userList.length; i++) {
//       if (this.userList[i].longestRoute == maxRoute && maxRoute > 0) this.userList[i].points.detailed.longestRoute = 10;
//     }

//     for (let i = 0; i < this.userList.length; i++) {
//       await this.userList[i].updatePoints();
//       await this.userList[i].save();
//     }
//   }

//   reshuffleDestinationCards() {
//     let shuffledDestinationCards = shuffle(this.destinationCardDiscardPile);
//     this.destinationCardDeck = shuffledDestinationCards;
//     this.destinationCardDiscardPile = [];
//   }

//   reshuffleTrainCards() {
//     let shuffledTrainCards = shuffle(this.trainCardDiscardPile);
//     this.trainCardDeck = this.trainCardDeck.concat(shuffledTrainCards);
//     this.trainCardDiscardPile = [];
//   }
// }
