import CommandResults from '../../modules/commands/CommandResults';
import { Message } from '../../models/Message';
import { MessageType, TrainColor, GameState } from '../../constants';
import { User, IUserModel, IUser } from '../../models/User';
import { Game, IGameModel } from '../../models/Game';
import { Route } from '../../models/Route';

export default class GameFacade {
  private constructor() {}

  private static instance = new GameFacade();
  static instanceOf() {
    if (!this.instance) {
      this.instance = new GameFacade();
    }
    return this.instance;
  }

  validateUserAuth(data: any) {
    console.log(data);
    if (!data.reqUserID) {
      const promise = new Promise((resolve: any, reject: any) => {
        resolve({
          success: false,
          data: {},
          errorInfo: 'User must be logged in to execute this command.',
        });
      });
      return promise;
    } else if (!data.reqGameID) {
      const promise = new Promise((resolve: any, reject: any) => {
        resolve({
          success: false,
          data: {},
          errorInfo: 'User must have an open game to execute this command.',
        });
      });
      return promise;
    } else {
      return null;
    }
  }

  validateUserTurn(game: IGameModel, data: any) {
    const currentUser: IUserModel = game.userList[game.getCurrentUserIndex()];
    if (data.reqUserID != currentUser._id) {
      return {
        success: false,
        data: {},
        errorInfo: "It isn't your turn!",
      };
    } else {
      return {
        success: true,
        currentUser,
      };
    }
  }

  sendMessage(data: any): Promise<any> {
    let loginCheck: any = null;
    if ((loginCheck = this.validateUserAuth(data)) != null) {
      return loginCheck;
    }
    let newMessage = new Message({
      message: data.message,
      user: data.reqUserID,
      game: data.reqGameID,
      type: MessageType.Chat,
    });

    return newMessage.save().then(message => {
      return {
        success: true,
        data: {},
        emit: [
          {
            command: 'updateChatHistory',
            data: { id: data.reqGameID },
            to: data.reqGameID,
          },
        ],
      };
    });
  }

  // implement
  async initialSelectDestinationCard(data: any): Promise<any> {
    let loginCheck: any = null;
    if ((loginCheck = this.validateUserAuth(data)) != null) {
      return loginCheck;
    }

    if (!data.discardCards) {
      const promise = new Promise((resolve: any, reject: any) => {
        resolve({
          success: false,
          data: {},
          errorInfo: "Request is missing parameter 'discardCards'.",
        });
      });
      return promise;
    } else if (data.discardCards.length > 1) {
      const promise = new Promise((resolve: any, reject: any) => {
        resolve({
          success: false,
          data: {},
          errorInfo: 'You must choose two or three destination cards to keep.',
        });
      });
      return promise;
    }

    let game = await Game.findOne({ _id: data.reqGameID });

    if (!game) {
      return {
        success: false,
        data: {},
        errorInfo: "That game doesn't exist.",
      };
    }
    // force unwrap game
    let unwrappedGame = game!;

    if (unwrappedGame.turnNumber >= 0) {
      return {
        success: false,
        data: {},
        errorInfo:
          'The game has already been initialized and all users have performed their initial card selection!',
      };
    } else if (unwrappedGame.playersReady.indexOf(data.reqUserID) >= 0) {
      return {
        success: false,
        data: {},
        errorInfo: 'You already performed your initial card selection!',
      };
    }

    return User.findOne({ _id: data.reqUserID }).then(async user => {
      if (!user) {
        return {
          success: false,
          data: {},
          errorInfo: "That user doesn't exist.",
        };
      }

      if (data.discardCards.length == 0) {
        // pass
      } else {
        // unpopulated so we're just comparing ids
        user.destinationCardHand = user.destinationCardHand.filter(function(i) {
          return data.discardCards.indexOf(i.toString()) < 0;
        });

        // the only amount that we could subtract is by 1! so length should be 2.
        // if it's not 2, then the discardCard submitted wasn't in the users hand.
        // this is sorta strange way to do it, but whatever. it's as good as checking it before.
        if (user.destinationCardHand.length != 2) {
          return {
            success: false,
            data: {},
            errorInfo: "The card you submitted to discard isn't in your hand.",
          };
        }

        for (let index = 0; index < data.discardCards.length; index++) {
          const element = data.discardCards[index];
          unwrappedGame.destinationCardDiscardPile.push(element);
        }
      }

      unwrappedGame.playersReady.push(user._id);
      if (unwrappedGame.playersReady.length == unwrappedGame.userList.length) {
        unwrappedGame.turnNumber = 0;
      }

      await unwrappedGame.save();

      return user.save().then(savedUser => {
        return {
          success: true,
          data: {},
          gameHistory: `selected ${
            savedUser.destinationCardHand.length
          } destination cards.`,
          emit: [
            {
              command: 'updateGameState',
              data: { id: data.reqGameID },
              room: data.reqGameID,
            },
          ],
        };
      });
    });
  }

