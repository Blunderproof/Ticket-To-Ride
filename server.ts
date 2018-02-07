import * as bodyParser from "body-parser";
import * as express from "express";
import * as mongoose from "mongoose";
import * as morgan from "morgan";
import * as session from "express-session";
import * as socket from "socket.io";

import * as path from "path";
import * as http from "http";
import * as colors from "colors/safe";

import ServerCommunicator from "./routes/ServerCommunicator";
import { EXPRESS_SECRET, MAX_COOKIE_AGE } from "./constants";

export class Server {
  app: any;
  port: string;
  server: any;
  router: any;
  db: any;
  io:any;
  db_name: string;
  communicator: ServerCommunicator;

  private static instance = new Server();

  private constructor() {
    this.port = "3000";
    this.db_name = "tickettoride";
    this.communicator = new ServerCommunicator();
    this.config();
    this.routes();
    this.sockets();
    this.init_db();
  }

  static instanceOf() {
    if (!this.instance) {
      this.instance = new Server();
    }
    return this.instance;
  }

  config() {
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(
      bodyParser.urlencoded({
        extended: false,
      })
    );
    this.app.use(morgan("dev"));
    this.app.use(express.static(path.join(__dirname, "public")));
    this.app.use(function(req: any, res: any, next: any) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      next();
    });

    this.app.use(
      session({ secret: EXPRESS_SECRET, cookie: { maxAge: MAX_COOKIE_AGE } })
    );

    this.app.set("port", this.port);
    this.server = http.createServer(this.app);
    this.io = socket(this.server);
    // this.server.listen(this.port);
    this.server.listen(this.port, "10.37.71.246");
    this.server.on("listening", () => {
      var addr = this.server.address();
      var bind =
        typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
      this.msg("Listening on " + bind);
    });
  }

  init_db() {
    mongoose.connect("mongodb://localhost/" + this.db_name);
    this.db = mongoose.connection;
    this.db.on("error", console.error.bind(console, "connection error:"));
    this.db.once("open", () => {
      this.msg("MongoDB Connected");
    });
  }

  sockets() {
    this.io.on("connection",socket => {
      socket.on("command",data => {
        //TODO: connect this to the communicator
      })
    })
  }

  routes(root = "/") {
    this.router = express.Router();
    this.router.post("/execute", this.communicator.handleCommand);
    this.app.use(root, this.router);
  }

  post(root = "/", route: any) {
    this.router.post(root, route);
  }

  get(root = "/", route: any) {
    this.router.get(root, route);
  }

  msg(msg: any, color = "green") {
    console.log((colors as any)[color](msg));
  }
}
