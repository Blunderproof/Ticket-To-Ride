import { RouteModel } from './RouteModel';
import { TrainCardModel } from './TrainCardModel';
import { DestinationCardModel } from './DestinationCardModel';
import { TurnState, PlayerColor } from '../constants';
import TurnStateObjectLoader from './user-states/TurnStateObjectLoader';
import TurnStateObject from './user-states/TurnStateObject';

export class UserModel {
  _id?: string;
  username?: string;
  hashedPassword?: string;
  claimedRouteList: RouteModel[];
  trainCardHand: TrainCardModel[];
  destinationCardHand: DestinationCardModel[];
  metDestinationCards: DestinationCardModel[];
  unmetDestinationCards: DestinationCardModel[];
  score?: number;
  tokenCount?: number;
  turnState?: TurnState;
  color?: PlayerColor;
  points: {
    public: number;
    private: number;
    total: number;
    detailed: {
      routes: number;
      longestRoute: number;
      positiveDestinationCards: number;
      negativeDestinationCards: number;
    };
  };
  longestRoute?: number;

  constructor(data?: any) {
    Object.keys(data || {}).forEach(k => ((this as any)[k] = data[k]));

    this.points = data.points || {};
    this.claimedRouteList = (data.claimedRouteList || []).map((e: any) => new RouteModel(e));
    this.trainCardHand = (data.trainCardHand || []).map((e: any) => new TrainCardModel(e));
    this.destinationCardHand = (data.destinationCardHand || []).map((e: any) => new DestinationCardModel(e));
    this.metDestinationCards = (data.metDestinationCards || []).map((e: any) => new DestinationCardModel(e));
    this.unmetDestinationCards = (data.unmetDestinationCards || []).map((e: any) => new DestinationCardModel(e));
  }

  get trainCardCount() {
    let counts = {
      pink: 0,
      black: 0,
      green: 0,
      blue: 0,
      white: 0,
      yellow: 0,
      orange: 0,
      red: 0,
      rainbow: 0,
    };
    for (let i = 0; i < this.trainCardHand.length; i++) {
      (counts as any)[this.trainCardHand[i].color!]++;
    }
    return counts;
  }

  getObject(): any {
    let data = {
      username: this.username,
      hashedPassword: this.hashedPassword,
      claimedRouteList: this.claimedRouteList,
      trainCardHand: this.trainCardHand,
      destinationCardHand: this.destinationCardHand,
      metDestinationCards: this.metDestinationCards,
      unmetDestinationCards: this.unmetDestinationCards,
      score: this.score,
      tokenCount: this.tokenCount,
      turnState: this.turnState,
      color: this.color,
      points: this.points,
      longestRoute: this.longestRoute,
    };
    return data;
  }

  getPublicPoints(): Promise<any> {
    return this.routePoints().then((resolve: any) => {
      this.points.public = resolve + this.points.detailed.longestRoute;
      return this.points.public;
    });
  }

  getPrivatePoints(): Promise<any> {
    return this.destinationCardPoints().then((resolved: any) => {
      this.points.private = resolved.positive;
      return this.points.private;
    });
  }

  async routePoints(): Promise<any> {
    if (!this.claimedRouteList) return 0;

    let points = 0;
    await this.populate('claimedRouteList').execPopulate();
    for (let i = 0; i < this.claimedRouteList.length; i++) {
      points += this.claimedRouteList[i].pointValue;
    }
    this.points.detailed.routes = points;
    return points;
  }

