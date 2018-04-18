var AWS = require('aws-sdk');

let GAME_TABLE_NAME = 'game';
let USER_TABLE_NAME = 'user';

var serviceConfigOptions = {
  region: 'us-east-1',
  endpoint: 'http://localhost:8000',
};
var db = new AWS.DynamoDB(serviceConfigOptions);

let game_table = {
  TableName: GAME_TABLE_NAME,
};
let user_table = {
  TableName: USER_TABLE_NAME,
};

db.deleteTable(game_table, (err, data) => {
  if (!err) console.log('game table deleted');
});
db.deleteTable(user_table, (err, data) => {
  if (!err) console.log('user table deleted');
});
