'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const mongoose = require('mongoose');
const TrainCard = require('../dist/models/TrainCard').TrainCard;
const DestinationCard = require('../dist/models/DestinationCard').DestinationCard;
const Route = require('../dist/models/Route').Route;

var Papa = require('papaparse');

let db_name = 'tickettoride';
mongoose.connect('mongodb://localhost/' + db_name);

var fs = require('fs');
var path = require('path');


var promise1 = TrainCard.remove({})
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
          let newCard = new TrainCard(row);
          newCard.save();
        }
      });
    } else {
      console.log('contents was null for the train card data');
    }
    console.log("Train Cards Done")
  });

  var promise2 = DestinationCard.remove({})
  .then(() => {
    let contents = fs.readFileSync(
      __dirname + '/destination_cards.csv',
      'utf8'
    );

    if (contents) {
      var destinationCardResults = Papa.parse(contents, {
        header: true,
        comments: '#',
      });
      destinationCardResults.data.forEach((row, index) => {
        let newCard = new DestinationCard(row);
        newCard.save();
      });
    } else {
      console.log('contents was null for the destination card data');
    }
    console.log("Destination Cards Done")
  });

var promise3 = Route.remove({})
  .then(() => {
    // instantiate routes
    let contents = fs.readFileSync(__dirname + '/routes.csv', 'utf8');

    if (contents) {
      var routeResults = Papa.parse(contents, {
        header: true,
        comments: '#',
      });
      routeResults.data.forEach((row, index) => {
        let newRoute = new Route(row);
        newRoute.save();
      });
    } else {
      console.log('contents was null for the route data');
    }
    console.log("Route Cards Done")
  });


  Promise.all([promise1,promise2,promise3]).then(all => {
    console.log("All Cards Loaded")
    process.exit();
  })