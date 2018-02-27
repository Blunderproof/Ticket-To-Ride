'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const mongoose = require('mongoose');
const TrainCard = require('../models/TrainCard');
const DestinationCard = require('../models/DestinationCard');
const Route = require('../models/Route');

var Papa = require('papaparse');

let db_name = 'tickettoride';
mongoose.connect('mongodb://localhost/' + db_name);

var fs = require('fs');
var path = require('path');

TrainCard.remove({})
  .exec()
  .then(() => {
    // instantiate train cards for the game
    let contents = fs.readFileSync(__dirname + '/train_cards.csv', 'utf8');

    if (contents) {
      var trainCardResults = Papa.parse(contents, {
        header: true,
        comments: '#',
      });
      trainCardResults.data.forEach((row, index) => {
        for (let index = 0; index < row.numberToCreate; index++) {
          let newCard = new TrainCard.model(row);
          newCard.save();
        }
      });
    } else {
      console.log('contents was null for the train card data');
    }
  });

DestinationCard.remove({})
  .exec()
  .then(() => {
    let contents = fs.readFileSync(
      __dirname + '/destination_cards.csv',
      'utf8'
    );

    const cardTypeMap = {
      '.mp4': MediaCard.MEDIA_CARD_TYPE_VIDEO,
      '.gif': MediaCard.MEDIA_CARD_TYPE_GIF,
      '.jpg': MediaCard.MEDIA_CARD_TYPE_IMAGE,
      '.png': MediaCard.MEDIA_CARD_TYPE_IMAGE,
    };

    if (contents) {
      var destinationCardResults = Papa.parse(contents, {
        header: true,
        comments: '#',
      });
      destinationCardResults.data.forEach((row, index) => {
        let newCard = new DestinationCard.model(row);
        newCard.save();
      });
    } else {
      console.log('contents was null for the destination card data');
    }
  });

Route.remove({})
  .exec()
  .then(() => {
    // instantiate routes
    let contents = fs.readFileSync(__dirname + '/routes.csv', 'utf8');

    if (contents) {
      var routeResults = Papa.parse(contents, {
        header: true,
        comments: '#',
      });
      routeResults.data.forEach((row, index) => {
        let newRoute = new Route.model(row);
        newRoute.save();
      });
    } else {
      console.log('contents was null for the route data');
    }
  });

console.log('let this sit for a few seconds and it should be done');

// process.exit();
