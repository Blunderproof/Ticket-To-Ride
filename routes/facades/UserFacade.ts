import { User } from '../../models/User';
import { Message } from '../../models/Message';
import { Game } from '../../models/Game';
import CommandResults from '../../modules/commands/CommandResults';
import { HASHING_SECRET, GameState, MessageType } from '../../constants';
import { DAOManager } from '../../daos/DAOManager';
const crypto = require('crypto');

export default class UserFacade {
  private constructor() {}

  private static instance: UserFacade;
  static instanceOf() {
    if (!this.instance) {
      this.instance = new UserFacade();
    }
    return this.instance;
  }

  login(data: any): Promise<any> {
    if (!data.username || !data.password) {
      return new Promise((resolve: any, reject: any) => {
        resolve({
          success: false,
          data: {},
          errorInfo: "Request is missing parameters 'username' or 'password'.",
        });
      });
    }

    const username: string = data.username;

    const hashedPassword = crypto
      .createHmac('sha256', HASHING_SECRET)
      .update(data.password)
      .digest('hex');

    // console.log("checking username and password:");
    // console.log(username);
    // console.log(hashedPassword);

    return DAOManager.dao.userDAO.findOne({ username, hashedPassword }, ['trainCardHand', 'destinationCardHand', 'claimedRouteList']).then(async user => {
      if (user) {
        let game = await DAOManager.dao.gameDAO
          .findOne(
            {
              $or: [
                {
                  host: user._id,
                  gameState: GameState.InProgress,
                },
                {
                  userList: user._id,
                  gameState: GameState.InProgress,
                },
                {
                  host: user._id,
                  gameState: GameState.Open,
                },
                {
                  userList: user._id,
                  gameState: GameState.Open,
                },
              ],
            },
            [
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
            ]
          )
          .then(async game => {
            return game;
          });

        let userCookie =
          game == null
            ? { lgid: user._id }
            : {
                lgid: user._id,
                gmid: game._id,
              };

        let gameState = game == null ? null : game.gameState;

        return {
          success: true,
          data: {
            user,
            gameState,
          },
          userCookie,
        };
      } else {
        // doc may be null if no document matched
        return {
          success: false,
          data: {},
          errorInfo: "The username and password entered don't match any users in our database.",
        };
      }
    });
  }

  logout(data: any): Promise<any> {
    // passing an empty string to their cookie to wipe their login essentially
    return new Promise((resolve: any, reject: any) => {
      resolve({
        success: true,
        data: {},
        userCookie: { lgid: '', gmid: '' },
      });
    });
  }

  register(data: any): Promise<any> {
    if (!data.username || !data.password || !data.confirmPassword) {
      const promise = new Promise((resolve: any, reject: any) => {
        resolve({
          success: false,
          data: {},
          errorInfo: "Request is missing parameters 'username', 'password', or 'confirmPassword'.",
        });
      });
      return promise;
    }

    if (data.password != data.confirmPassword) {
      return new Promise((resolve: any, reject: any) => {
        resolve({
          success: false,
          data: {},
          errorInfo: "The passwords entered didn't match.",
        });
      });
    }

    const username: string = data.username;

    const hashedPassword = crypto
      .createHmac('sha256', HASHING_SECRET)
      .update(data.password)
      .digest('hex');

    return DAOManager.dao.userDAO.findOne({ username }, []).then(async user => {
      if (user) {
        // doc may be null if no document matched
        return {
          success: false,
          data: {},
          errorInfo: 'That username is already taken! Try another username.',
        };
      } else {
        var newUserData = { username, hashedPassword };

        // Save the new model instance, passing a callback
        let newUser = await DAOManager.dao.userDAO.create(newUserData);
        return {
          success: true,
          data: {
            user: newUser,
          },
          userCookie: { lgid: newUser._id },
        };
      }
    });
  }

  getGame(data: any): Promise<any> {
    return DAOManager.dao.gameDAO
      .findOne(
        {
          $or: [
            {
              host: data.reqUserID,
              gameState: GameState.Open,
            },
            {
              userList: data.reqUserID,
              gameState: GameState.Open,
            },
            {
              host: data.reqUserID,
              gameState: GameState.InProgress,
            },
            {
              userList: data.reqUserID,
              gameState: GameState.InProgress,
            },
          ],
        },
        [
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
          'destinationCardDeck',
        ]
      )
      .then(data => {
        return {
          success: true,
          data: data,
        };
      });
  }

  getUser(data: any): Promise<any> {
    console.log('getUser called');
    return DAOManager.dao.userDAO.findOne({ _id: data.reqUserID }, ['trainCardHand', 'destinationCardHand', 'claimedRouteList']).then(data => {
      return {
        success: true,
        data: data,
      };
    });
  }

  getChatHistory(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve({
        success: true,
        emit: [
          {
            command: 'updateChatHistory',
            to: data.reqGameID,
            data: { id: data.reqGameID },
          },
        ],
      });
    });
  }

  getGameHistory(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve({
        success: true,
        emit: [
          {
            command: 'updateGameHistory',
            to: data.reqGameID,
            data: { id: data.reqGameID },
          },
        ],
      });
    });
  }
}