  async getLongestRoute(): Promise<any> {
    let LongestRoute = (routes: RouteModel[], city: string | undefined) => {
      let visited: RouteModel[] = [];

      var traverse = (curCity: string | undefined): any => {
        let lengths: number[] = [];
        for (var i = 0; i < routes.length; i++) {
          if ((routes[i].city1 == curCity || routes[i].city2 == curCity) && visited.indexOf(routes[i]) === -1) {
            visited.push(routes[i]);
            let newCity = routes[i].city1 == curCity ? routes[i].city2 : routes[i].city1;
            lengths.push(traverse(newCity) + routes[i].length);
          }
        }
        return lengths.reduce((a, b) => Math.max(a, b), 0);
      };

      return traverse(city);
    };

    await this.populate('claimedRouteList').execPopulate();
    let lengths: number[] = [];

    for (let i = 0; i < this.claimedRouteList.length; i++) {
      lengths.push(LongestRoute(this.claimedRouteList, this.claimedRouteList[i].city1));
      lengths.push(LongestRoute(this.claimedRouteList, this.claimedRouteList[i].city2));
    }
    let max = lengths.reduce((a, b) => Math.max(a, b), 0);
    this.longestRoute = max;

    return max;
  }

  getTurnStateObject(): TurnStateObject {
    return TurnStateObjectLoader.instanceOf().createStateObject(this)!;
  }

  async destinationCardPoints(): Promise<any> {
    let depopulate = (arr: any[]) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i]._id;
      }
      return arr;
    };

    let DestinationCardFulfilled = (routes: RouteModel[], destinationCard: DestinationCardModel) => {
      let visited: RouteModel[] = [];

      var traverse = (curCity: string | undefined, findCity: string | undefined): any => {
        for (var i = 0; i < routes.length; i++) {
          if ((routes[i].city1 == curCity || routes[i].city2 == curCity) && visited.indexOf(routes[i]) === -1) {
            visited.push(routes[i]);
            let newCity = routes[i].city1 == curCity ? routes[i].city2 : routes[i].city1;

            if (newCity === findCity || traverse(newCity, findCity)) return true;
          }
        }
        return false;
      };

      return traverse(destinationCard.city1, destinationCard.city2);
    };

    let points = {
      positive: 0,
      negative: 0,
    };

    if (!this.destinationCardHand) return points;

    if (!this.unmetDestinationCards) this.unmetDestinationCards = [];
    if (!this.metDestinationCards) this.metDestinationCards = [];

    for (let i = 0; i < this.destinationCardHand.length; i++) {
      if (this.unmetDestinationCards.indexOf(this.destinationCardHand[i]) == -1 && this.metDestinationCards.indexOf(this.destinationCardHand[i]) == -1) {
        this.unmetDestinationCards.push(this.destinationCardHand[i]);
      }
    }

    let remove: any[] = [];
    await this.populate('unmetDestinationCards').execPopulate();
    await this.populate('claimedRouteList').execPopulate();
    for (let i = 0; i < this.unmetDestinationCards.length; i++) {
      if (DestinationCardFulfilled(this.claimedRouteList, this.unmetDestinationCards[i])) {
        this.metDestinationCards.push(this.unmetDestinationCards[i]);
        remove.push(this.unmetDestinationCards[i]._id);
      } else {
        points.negative += this.unmetDestinationCards[i].pointValue!;
      }
    }

    await this.populate('metDestinationCards').execPopulate();

    for (let i = 0; i < this.metDestinationCards.length; i++) {
      points.positive += this.metDestinationCards[i].pointValue!;
    }

    //depopulate met & unmet destination cards
    this.unmetDestinationCards = depopulate(this.unmetDestinationCards);
    this.metDestinationCards = depopulate(this.metDestinationCards);
    this.claimedRouteList = depopulate(this.claimedRouteList);
    this.unmetDestinationCards = this.unmetDestinationCards.filter((e: any) => {
      return remove.indexOf(e) === -1;
    });

    this.points.detailed.positiveDestinationCards = points.positive;
    this.points.detailed.negativeDestinationCards = points.negative;

    return points;
  }

  updatePoints(): Promise<any> {
    return Promise.all([this.getPublicPoints(), this.getPrivatePoints()]).then(resolved => {
      this.points.total = resolved[0] + resolved[1] - this.points.detailed.negativeDestinationCards;
      return this.points.total;
    });
  }
}
