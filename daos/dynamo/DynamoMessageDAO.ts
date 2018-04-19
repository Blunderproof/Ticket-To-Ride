import { MessageModel } from '../../models/MessageModel';
import { DynamoHelpers } from './DynamoDAOHelpers';
import { GAME_TABLE_NAME } from '../../constants';
import IMessageDAO from '../IMessageDAO';
import { GameModel } from '../../models/GameModel';

export class DynamoMessageDAO extends DynamoHelpers implements IMessageDAO {
  constructor() {
    super();
  }

  find(query: any, populates: any[], sort: string, gameID: string): Promise<MessageModel[]> {
    delete query.game;
    return this.get_game(gameID).then((game: GameModel) => {
      let messages = game.messages;
      let found = this.query(messages!, query);
      let filteredMessages: MessageModel[] = [];
      for (let i = 0; i < found.length; i++) {
        let message = new MessageModel(found[i]);
        message.game = game;
        filteredMessages.push(message);
      }
      return filteredMessages;
    });
  }

  remove(query: any, gameID: string): Promise<void> {
    return this.get_game(gameID).then((game: GameModel) => {
      let messages = game.messages!;
      let new_messages = [];
      for (let i = 0; i < messages.length; i++) {
        if (!this.compare(messages[i], query)) new_messages.push(messages[i]);
      }
      game.messages = new_messages;
      this.save_game(game);
    });
  }

  create(data: any, gameID: string): Promise<MessageModel> {
    return this.get_game(gameID).then((game: GameModel) => {
      let message = new MessageModel(data);
      message._id = this.new_id();
      message.timestamp = +new Date();
      delete message.game;
      let messages = game.messages || [];
      messages.push(message);
      game.messages = messages;
      return this.save_game(game).then(done => {
        return message;
      });
    });
  }
  save(message: MessageModel, gameID: string): Promise<MessageModel> {
    return this.get_game(gameID).then((game: GameModel) => {
      delete message.game;
      let messages = game.messages!;
      for (let i = 0; i < messages!.length; i++) {
        if (this.compare(messages[i], { _id: message._id })) messages[i] = message;
      }
      game.messages = messages;
      this.save_game(game);
      return message;
    });
  }
}
