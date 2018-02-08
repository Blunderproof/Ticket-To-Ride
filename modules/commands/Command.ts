import ICommand from "../../interfaces/ICommand";
import CommandResults from "./CommandResults";
import { FacadeCommand } from "../../constants";

export default class Command implements ICommand {
  private data: any;
  private commandFunction: FacadeCommand;

  constructor(requestBody: any, commandFunction: FacadeCommand) {
    this.data = requestBody;
    this.commandFunction = commandFunction;
  }

  public async execute(): Promise<any> {
    const responseData = this.commandFunction(this.data);
    return responseData;
  }

  public getData(): any {
    return this.data;
  }
}
