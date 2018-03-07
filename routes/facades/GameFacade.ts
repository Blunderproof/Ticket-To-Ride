import CommandResults from '../../modules/commands/CommandResults';
import { Message } from '../../models/Message';
import { MessageType } from '../../constants';
import { User } from '../../models/User';
import { Game } from '../../models/Game';

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
            room: data.reqGameID,
          },
        ],
      };
    });
  }

  // implement
  initialSelectDestinationCard(data: any): Promise<any> {
    let loginCheck: any = null;
    if ((loginCheck = this.validateUserAuth(data)) != null) {
      return loginCheck;
    }

    return User.findOne({ user: data.reqUserID }).then(async user => {
      if (!user) {
        return {
          success: false,
          data: {},
          errorInfo: "That user doesn't exist.",
        };
      }

      // unpopulated so we're just comparing ids
      user.destinationCardHand = user.destinationCardHand.filter(function(i) {
        return data.discardCards.indexOf(i.toString()) < 0;
      });

      return user.save().then(savedUser => {
        return {
          success: true,
          data: {},
          emit: [
            {
              // TODO ensure this is the right command
              command: 'updateGame',
              data: { id: data.reqGameID },
              room: data.reqGameID,
              // TODO add the gameHistory thing
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
  //   // TODO force unwrap game

  //   return User.findOne({ user: data.reqUserID }).then(async user => {
  //     if (!user) {
  //       return {
  //         success: false,
  //         data: {},
  //         errorInfo: "That user doesn't exist.",
  //       };
  //     }

  //     let top3 = game.destinationCardDeck.slice(2);

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

  //     // remove the cards from the deck
  //     game.destinationCardDeck.splice(0, 3);
  //     await game.save();

  //     return user.save().then(savedUser => {
  //       return {
  //         success: true,
  //         data: {},
  //         emit: [
  //           {
  //             // TODO ensure this is the right command
  //             command: 'updateGame',
  //             data: { id: data.reqGameID },
  //             room: data.reqGameID,
  //             // TODO add the gameHistory thing
  //           },
  //         ],
  //       };
  //     });
  //   });
  // }
}
