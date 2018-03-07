import Command from '../modules/commands/command';
import CommandHandler from './commandHandler';
import CommandResults from '../modules/commands/commandResults';
import ServerFacade from './ServerFacade';
import { FacadeCommand } from '../constants';
import SocketFacade from './SocketFacade';

export default class ServerCommunicator {
  commandHandler: CommandHandler;
  commandMap: Map<string, FacadeCommand>;
  socketConnection: any;

  constructor(socketConnection: any) {
    this.commandHandler = new CommandHandler(ServerFacade.instanceOf());
    this.commandMap = new Map<string, FacadeCommand>();
    this.configureCommandMap();
    this.socketConnection = socketConnection;
  }

  private configureCommandMap = () => {
    const facade = ServerFacade.instanceOf();
    // user commands
    this.commandMap.set('login', facade.login);
    this.commandMap.set('logout', facade.logout);
    this.commandMap.set('register', facade.register);
    this.commandMap.set('getGame', facade.getGame);

    // game lobby commands
    this.commandMap.set('createGame', facade.createGame);
    this.commandMap.set('startGame', facade.startGame);
    this.commandMap.set('joinGame', facade.joinGame);
    this.commandMap.set('deleteGame', facade.deleteGame);
    this.commandMap.set('leaveGame', facade.leaveGame);
    this.commandMap.set('sendMessage', facade.sendMessage);

    this.commandMap.set('getOpenGameList', facade.getOpenGameList);
    this.commandMap.set('getUserGameStatus', facade.getUserGameStatus);
  };

  public handleSocketCommand = (data: any, connection: any) => {
    // TODO implement and test
    const facadeCommand: FacadeCommand | undefined = this.commandMap.get(
      data.methodName
    );

    if (!facadeCommand) {
      connection.emit({
        success: false,
        message: `Invalid request. ${
          data.methodName
        } is not a valid method name.`,
      });
    }

    // set the body's cookie basically
    var reqUserID = connection.handshake.session.lgid || null;
    data.reqUserID = reqUserID;
    // console.log("userCookie");
    // console.log(userCookie);

    var gameID = connection.handshake.session.gmid || null;
    data.gameID = gameID;

    // since we've already checked if facadeCommand is not null, we can force unwrap the optional type
    // using varName!
    let command: Command = new Command(data, facadeCommand!);

    this.commandHandler.execute(command).then((responseData: any) => {
      const commandResults = new CommandResults(responseData);

      if (commandResults.wasSuccessful()) {
        const userCookie = commandResults.shouldSetSession();
        if (userCookie == '') {
          connection.handshake.session.destroy();
        } else if (userCookie) {
          // set sessions
          var sessData = connection.handshake.session;
          sessData.lgid = userCookie;
        }
        connection.emit({
          success: commandResults.wasSuccessful(),
          result: commandResults.getData(),
        });
      } else {
        connection.emit({
          success: commandResults.wasSuccessful(),
          result: commandResults.getData(),
          message: commandResults.getErrorInfo(),
        });
      }
    });
  };

  public handleCommand = (req: any, res: any, next: any): void => {
    if (!this.validateCommandRequest(req, res)) {
      return;
    }

    const facadeCommand: FacadeCommand | undefined = this.commandMap.get(
      req.body.methodName
    );

    if (!facadeCommand) {
      res
        .json({
          success: false,
          message: `Invalid request. ${
            req.body.methodName
          } is not a valid method name.`,
        })
        .status(404);
    }

    // set the body's cookie basically
    var reqGameID = req.session.gmid || null;
    var reqUserID = req.session.lgid || null;
    var body = req.body.data || {};
    body.reqUserID = reqUserID;
    body.reqGameID = reqGameID;

    // debug
    // console.log("userCookie");
    // console.log(userCookie);

    // since we've already checked if facadeCommand is not null,
    // we can force unwrap the optional type using varName!
    let command: Command = new Command(body, facadeCommand!);

    this.commandHandler
      .execute(command)
      .then((responseData: any) => {
        // .then ensures this runs once all promises are fulfilled.
        const commandResults = new CommandResults(responseData);

        if (commandResults.wasSuccessful()) {
          // set and update cookie stuff
          const userCookie = commandResults.shouldSetSession() || {};
          let lgid = userCookie.lgid;
          let gmid = userCookie.gmid;

          if (lgid === '') {
            //expire sess
            var sessData = req.session;
            sessData.lgid = lgid;
            sessData.cookie.expires = new Date(Date.now() - 50000);
            sessData.cookie.maxAge = 1;
          } else if (lgid) {
            // set sessions
            var sessData = req.session;
            sessData.lgid = lgid;
          }

          if (gmid === '') {
            //expire sess
            var sessData = req.session;
            sessData.gmid = gmid;
            sessData.cookie.expires = new Date(Date.now() - 50000);
            sessData.cookie.maxAge = 1;
          } else if (gmid) {
            // set sessions
            var sessData = req.session;
            sessData.gmid = gmid;
          }

          // emit stuff
          const emitRequests = commandResults.shouldEmit();
          if (emitRequests && emitRequests.length > 0) {
            emitRequests.map((emitRequest: any) => {
              if (emitRequest && emitRequest.command) {
                SocketFacade.instanceOf().execute(
                  emitRequest,
                  this.socketConnection
                );
              }
            });
          }

          res.json({
            success: commandResults.wasSuccessful(),
            result: commandResults.getData(),
          });
        } else {
          res
            .json({
              success: commandResults.wasSuccessful(),
              result: commandResults.getData(),
              message: commandResults.getErrorInfo(),
            })
            .status(400);
        }
      })
      .catch(err => {
        console.log(err);
        res
          .json({
            success: false,
            message: 'Backend error',
            detailedMessage: err.toString(),
          })
          .status(500);
      });
  };

  private validateCommandRequest(req: any, res: any): boolean {
    if (req.body.methodName == null) {
      res
        .json({
          success: false,
          message: `Invalid request. executeCommand requires parameter 'methodName'.`,
          // message: `Invalid request. executeCommand requires parameter "methodName", where "methodName" is one of "toLowerCase", "trim", or "parseInt".`,
        })
        .status(404);
      return false;
    }

    // TODO do other checks

    return true;
  }
}
