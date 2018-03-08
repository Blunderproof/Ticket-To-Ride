import { User } from '../../models/User';
import { Message } from '../../models/Message';
import { Game } from '../../models/Game';
import CommandResults from '../../modules/commands/CommandResults';
import { HASHING_SECRET, GameState, MessageType } from '../../constants';
const crypto = require('crypto');

export default class UserFacade {
  private constructor() {}

  private static instance = new UserFacade();
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

    return User.findOne({ username, hashedPassword }).then(async user => {
      if (user) {
        let game = await Game.findOne({
          $or: [
            {
              host: user._id,
              gameState: GameState.InProgress,
            },
            {
              userList: user._id,
              gameState: GameState.InProgress,
            },
          ],
        }).then(async game => {
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
            userID: user._id,
            username: username,
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
          errorInfo:
            "The username and password entered don't match any users in our database.",
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
          errorInfo:
            "Request is missing parameters 'username', 'password', or 'confirmPassword'.",
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

    return User.findOne({ username }).then(user => {
      if (user) {
        // doc may be null if no document matched
        return {
          success: false,
          data: {},
          errorInfo: 'That username is already taken! Try another username.',
        };
      } else {
        var newUser = new User({ username, hashedPassword });

        // Save the new model instance, passing a callback
        newUser.save();
        return {
          success: true,
          data: {
            userID: newUser._id,
            username: username,
          },
          userCookie: { lgid: newUser._id },
        };
      }
    });
  }

  getGame(data: any): Promise<any> {
    return Game.findOne({
      $or: [
        {
          host: data.reqUserID,
        },
        {
          userList: data.reqUserID,
        },
      ],
    })
      .populate('host')
      .populate('userList')
      .then(data => {
        return {
          success: true,
          data: data,
        };
      });
  }

  getUser(data: any): Promise<any> {
    return User.findById(data.reqUserID).then(data => {
      return {
        success: true,
        data: data,
      };
    });
  }

  getChatHistory(data: any): Promise<any> {
    return Message.find({
      game: data.reqGameID,
      user: data.reqUserID,
      type: MessageType.History,
    }).then(data => {
      return {
        success: true,
        data: data,
      };
    });
  }
}
