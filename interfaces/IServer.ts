// TODO add contract documentation here
export default interface IServer {
  login(data: any): Promise<any>;
  logout(data: any): Promise<any>;
  register(data: any): Promise<any>;

  createGame(data: any): Promise<any>;
  deleteGame(data: any): Promise<any>;
  joinGame(data: any): Promise<any>;
  leaveGame(data: any): Promise<any>;
  startGame(data: any): Promise<any>;
};
