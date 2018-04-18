import * as fs from 'fs';
import * as Papa from 'papaparse';

export function shuffle(array: any[]) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export function getTrainCards() {
  let contents = fs.readFileSync(__dirname + '/../scripts/train_cards.csv', 'utf8');

  return Papa.parse(contents, {
    header: true,
    comments: '#',
  }).data;
}

export function getDestinationCards() {
  let contents = fs.readFileSync(__dirname + '/../scripts/destination_cards.csv', 'utf8');

  return Papa.parse(contents, {
    header: true,
    comments: '#',
  }).data;
}

export function getRoutes() {
  let contents = fs.readFileSync(__dirname + '/../scripts/routes.csv', 'utf8');

  return Papa.parse(contents, {
    header: true,
    comments: '#',
  }).data;
}