  // async selectDestinationCard(data: any): Promise<any> {
  //   let loginCheck: any = null;
  //   if ((loginCheck = this.validateUserAuth(data)) != null) {
  //     return loginCheck;
  //   }

  //   let game = await Game.findOne({ _id: data.reqGameID });

  //   if (!game) {
  //     return {
  //       success: false,
  //       data: {}
  //     }
  //   }
  //   // force unwrap game
  //   let unwrappedGame = game!;

  //   return User.findOne({ user: data.reqUserID }).then(async user => {
  //     if (!user) {
  //       return {
  //         success: false,
  //         data: {},
  //         errorInfo: "That user doesn't exist.",
  //       };
  //     }

  //     let top3 = game.destinationCardDeck.slice(0,3);

  //     let discard = top3.filter(function(cardID) {
  //       return data.keepCards.indexOf(cardID.toString()) < 0;
  //     });
  //     let keep = top3.filter(function(cardID) {
  //       return data.keepCards.indexOf(cardID.toString()) >= 0;
  //     });

  //     // unpopulated so we're just comparing ids
  //     for (let index = 0; index < keep.length; index++) {
  //       const element = keep[index];
  //       user.destinationCardHand.push(element);
  //     }

  //     // add the game
  //     game.destinationCardDeck = game.destinationCardDeck.filter(function(
  //       cardID
  //     ) {
  //       return discard.indexOf(cardID.toString()) < 0;
  //     });

  // for (let index = 0; index < discard.length; index++) {
  //   const element = discard[index];
  //   unwrappedGame.destinationCardDiscardPile.push(element);
  // }

  //     // remove the cards from the deck
  //     game.destinationCardDeck.splice(0, 3);
  //     await game.save();

  //     return user.save().then(savedUser => {
  //       return {
  //         success: true,
  //         data: {},
  //         emit: [
  //           {
  //             command: 'updateGameState',
  //             data: { id: data.reqGameID },
  //             room: data.reqGameID,
  //             gameHistory: `selected ${
  //                savedUser.destinationCardHand.length
  //             } destination cards.`,
  //           },
  //         ],
  //       };
  //     });
  //   });
  // }

  claimRoute(data: any): Promise<any> {
    let loginCheck: any = null;
    if ((loginCheck = this.validateUserAuth(data)) != null) {
      return loginCheck;
    }

    if (!data.routeID) {
      const promise = new Promise((resolve: any, reject: any) => {
        resolve({
          success: false,
          data: {},
          errorInfo: "Request is missing parameter 'routeID'.",
        });
      });
      return promise;
    }

    return Game.findById(data.reqGameID)
      .populate('userList')
      .then(async game => {
        if (!game) {
          return {
            success: false,
            data: {},
            errorInfo: "That game doesn't exist.",
          };
        }
        // force unwrap game
        game = game!;

        let turnCheck: any = null;
        if (!(turnCheck = this.validateUserTurn(game, data)).success) {
          return turnCheck;
        }
        let currentUser: IUserModel = turnCheck.currentUser;

        // TODO check current user in state BeginningOfTurn

        let routeIndex = game.unclaimedRoutes.indexOf(data.routeID);
        if (routeIndex < 0) {
          return {
            success: false,
            errorInfo: 'That route has already been claimed.',
          };
        }

        let route = await Route.findById(data.routeID);

        if (!route) {
          return {
            success: false,
            data: {},
            errorInfo: "That route doesn't exist.",
          };
        }
        // force unwrap route
        route = route!;

        let cardColor: TrainColor =
          route.color == TrainColor.Gray ? data.colorToUse : route.color;
        if (!cardColor) {
          return {
            success: false,
            data: {},
            errorInfo:
              "Gray routes require a 'colorToUse' attribute in the request.",
          };
        }

        let userCardsOfColor = currentUser.trainCardHand.filter(
          (card, index) => {
            card.color == cardColor;
          }
        );

        if (userCardsOfColor.length < route.length) {
          return {
            success: false,
            data: {},
            errorInfo: `You don't have enough ${cardColor} cards to claim this route.`,
          };
        }

        if (currentUser.tokenCount < route.length) {
          return {
            success: false,
            data: {},
            errorInfo: `You don't have enough train tokens to claim this route.`,
          };
        }

        // claim route
        currentUser.claimedRouteList.push(route._id);
        currentUser.tokenCount -= route.length;

        // take only the number of cards required
        let cardsToDiscard = userCardsOfColor.slice(0, route.length);
        // map them to ids
        let cardIDsToDiscard = cardsToDiscard.map(card => {
          card._id;
        });

        // filter the trainCardHand by cards not in the discard list
        currentUser.trainCardHand = currentUser.trainCardHand.filter(
          (card, index) => {
            // < 0 means not in the discard list
            return cardIDsToDiscard.indexOf(card._id) < 0;
          }
        );

        // TODO uncomment once public and total scores have been changed
        // currentUser.publicScore += route.pointValue();
        // currentUser.totalScore += route.pointValue();
        currentUser.score += route.pointValue();

        // construct set of graphs from routes. detect which ones only have 1 edge. start length process from each leaf node.
        // do this for all users, find longest route
        // run the game graph algorithm
        //  if user is longest route, then add that to publicScore & totalScore

        // to speed this up, we might want to move to "unmetDestinationCardHand" and "metDestinationCardHand"
        // iterate over all (unmet) destination cards
        //    with same graph set structure, run a visitor thing on each one and see if both are ever found in one set
        //    if so, change total score and move unmet destination cards to met
        //    if not, do nothing

        await currentUser.save();
        game.turnNumber++;

        if (game.lastRound > 0) {
          game.lastRound -= 1;
          if (game.lastRound == 0) {
            // end the game
            game.gameState = GameState.Ended;
          }
        } else if (currentUser.tokenCount <= 2) {
          // initiate end game thing; we have else if because
          // we don't need to check if you have less than 2 if you're already in the final phase
          game.lastRoute = game.userList.length;
        }

        return game.save().then(savedGame => {
          return {
            success: true,
            emit: [
              {
                command: 'updateGameState',
                data: { id: savedGame._id },
                room: savedGame._id,
              },
            ],
          };
        });
      });
  }

