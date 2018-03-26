import TurnStateObject from './TurnStateObject';
import { IUserModel } from '../User';
import { IRouteModel } from '../Route';
import { TrainColor, TurnState } from '../../constants';
import { IGameModel } from '../Game';

export default class BeginningTurnStateObject implements TurnStateObject {
  user: IUserModel;
  error: string = '';

  constructor(user: IUserModel) {
    this.user = user;
  }

  drawTrainCard(cardIndex: number, game: IGameModel) {
    let trainCardToTake = game.trainCardDeck[cardIndex];
    let nextState = TurnState.OneTrainCardChosen;

    if (cardIndex < 5 && trainCardToTake.color == TrainColor.Rainbow) {
      // face up rainbow train card selected – should set nextState to Beginning and advance turns
      nextState = TurnState.BeginningOfTurn;
      game.turnNumber += 1;
    }

    this.user.turnState = nextState;

    // add card to user's hand, then remove it from game
    this.user.trainCardHand.push(trainCardToTake._id);
    game.trainCardDeck.splice(cardIndex, 1);

    if (game.trainCardDeck.length <= 5 && game.trainCardDiscardPile.length > 0) {
      // TODO refactor our game's init stuff
      game.reshuffleTrainCards();
    }

    // check rainbow cards
    let top5 = game.trainCardDeck.slice(0, 5);

    let rainbowCount = top5.filter(card => {
      return card.color == TrainColor.Rainbow;
    }).length;

    // cut off the 5 front ones
    if (rainbowCount >= 3) {
      console.log('rainboxCount is too high!!');
      game.trainCardDeck = game.trainCardDeck.slice(5);
      game.trainCardDiscardPile = game.trainCardDiscardPile.concat(top5);
    }

    return this.user;
  }

  chooseDestinationCard() {
    // can't choose destination card from Beginning => we set their state when they open the destination card selector
    this.error = 'You have to click on the destination card deck to submit a request to choose destination cards!';
    return null;
  }

  claimRoute(route: IRouteModel, cardColor: TrainColor, game: IGameModel) {
    let userCardsOfColor = this.user.trainCardHand.filter((card, index) => {
      console.log('card', card);
      return card.color == cardColor;
    });

    let userRainbowCards = this.user.trainCardHand.filter((card, index) => {
      return card.color == TrainColor.Rainbow;
    });

    let usingRainbows: boolean = false;
    let difference: number = 0;

    if (userCardsOfColor.length < route.length) {
      difference = route.length - userCardsOfColor.length;
      // if we have enough rainbows to make up the difference
      console.log('difference:', difference);
      if (cardColor != TrainColor.Rainbow && userRainbowCards.length >= difference) {
        // use the rainbows
        usingRainbows = true;
      } else {
        // return error
        this.error = `You don't have enough ${cardColor} cards or wild cards to claim this route.`;
        return null;
      }
    }

    console.log('usingRainbows:', usingRainbows);
    console.log('difference:', difference);

    if (this.user.tokenCount < route.length) {
      this.error = `You don't have enough train tokens to claim this route.`;
      return null;
    }

    // claim route
    this.user.claimedRouteList.push(route._id);
    this.user.tokenCount -= route.length;

    // take only the number of cards required
    let cardsToDiscard = userCardsOfColor.slice(0, route.length);
    console.log('cardsToDiscard');
    console.log(cardsToDiscard);

    if (usingRainbows) {
      // if we need to use rainbows, add also the number of rainbow cards
      cardsToDiscard = cardsToDiscard.concat(userRainbowCards.slice(0, difference));
      console.log('using rainbows, updated cardsToDiscard');
      console.log(cardsToDiscard);
    }
    // map them to ids
    let cardIDsToDiscard = cardsToDiscard.map(card => {
      return card._id.toString();
    });

    console.log('cardIDsToDiscard');
    console.log(cardIDsToDiscard);

    // filter the trainCardHand by cards not in the discard list
    this.user.trainCardHand = this.user.trainCardHand.filter((card, index) => {
      // < 0 means not in the discard list
      return cardIDsToDiscard.indexOf(card._id.toString()) < 0;
    });

    game.trainCardDiscardPile = game.trainCardDiscardPile.concat(cardsToDiscard);

    // remove the route from the unclaimed routes
    let routeIndex = game.unclaimedRoutes.indexOf(route._id);
    game.unclaimedRoutes.splice(routeIndex, 1);
    if (game.userList.length <= 3) {
      // TODO check db for a second route with the same city1 and city2 but opposite routeNumber
      // if it exists, remove it from game.unclaimedRoutes to prevent them from claiming it
    }

    if (game.trainCardDeck.length <= 5 && game.trainCardDiscardPile.length > 0) {
      game.reshuffleTrainCards();
    }

    game.turnNumber++;

    // no need to change state because user is already in BeginningTurnState
    return this.user;
  }

  setChooseDestinationCardState() {
    this.user.turnState = TurnState.ChoosingDestinationCards;
    return this.user;
  }
}
