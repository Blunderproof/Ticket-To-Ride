import TurnStateObject from './TurnStateObject';
import { IUserModel } from '../User';
import { IRouteModel } from '../Route';
import { TrainColor } from '../../constants';

export default class BeginningTurnStateObject implements TurnStateObject {
  user: IUserModel;
  error: string = '';

  constructor(user: IUserModel) {
    this.user = user;
  }

  drawTrainCard() {
    // TODO implement
    this.error = 'not implemented yet but will be';
    return null;
  }

  chooseDestinationCard() {
    // can't choose destination card from Beginning => we set their state when they open the destination card selector
    this.error = 'You have to click on the destination card deck to submit a request to choose destination cards!';
    return null;
  }

  claimRoute(route: IRouteModel, cardColor: TrainColor) {
    // TODO update this to allow rainbows.
    let userCardsOfColor = this.user.trainCardHand.filter((card, index) => {
      card.color == cardColor;
    });

    let usingRainbows: boolean = false;
    if (userCardsOfColor.length < route.length) {
      // check rainbows – if enough, go for it
      this.error = `You don't have enough ${cardColor} cards to claim this route.`;
      return null;
    }

    if (this.user.tokenCount < route.length) {
      this.error = `You don't have enough train tokens to claim this route.`;
      return null;
    }

    // claim route
    this.user.claimedRouteList.push(route._id);
    this.user.tokenCount -= route.length;

    // take only the number of cards required
    let cardsToDiscard = userCardsOfColor.slice(0, route.length);
    // map them to ids
    let cardIDsToDiscard = cardsToDiscard.map(card => {
      card._id;
    });

    // filter the trainCardHand by cards not in the discard list
    this.user.trainCardHand = this.user.trainCardHand.filter((card, index) => {
      // < 0 means not in the discard list
      return cardIDsToDiscard.indexOf(card._id) < 0;
    });

    // no need to change state because user is already in BeginningTurnState
    return this.user;
  }
}
