import TurnStateObject from './TurnStateObject';
import { TrainColor, TurnState } from '../../constants';
import { GameModel } from '../GameModel';
import { UserModel } from '../UserModel';
import { RouteModel } from '../RouteModel';

export default class TrainCardTurnStateObject implements TurnStateObject {
  user: UserModel;
  error: string = '';

  constructor(user: UserModel) {
    this.user = user;
  }

  drawTrainCard(cardIndex: number, game: GameModel) {
    let trainCardToTake = game.trainCardDeck[cardIndex];
    this.user.turnState = TurnState.BeginningOfTurn;

    if (cardIndex < 5 && trainCardToTake.color == TrainColor.Rainbow) {
      // face up rainbow train card selected – should set nextState to Beginning and advance turns
      this.error = "You can't select a face-up rainbow card for your second train card.";
      return null;
    }

    // add card to user's hand, then remove it from game's deck
    this.user.trainCardHand.push(trainCardToTake);

    let indexToReplace = cardIndex == 5 ? 6 : 5;
    let cardToReplace = game.trainCardDeck.splice(indexToReplace, 1);

    if (cardToReplace.length > 0) {
      game.trainCardDeck.splice(cardIndex, 1, cardToReplace[0]);
    } else {
      game.trainCardDeck.splice(cardIndex, 1);
    }

    game.turnNumber!++;

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
    // can't choose destination cards after choosing one train card
    this.error = "You can't choose destination cards after choosing a train card!";
    return null;
  }

  claimRoute(route: RouteModel, cardColor: TrainColor, game: GameModel) {
    // can't claim route after choosing one train card
    this.error = "You can't claim a route after choosing a train card!";
    return null;
  }

  setChooseDestinationCardState() {
    // can't set choose destination card state if you've taken a train card
    this.error = "You can't set choose destination card state if you've taken a train card!";
    return null;
  }
}
