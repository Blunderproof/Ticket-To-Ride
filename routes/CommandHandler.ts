import Command from "../modules/commands/command";
import CommandResults from "../modules/commands/commandResults";
import IServer from "../interfaces/IServer";

export default class CommandHandler {
  facade: IServer;

  constructor(serverInstance: IServer) {
    this.facade = serverInstance;
  }

  execute(command: Command): Promise<any> {
    let responseData: any = command.execute();
    return responseData;
  }
}
