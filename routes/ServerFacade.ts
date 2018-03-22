import IServer from '../interfaces/IServer';
import CommandResults from '../modules/commands/CommandResults';
import UserFacade from './facades/UserFacade';
import GameLobbyFacade from './facades/GameLobbyFacade';
import GameFacade from './facades/GameFacade';

export default class ServerFacade implements IServer {
  private constructor() {}

  private static instance = new ServerFacade();
  static instanceOf() {
    if (!this.instance) {
      this.instance = new ServerFacade();
    }
    return this.instance;
  }

  /*
  input:
    username
    password
  */
  login(data: any): Promise<any> {
    return UserFacade.instanceOf().login(data);
  }

  /*
  input:
    { NONE }
  */
  logout(data: any): Promise<any> {
    return UserFacade.instanceOf().logout(data);
  }

  /*
  input:
    username
    password
    confirmPassword
  */
  register(data: any): Promise<any> {
    return UserFacade.instanceOf().register(data);
  }

  /*
  input:
    { NONE } => Authed user
  */
  createGame(data: any): Promise<any> {
    return GameLobbyFacade.instanceOf().createGame(data);
  }

  /*
  input:
    { NONE } => Authed user
  */
  deleteGame(data: any): Promise<any> {
    return GameLobbyFacade.instanceOf().deleteGame(data);
  }

  /*
  input:
    gameID  
    && Authed user
  */
  joinGame(data: any): Promise<any> {
    return GameLobbyFacade.instanceOf().joinGame(data);
  }

  /*
  input:
    { NONE }
  */
  getGame(data: any): Promise<any> {
    return UserFacade.instanceOf().getGame(data);
  }

  /*
  input:
    { NONE }
  */
  getUser(data: any): Promise<any> {
    return UserFacade.instanceOf().getUser(data);
  }

  /*
  input:
    { NONE } => Authed user
  */
  leaveGame(data: any): Promise<any> {
    return GameLobbyFacade.instanceOf().leaveGame(data);
  }

  /*
  input:
    { NONE } => Authed user
  */
  startGame(data: any): Promise<any> {
    return GameLobbyFacade.instanceOf().startGame(data);
  }

  /*
  input:
    { NONE } => Authed user
  */
  getOpenGameList(data: any): Promise<any> {
    return GameLobbyFacade.instanceOf().getOpenGameList(data);
  }

  /*
  input:
    { NONE }
  */
  getUserGameStatus(data: any): Promise<any> {
    return GameLobbyFacade.instanceOf().getUserGameStatus(data);
  }

  /*
  input:
    message
  */
  sendMessage(data: any): Promise<any> {
    return GameFacade.instanceOf().sendMessage(data);
  }

  /*
  input:
    message
  */
  getChatHistory(data: any): Promise<any> {
    return UserFacade.instanceOf().getChatHistory(data);
  }

  /*
  input:
    message
  */
  getGameHistory(data: any): Promise<any> {
    return UserFacade.instanceOf().getGameHistory(data);
  }

  /*
  input:
    discardCards
  */
  initialSelectDestinationCard(data: any): Promise<any> {
    return GameFacade.instanceOf().initialSelectDestinationCard(data);
  }

  /*
  input:
    keepCards
  */
  chooseDestinationCard(data: any): Promise<any> {
    return GameFacade.instanceOf().chooseDestinationCard(data);
  }

  /*
  input:
    routeID
    colorToUse --> if the color of the route for routeID is Gray
  */
  claimRoute(data: any): Promise<any> {
    return GameFacade.instanceOf().claimRoute(data);
  }

  /*
  input:
    cardIndex
  */
  chooseTrainCard(data: any): Promise<any> {
    return GameFacade.instanceOf().chooseTrainCard(data);
  }
}
