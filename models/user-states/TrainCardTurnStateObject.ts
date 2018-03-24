import TurnStateObject from './TurnStateObject';
import { IUserModel } from '../User';
import { IRouteModel } from '../Route';
import { TrainColor, TurnState } from '../../constants';
import { IGameModel } from '../Game';

export default class TrainCardTurnStateObject implements TurnStateObject {
  user: IUserModel;
  error: string = '';

  constructor(user: IUserModel) {
    this.user = user;
  }

  drawTrainCard(cardIndex: number, game: IGameModel) {
    let trainCardToTake = game.trainCardDeck[cardIndex];
    this.user.turnState = TurnState.BeginningOfTurn;

    if (cardIndex < 5 && trainCardToTake.color == TrainColor.Rainbow) {
      // face up rainbow train card selected – should set nextState to Beginning and advance turns
      this.error = "You can't select a face-up rainbow card for your second train card.";
      return null;
    }

    // add card to user's hand, then remove it from game's deck
    this.user.trainCardHand.push(trainCardToTake);
    game.trainCardDeck.splice(cardIndex, 1);

    game.turnNumber++;

    if (game.trainCardDeck.length <= 5 && game.trainCardDiscardPile.length > 0) {
      // TODO refactor our game's init stuff
      game.reshuffleTrainCards();
    }
    return this.user;
  }

  chooseDestinationCard() {
    // can't choose destination cards after choosing one train card
    this.error = "You can't choose destination cards after choosing a train card!";
    return null;
  }

  claimRoute(route: IRouteModel, cardColor: TrainColor, game: IGameModel) {
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
