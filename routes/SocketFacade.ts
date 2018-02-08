import { Game } from "../models/Game";
import { SocketCommand } from "../constants";

export default class SocketFacade {
  socketCommandMap: Map<string, SocketCommand>;

  private constructor() {
    this.socketCommandMap = new Map<string, SocketCommand>();
    this.configureSocketCommandMap();
  }

  private configureSocketCommandMap = () => {
    // user commands
    this.socketCommandMap.set("gameList", this.getGameList);
  };

  private static instance = new SocketFacade();

  static instanceOf() {
    if (!this.instance) {
      this.instance = new SocketFacade();
    }
    return this.instance;
  }

  execute(emitCommand: string, socketConnection: any) {
    const socketCommand: SocketCommand | undefined = this.socketCommandMap.get(
      emitCommand
    );

    if (!socketCommand) {
      console.log(`Yikes, '${emitCommand}' is not a valid socket command.`);
      return;
    }

    let sureSocketCommand: SocketCommand = socketCommand!;
    sureSocketCommand().then(emitData => {
      // console.log(emitData);
      // TODO verify this works with real sockets on the front end
      socketConnection.emit(emitCommand, emitData);
    });
  }

  private getGameList = (): Promise<any> => {
    return Game.find().then(games => {
      return games;
    });
  };
}