  setChoosingDestinationCard(data: any): Promise<any> {
    let loginCheck: any = null;
    if ((loginCheck = this.validateUserAuth(data)) != null) {
      return loginCheck;
    }

    // logged in
    return Game.findById(data.reqGameID)
      .populate('userList')
      .then(async game => {
        if (!game) {
          return {
            success: false,
            data: {},
            errorInfo: "That game doesn't exist.",
          };
        }
        // force unwrap game
        game = game!;

        let turnCheck: any = null;
        if (!(turnCheck = this.validateUserTurn(game, data)).success) {
          return turnCheck;
        }
        let currentUser: IUserModel = turnCheck.currentUser;

        // TODO set userState to ChoosingDestinationCards

        return game.save().then(savedGame => {
          return {
            success: true,
            emit: [
              {
                command: 'updateGameState',
                data: { id: savedGame._id },
                room: savedGame._id,
              },
            ],
          };
        });
      });
  }

  chooseDestinationCard(data: any): Promise<any> {
    return Game.findById(data.reqGameID)
      .populate('userList')
      .then(async game => {
        if (!game) {
          return {
            success: false,
            data: {},
            errorInfo: "That game doesn't exist.",
          };
        }
        // force unwrap game
        game = game!;

        let turnCheck: any = null;
        if (!(turnCheck = this.validateUserTurn(game, data)).success) {
          return turnCheck;
        }
        let currentUser: IUserModel = turnCheck.currentUser;

        // TODO check current user in state ChoosingDestinationCard

        game.turnNumber++;
        // set userState to BeginningOfTurn

        //game.turnNumber %= game.userList.length;

        return game.save().then(savedGame => {
          return {
            success: true,
            emit: [
              {
                command: 'updateGameState',
                data: { id: savedGame._id },
                room: savedGame._id,
              },
            ],
          };
        });
      });
  }

  chooseTrainCard(data: any): Promise<any> {
    let loginCheck: any = null;
    if ((loginCheck = this.validateUserAuth(data)) != null) {
      return loginCheck;
    }

    if (!data.cardIndex) {
      const promise = new Promise((resolve: any, reject: any) => {
        resolve({
          success: false,
          data: {},
          errorInfo: "Request is missing parameter 'cardIndex'.",
        });
      });
      return promise;
    } else if (data.cardIndex < 0 || data.cardIndex > 5) {
      const promise = new Promise((resolve: any, reject: any) => {
        resolve({
          success: false,
          data: {},
          errorInfo: 'cardIndex must be between 0 and 5.',
        });
      });
      return promise;
    }

    return Game.findById(data.reqGameID)
      .populate('userList')
      .populate({
        path: 'userList',
        populate: 'trainCardHand',
      })
      .then(async game => {
        if (!game) {
          return {
            success: false,
            data: {},
            errorInfo: "That game doesn't exist.",
          };
        }
        // force unwrap game
        game = game!;

        let turnCheck: any = null;
        if (!(turnCheck = this.validateUserTurn(game, data)).success) {
          return turnCheck;
        }
        let currentUser: IUserModel = turnCheck.currentUser;

        return game.save().then(savedGame => {
          return {
            success: true,
            emit: [
              {
                command: 'updateGameState',
                data: { id: savedGame._id },
                room: savedGame._id,
              },
            ],
          };
        });
      });
  }
}
