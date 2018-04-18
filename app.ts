import { Server } from './server';
process.on('unhandledRejection', r => console.log(r));
let s: Server = Server.instanceOf();
