import Command from '../modules/commands/Command';
import CommandResults from '../modules/commands/CommandResults';
import IServer from '../interfaces/IServer';

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
