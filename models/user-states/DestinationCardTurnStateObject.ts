import TurnStateObject from './TurnStateObject';
import { TrainColor, TurnState } from '../../constants';
import { UserModel } from '../UserModel';
import { GameModel } from '../GameModel';
import { DestinationCardModel } from '../DestinationCardModel';
import { RouteModel } from '../RouteModel';

export default class DestinationCardTurnStateObject implements TurnStateObject {
  user: UserModel;
  error: string = '';

  constructor(user: UserModel) {
    this.user = user;
  }

  drawTrainCard(cardIndex: number, game: GameModel) {
    // can't choose train cards after choosing to select destination cards
    this.error = "You can't choose train cards after viewing destination cards!";
    return null;
  }

  chooseDestinationCard(keepCards: Array<string>, game: GameModel) {
    let top3 = game.destinationCardDeck.slice(0, 3);

    let discard = top3.filter(function(card: DestinationCardModel) {
      return keepCards.indexOf(card._id.toString()) < 0;
    });

    let keep = top3.filter(function(card: DestinationCardModel) {
      return keepCards.indexOf(card._id.toString()) >= 0;
    });

    this.user.destinationCardHand = this.user.destinationCardHand.concat(keep);
    game.destinationCardDiscardPile = game.destinationCardDiscardPile.concat(discard);
    game.destinationCardDeck = game.destinationCardDeck.splice(3);

    if (game.destinationCardDeck.length == 0 && game.destinationCardDiscardPile.length > 0) {
      game.reshuffleDestinationCards();
    }

    this.user.turnState = TurnState.BeginningOfTurn;
    game.turnNumber += 1;

    return this.user;
  }

  claimRoute(route: RouteModel, cardColor: TrainColor, game: GameModel) {
    // can't claim route after viewing destination cards
    this.error = "You can't claim routes after viewing destination cards!";
    return null;
  }

  setChooseDestinationCardState() {
    this.error = "You can't set choose destination card state if you're already in it!";
    return null;
  }
}
