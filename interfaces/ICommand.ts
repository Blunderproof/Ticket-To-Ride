import CommandResults from "../modules/commands/CommandResults";

// TODO add contract documentation here
export default interface ICommand {
  execute(): Promise<any>;
  getData(): any;
};
