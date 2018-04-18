import CommandResults from '../../modules/commands/CommandResults';
import { MessageType, TrainColor, GameState, TurnState } from '../../constants';
import { User } from '../../models/User';
import { UserModel } from '../../models/UserModel';
import { Game } from '../../models/Game';
import { GameModel } from '../../models/GameModel';
import { Message, IMessageModel } from '../../models/Message';
import { Route } from '../../models/Route';
import { RouteModel } from '../../models/RouteModel';
import { DAOManager } from '../../daos/DAOManager';

export default class GameFacade {
  private constructor() {}

  private static instance: GameFacade;
  static instanceOf() {
    if (!this.instance) {
      this.instance = new GameFacade();
    }
    return this.instance;
  }

  depopulate(arr: any[]) {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i]._id;
    }
    return arr;
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

  validateUserTurn(game: GameModel, data: any) {
    const currentUser: UserModel = game.userList[game.getCurrentUserIndex()];
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

    return DAOManager.dao.messageDAO
      .create(
        {
          message: data.message,
          user: data.reqUserID,
          game: data.reqGameID,
          type: MessageType.Chat,
        },
        data.reqGameID
      )
      .then((message: IMessageModel) => {
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

    let game = await DAOManager.dao.gameDAO.findOne({ _id: data.reqGameID }, [
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
          path: 'claimedRouteList',
          model: 'Route',
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
          path: 'unmetDestinationCards',
          model: 'DestinationCard',
        },
      },
      {
        path: 'userList',
        populate: {
          path: 'metDestinationCards',
          model: 'DestinationCard',
        },
      },
    ]);

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

    return DAOManager.dao.userDAO
      .findOne({ _id: data.reqUserID }, [
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
            path: 'unmetDestinationCards',
            model: 'DestinationCard',
          },
        },
        {
          path: 'userList',
          populate: {
            path: 'metDestinationCards',
            model: 'DestinationCard',
          },
        },
      ])
      .then(async (user: UserModel) => {
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
            return data.discardCards.indexOf(i._id) < 0;
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

        await DAOManager.dao.gameDAO.save(unwrappedGame);

        user.turnState = TurnState.BeginningOfTurn;

        console.log('about to update points');
        await user.updatePoints();
        console.log('done updated points');

        console.log('about to save user');
        return DAOManager.dao.userDAO.save(user).then((savedUser: UserModel) => {
          console.log('just saved user');
          return {
            success: true,
            data: {},
            gameHistory: `selected ${savedUser.destinationCardHand.length} destination cards.`,
            emit: [
              {
                command: 'updateGameState',
                data: { id: data.reqGameID },
                to: data.reqGameID,
              },
              {
                command: 'updateGameHistory',
                to: data.reqGameID,
                data: { id: data.reqGameID },
              },
            ],
          };
        });
      });
  }

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

    return DAOManager.dao.gameDAO
      .findOne({ _id: data.reqGameID, gameState: GameState.InProgress }, [
        'userList',
        'unclaimedRoutes',
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
            path: 'claimedRouteList',
            model: 'Route',
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
            path: 'unmetDestinationCards',
            model: 'DestinationCard',
          },
        },
        {
          path: 'userList',
          populate: {
            path: 'metDestinationCards',
            model: 'DestinationCard',
          },
        },
      ])
      .then(async (game: GameModel) => {
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
        let currentUser: UserModel | null = turnCheck.currentUser;
        // it won't be null at this point, we just checked
        currentUser = currentUser!;
        let route = await DAOManager.dao.routeDAO.findOne(
          {
            color: data.color,
            routeNumber: data.routeNumber,
            city1: data.city1,
            city2: data.city2,
          },
          []
        );

        if (!route) {
          return {
            success: false,
            data: {},
            errorInfo: "The route specified doesn't exist.",
          };
        }

        console.log('data to find route', {
          color: data.color,
          routeNumber: data.routeNumber,
          city1: data.city1,
          city2: data.city2,
        });
        console.log('route found', route);
        // force unwrap route
        route = route!;
        console.log('force unwrapped route', route);

        let unclaimedRoutes = game.unclaimedRoutes.filter(gameRoute => {
          // console.log('gameRoute._id', gameRoute._id);
          return gameRoute._id!.toString() == route._id.toString();
        });

        if (unclaimedRoutes.length == 0) {
          return {
            success: false,
            errorInfo: 'That route has already been claimed.',
          };
        }

        if (game.userList.length <= 3) {
          for (let index = 0; index < game.userList.length; index++) {
            const theUser = game.userList[index];

            for (let i = 0; i < theUser.claimedRouteList.length; i++) {
              if (route.city1 == theUser.claimedRouteList[i].city1 && route.city2 == theUser.claimedRouteList[i].city2) {
                return {
                  success: false,
                  data: {},
                  errorInfo: "You can't claim both routes on a double route in a game with only 2 or 3 players.",
                };
              }
            }
          }
        }
        for (let i = 0; i < currentUser.claimedRouteList.length; i++) {
          if (route.city1 == currentUser.claimedRouteList[i].city1 && route.city2 == currentUser.claimedRouteList[i].city2) {
            return {
              success: false,
              data: {},
              errorInfo: "You can't claim both routes on a double route.",
            };
          }
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

        await currentUser.getLongestRoute();
        await DAOManager.dao.userDAO.save(currentUser);
        await game.updatePoints();

        if (game.lastRound! > 0) {
          game.lastRound! -= 1;
          if (game.lastRound == 0) {
            // end the game
            game.gameState = GameState.Ended;
          }
        } else if (currentUser.tokenCount! <= 2) {
          // initiate end game thing; we have else if because
          // we don't need to check if you have less than 2 if you're already in the final phase
          game.lastRound = game.userList.length;
        }

        return DAOManager.dao.gameDAO.save(game).then((savedGame: GameModel) => {
          route = route!;
          console.log('game.unclaimedRoutes.length', game.unclaimedRoutes.length);
          return {
            success: true,
            data: {},
            gameHistory: `selected the ${route.color} route from ${route.city1} to ${route.city2}.`,
            emit: [
              {
                command: 'updateGameState',
                data: { id: savedGame._id },
                to: savedGame._id,
              },
              {
                command: 'updateGameHistory',
                to: savedGame._id,
                data: { id: savedGame._id },
              },
            ],
          };
        });
      });
  }

  endGame(data: any): Promise<any> {
    let loginCheck: any = null;
    if ((loginCheck = this.validateUserAuth(data)) != null) {
      return loginCheck;
    }

    // logged in
    return DAOManager.dao.gameDAO.findOne({ _id: data.reqGameID, gameState: GameState.InProgress }, []).then(async (game: GameModel) => {
      if (!game) {
        return {
          success: false,
          data: {},
          errorInfo: 'That game is already over!',
        };
      }
      // force unwrap game
      game = game!;
      game.gameState = GameState.Ended;

      return DAOManager.dao.gameDAO.save(game).then((savedGame: GameModel) => {
        return {
          success: true,
          data: {},
          gameHistory: `Game OVER.`,
          emit: [
            {
              command: 'updateGameState',
              data: { id: savedGame._id },
              to: savedGame._id,
            },
            {
              command: 'updateGameHistory',
              to: savedGame._id,
              data: { id: savedGame._id },
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
    return DAOManager.dao.gameDAO.findOne({ _id: data.reqGameID, gameState: GameState.InProgress }, ['userList']).then(async (game: GameModel) => {
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
      let currentUser: UserModel | null = turnCheck.currentUser;
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

      await DAOManager.dao.userDAO.save(currentUser);

      return DAOManager.dao.gameDAO.save(game).then((savedGame: GameModel) => {
        return {
          success: true,
          data: {},
          gameHistory: `began selecting destination cards.`,
          emit: [
            {
              command: 'updateGameState',
              data: { id: savedGame._id },
              to: savedGame._id,
            },
            {
              command: 'updateGameHistory',
              to: savedGame._id,
              data: { id: savedGame._id },
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

    return DAOManager.dao.gameDAO
      .findOne({ _id: data.reqGameID, gameState: GameState.InProgress }, [
        'userList',
        'unclaimedRoutes',
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
            path: 'claimedRouteList',
            model: 'Route',
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
            path: 'unmetDestinationCards',
            model: 'DestinationCard',
          },
        },
        {
          path: 'userList',
          populate: {
            path: 'metDestinationCards',
            model: 'DestinationCard',
          },
        },
      ])
      .then(async (game: GameModel) => {
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
        let currentUser: UserModel | null = turnCheck.currentUser;
        // it won't be null at this point, we just checked
        currentUser = currentUser!;

        // check if the keep cards specified are in the game destination card deck
        let keep = game.destinationCardDeck.filter(function(card) {
          return data.keepCards.indexOf(card._id) >= 0;
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

        await DAOManager.dao.userDAO.save(currentUser);

        if (game.lastRound! > 0) {
          game.lastRound! -= 1;
          if (game.lastRound == 0) {
            // end the game
            game.gameState = GameState.Ended;
          }
        }

        await game.updatePoints();

        return DAOManager.dao.gameDAO.save(game).then((savedGame: GameModel) => {
          return {
            success: true,
            data: {},
            gameHistory: `selected ${keep.length} destination card${keep.length >= 2 ? 's' : ''}.`,
            emit: [
              {
                command: 'updateGameState',
                data: { id: savedGame._id },
                to: savedGame._id,
              },
              {
                command: 'updateGameHistory',
                to: savedGame._id,
                data: { id: savedGame._id },
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

    if (data.cardIndex == undefined) {
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

    return DAOManager.dao.gameDAO
      .findOne({ _id: data.reqGameID, gameState: GameState.InProgress }, [
        'trainCardDeck',
        'userList',
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
            path: 'unmetDestinationCards',
            model: 'DestinationCard',
          },
        },
        {
          path: 'userList',
          populate: {
            path: 'metDestinationCards',
            model: 'DestinationCard',
          },
        },
      ])
      .then(async (game: GameModel) => {
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
        let currentUser: UserModel | null = turnCheck.currentUser;
        // it won't be null at this point, we just checked
        currentUser = currentUser!;

        if (data.cardIndex >= game.trainCardDeck.length) {
          return {
            success: false,
            errorInfo: "That cardIndex is outside the bounds of the game's train card deck.",
          };
        }

        let currentUserState = currentUser.getTurnStateObject();

        const initialDraw = currentUserState.type == TurnState.BeginningOfTurn;

        if ((currentUser = currentUserState.drawTrainCard(data.cardIndex, game)) == null) {
          return {
            success: false,
            data: {},
            errorInfo: currentUserState.error,
          };
        }

        // it won't be null at this point, we just checked
        currentUser = currentUser!;
        await DAOManager.dao.userDAO.save(currentUser);
        await game.updatePoints();

        if (game.lastRound! > 0 && !initialDraw) {
          game.lastRound! -= 1;
          if (game.lastRound == 0) {
            // end the game
            game.gameState = GameState.Ended;
          }
        }

        return DAOManager.dao.gameDAO.save(game).then((savedGame: GameModel) => {
          return {
            success: true,
            data: {},
            gameHistory: `drew a train card.`,
            emit: [
              {
                command: 'updateGameState',
                data: { id: savedGame._id },
                to: savedGame._id,
              },
              {
                command: 'updateGameHistory',
                to: savedGame._id,
                data: { id: savedGame._id },
              },
            ],
          };
        });
      });
  }
}
