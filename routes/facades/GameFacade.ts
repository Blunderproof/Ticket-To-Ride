import CommandResults from '../../modules/commands/CommandResults';
import { Promise } from 'mongoose';
import { Message } from '../../models/Message';
import { MessageType } from '../../constants';

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
    let newMessage = new Message({
        message: data.message,
        user: data.reqUserID,
        game: data.reqGameID,
        type: MessageType.Chat
    })

    return newMessage.save().then(message => {
        return {
          success: true,
          data: {},
          emit: [{ command: 'updateChatHistory', data: {id: data.reqGameID}, room: data.reqGameID }]
        };
      });
  }
}
