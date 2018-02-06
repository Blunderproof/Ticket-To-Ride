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
    const responseData = await this.commandFunction(this.data).catch(err => {
      console.log("do something with our error");
    });
    return responseData;
  }

  public getData(): any {
    return this.data;
  }
}
