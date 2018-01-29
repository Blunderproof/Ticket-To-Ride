import * as bodyParser from "body-parser";
import * as express from "express";
import * as mongoose from "mongoose";
import * as morgan from "morgan";
import * as path from "path";
import * as http from "http";
import * as colors from "colors/safe";

export class Server {
    
    app: any;
    port: string;
    server: any;
    router: any;
    db: any;
    db_name: string;
    private static instance = new Server();
    
    private constructor() {
        this.port = '3000';
        this.db_name = "tickettoride";
        this.config();
        this.routes();
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
        this.app.use(bodyParser.urlencoded({
            extended: false
        }));
        this.app.use(morgan("dev"));
        this.app.use(express.static(path.join(__dirname,'public')));
        this.app.use(function (req:any, res:any, next:any) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        this.app.set('port',this.port);
        this.server = http.createServer(this.app);
        this.server.listen(this.port);
        this.server.on('listening', () => {
            var addr = this.server.address();
            var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
            this.msg('Listening on ' + bind);
        });
    }
    
    init_db() {
        mongoose.connect("mongodb://localhost/" + this.db_name);
        this.db = mongoose.connection;
        this.db.on('error', console.error.bind(console, 'connection error:'));
        this.db.once('open', () => {
            this.msg("MongoDB Connected")
        });
    }
    
    routes(root = '/') {
        this.router = express.Router();
        this.app.use(root,this.router);
    }
    
    post(root = '/', route: any) {
        this.router.post(root,route);
    }
    
    get(root = '/', route: any) {
        this.router.get(root,route);
    }
    
    msg(msg:any,color="green") {
        console.log((colors as any)[color](msg));
    }
}
