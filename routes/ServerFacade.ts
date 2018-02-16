import IServer from "../interfaces/IServer";
import CommandResults from "../modules/commands/CommandResults";
import UserFacade from "./facades/UserFacade";
import GameLobbyFacade from "./facades/GameLobbyFacade";

export default class ServerFacade implements IServer {
  private constructor() {}

  private static instance = new ServerFacade();
  static instanceOf() {
    if (!this.instance) {
      this.instance = new ServerFacade();
    }
    return this.instance;
  }

  login(data: any): Promise<any> {
    return UserFacade.instanceOf().login(data);
  }

  logout(data: any): Promise<any> {
    return UserFacade.instanceOf().logout(data);
  }

  register(data: any): Promise<any> {
    return UserFacade.instanceOf().register(data);
  }

  createGame(data: any): Promise<any> {
    return GameLobbyFacade.instanceOf().createGame(data);
  }

  deleteGame(data: any): Promise<any> {
    return GameLobbyFacade.instanceOf().deleteGame(data);
  }

  joinGame(data: any): Promise<any> {
    return GameLobbyFacade.instanceOf().joinGame(data);
  }

  leaveGame(data: any): Promise<any> {
    return GameLobbyFacade.instanceOf().leaveGame(data);
  }

  startGame(data: any): Promise<any> {
    return GameLobbyFacade.instanceOf().startGame(data);
  }

  getOpenGameList(data: any): Promise<any> {
    return GameLobbyFacade.instanceOf().getOpenGameList(data);
  }
}
