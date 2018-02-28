import CommandResults from '../../modules/commands/CommandResults';
import { Promise } from 'mongoose';
import { Message } from '../../models/Message';

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
          errorInfo: 'User is must be logged in to execute this command.',
        });
      });
      return promise;
    } else {
      return null;
    }
  }

  sendMessage(data: any): Promise<any> {
    let loginCheck: any = null;
    if ((loginCheck = this.validateUserAuth(data)) != null) {
      return loginCheck;
    }
    let message = new Message({
        message: data.message,
        user: data.reqUserID,
        game: 
    })

  }
}
