import CommandResults from '../../modules/commands/CommandResults';
import { Message } from '../../models/Message';
import { MessageType, TrainColor, GameState, TurnState } from '../../constants';
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
        errorInfo: 'That game is already over!',
      };
    }
    // force unwrap game
    let unwrappedGame = game!;

    if (unwrappedGame.turnNumber >= 0) {
      return {
        success: false,
        data: {},
        errorInfo: 'The game has already been initialized and all users have performed their initial card selection!',
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
      user.turnState = TurnState.BeginningOfTurn;

      return user.save().then(savedUser => {
        return {
          success: true,
          data: {},
          gameHistory: `selected ${savedUser.destinationCardHand.length} destination cards.`,
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

    if (!data.color) {
      const promise = new Promise((resolve: any, reject: any) => {
        resolve({
          success: false,
          data: {},
          errorInfo: "Request is missing parameter 'color'.",
        });
      });
      return promise;
    } else if (!data.routeNumber) {
      const promise = new Promise((resolve: any, reject: any) => {
        resolve({
          success: false,
          data: {},
          errorInfo: "Request is missing parameter 'routeNumber'.",
        });
      });
      return promise;
    } else if (!data.city1) {
      const promise = new Promise((resolve: any, reject: any) => {
        resolve({
          success: false,
          data: {},
          errorInfo: "Request is missing parameter 'city1'.",
        });
      });
      return promise;
    } else if (!data.city2) {
      const promise = new Promise((resolve: any, reject: any) => {
        resolve({
          success: false,
          data: {},
          errorInfo: "Request is missing parameter 'city2'.",
        });
      });
      return promise;
    }

    return Game.findOne({ _id: data.reqGameID, gameState: GameState.InProgress })
      .populate('userList')
      .populate({
        path: 'userList',
        populate: {
          path: 'trainCardHand',
          model: 'TrainCard',
        },
      })
      .then(async game => {
        if (!game) {
          return {
            success: false,
            data: {},
            errorInfo: 'That game is already over!',
          };
        }
        // force unwrap game
        game = game!;

        let turnCheck: any = null;
        if (!(turnCheck = this.validateUserTurn(game, data)).success) {
          return turnCheck;
        }
        let currentUser: IUserModel | null = turnCheck.currentUser;
        // it won't be null at this point, we just checked
        currentUser = currentUser!;

        let route = await Route.findOne({
          color: data.color,
          routeNumber: data.routeNumber,
          city1: data.city1,
          city2: data.city2,
        });

        if (!route) {
          return {
            success: false,
            data: {},
            errorInfo: "The route specified doesn't exist.",
          };
        }
        // force unwrap route
        route = route!;
        const id = route._id;

        let unclaimedRoute = game.unclaimedRoutes.indexOf(id);
        if (unclaimedRoute < 0) {
          return {
            success: false,
            errorInfo: 'That route has already been claimed.',
          };
        }

        let cardColor: TrainColor = route.color == TrainColor.Gray ? data.colorToUse : route.color;
        if (!cardColor) {
          return {
            success: false,
            data: {},
            errorInfo: "Gray routes require a 'colorToUse' attribute in the request.",
          };
        }

        let currentUserState = currentUser.getTurnStateObject();

        if ((currentUser = currentUserState.claimRoute(route, cardColor, game)) == null) {
          return {
            success: false,
            data: {},
            errorInfo: currentUserState.error,
          };
        }

        // it won't be null at this point, we just checked
        currentUser = currentUser!;

        // currentUser.destinationCardCheck()

        // let graphs = currentUser.generateRouteGraph();
        // findLongestRoute(graphs);

        // for destcard in currentUser.unmetdestinationcard:
        // 	is destcard met(graphs);

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
          game.lastRound = game.userList.length;
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

  setChooseDestinationCardState(data: any): Promise<any> {
    let loginCheck: any = null;
    if ((loginCheck = this.validateUserAuth(data)) != null) {
      return loginCheck;
    }

    // logged in
    return Game.findOne({ _id: data.reqGameID, gameState: GameState.InProgress })
      .populate('userList')
      .then(async game => {
        if (!game) {
          return {
            success: false,
            data: {},
            errorInfo: 'That game is already over!',
          };
        }
        // force unwrap game
        game = game!;

        let turnCheck: any = null;
        if (!(turnCheck = this.validateUserTurn(game, data)).success) {
          return turnCheck;
        }
        let currentUser: IUserModel | null = turnCheck.currentUser;
        // it won't be null at this point, we just checked
        currentUser = currentUser!;

        let currentUserState = currentUser.getTurnStateObject();
        if ((currentUser = currentUserState.setChooseDestinationCardState()) == null) {
          return {
            success: false,
            data: {},
            errorInfo: currentUserState.error,
          };
        }

        // it won't be null at this point, we just checked
        currentUser = currentUser!;

        await currentUser.save();

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
    let loginCheck: any = null;
    if ((loginCheck = this.validateUserAuth(data)) != null) {
      return loginCheck;
    }

    if (!data.keepCards) {
      const promise = new Promise((resolve: any, reject: any) => {
        resolve({
          success: false,
          data: {},
          errorInfo: "Request is missing parameter 'keepCards'.",
        });
      });
      return promise;
    } else if (data.keepCards.length > 3 || data.keepCards.length < 1) {
      const promise = new Promise((resolve: any, reject: any) => {
        resolve({
          success: false,
          data: {},
          errorInfo: 'You must choose one, two, or three destination cards to keep.',
        });
      });
      return promise;
    }

    return Game.findOne({ _id: data.reqGameID, gameState: GameState.InProgress })
      .populate('userList')
      .populate('destinationCardDeck')
      .then(async game => {
        if (!game) {
          return {
            success: false,
            data: {},
            errorInfo: 'That game is already over!',
          };
        }
        // force unwrap game
        game = game!;

        let turnCheck: any = null;
        if (!(turnCheck = this.validateUserTurn(game, data)).success) {
          return turnCheck;
        }
        let currentUser: IUserModel | null = turnCheck.currentUser;
        // it won't be null at this point, we just checked
        currentUser = currentUser!;

        // check if the keep cards specified are in the game destination card deck
        let keep = game.destinationCardDeck.filter(function(card) {
          return data.keepCards.indexOf(card._id.toString()) >= 0;
        });

        if (keep.length != data.keepCards.length) {
          return {
            success: false,
            errorInfo: `One of the specified keep cards is not in the game's destination card deck.`,
          };
        }

        let currentUserState = currentUser.getTurnStateObject();
        if ((currentUser = currentUserState.chooseDestinationCard(data.keepCards, game)) == null) {
          return {
            success: false,
            data: {},
            errorInfo: currentUserState.error,
          };
        }

        // it won't be null at this point, we just checked
        currentUser = currentUser!;

        await currentUser.save();

        game.turnNumber++;

        if (game.lastRound > 0) {
          game.lastRound -= 1;
          if (game.lastRound == 0) {
            // end the game
            game.gameState = GameState.Ended;
          }
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

    return Game.findOne({ _id: data.reqGameID, gameState: GameState.InProgress })
      .populate('trainCardDeck')
      .populate('userList')
      .then(async game => {
        if (!game) {
          return {
            success: false,
            data: {},
            errorInfo: 'That game is already over!',
          };
        }
        // force unwrap game
        game = game!;

        let turnCheck: any = null;
        if (!(turnCheck = this.validateUserTurn(game, data)).success) {
          return turnCheck;
        }
        let currentUser: IUserModel | null = turnCheck.currentUser;
        // it won't be null at this point, we just checked
        currentUser = currentUser!;

        if (data.cardIndex >= game.trainCardDeck.length) {
          return {
            success: false,
            errorInfo: "That cardIndex is outside the bounds of the game's train card deck.",
          };
        }

        let currentUserState = currentUser.getTurnStateObject();

        if ((currentUser = currentUserState.drawTrainCard(data.cardIndex, game)) == null) {
          return {
            success: false,
            data: {},
            errorInfo: currentUserState.error,
          };
        }

        // it won't be null at this point, we just checked
        currentUser = currentUser!;
        await currentUser.save();

        if (game.lastRound > 0) {
          game.lastRound -= 1;
          if (game.lastRound == 0) {
            // end the game
            game.gameState = GameState.Ended;
          }
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
}
