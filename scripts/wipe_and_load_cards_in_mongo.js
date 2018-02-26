'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const mongoose = require('mongoose');
const TrainCard = require('../models/TrainCard');
const DestinationCard = require('../models/DestinationCard');
const Route = require('../models/Route');

var Papa = require('papaparse');

let db_name = 'tickettoride';
mongoose.connect('mongodb://localhost/' + db_name);

TrainCard.remove({}).exec();
DestinationCard.remove({}).exec();
Route.remove({}).exec();

var fs = require('fs');
var path = require('path');

// TODO implement

// instantiate topic cards for the game
let contents = fs.readFileSync(__dirname + '/train_cards.csv', 'utf8');

if (contents) {
  var tcresults = Papa.parse(contents, {
    header: true,
    comments: '#',
  });
  tcresults.data.forEach((row, index) => {
    let data = row;
    // TODO color not specified on the csv right now
    data.color = 'white';
    let newCard = new TopicCard.model(data);
    newCard.save();
  });
} else {
  console.log('contents was null for the topic card data');
}

contents = fs.readFileSync(__dirname + '/destination_cards.csv', 'utf8');

const cardTypeMap = {
  '.mp4': MediaCard.MEDIA_CARD_TYPE_VIDEO,
  '.gif': MediaCard.MEDIA_CARD_TYPE_GIF,
  '.jpg': MediaCard.MEDIA_CARD_TYPE_IMAGE,
  '.png': MediaCard.MEDIA_CARD_TYPE_IMAGE,
};

if (contents) {
  var mcresults = Papa.parse(contents, {
    header: true,
    comments: '#',
  });
  mcresults.data.forEach((row, index) => {
    let data = row;
    // set media type based on file passed in
    data.mediaType = cardTypeMap[path.extname(data.mediaURL)];
    let newCard = new MediaCard.model(data);

    newCard.save();
  });
} else {
  console.log('contents was null for the media card data');
}

// instantiate topic cards for the game
let contents = fs.readFileSync(__dirname + '/routes.csv', 'utf8');

if (contents) {
  var tcresults = Papa.parse(contents, {
    header: true,
    comments: '#',
  });
  tcresults.data.forEach((row, index) => {
    let data = row;
    // TODO color not specified on the csv right now
    data.color = 'white';
    let newCard = new TopicCard.model(data);
    newCard.save();
  });
} else {
  console.log('contents was null for the topic card data');
}

console.log('let this sit for a few seconds and it should be done');

// process.exit();
