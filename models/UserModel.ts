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

  constructor(data: any) {
    // console.log('In UserModel constructor, here is data:', data);

    if (data._id == null) {
      // if we're just an ObjectID
      this._id = data.toString();
    } else {
      this._id = data._id.toString();
    }
    this.username = data.username;
    this.hashedPassword = data.hashedPassword;
    this.score = data.score;
    this.tokenCount = data.tokenCount;
    this.turnState = data.turnState;
    this.color = data.color;
    this.longestRoute = data.longestRoute;

    this.points = data.points || {};
    this.claimedRouteList = (data.claimedRouteList || []).map((e: any) => new RouteModel(e));
    this.trainCardHand = (data.trainCardHand || []).map((e: any) => new TrainCardModel(e));
    this.destinationCardHand = (data.destinationCardHand || []).map((e: any) => new DestinationCardModel(e));
    this.metDestinationCards = (data.metDestinationCards || []).map((e: any) => new DestinationCardModel(e));
    this.unmetDestinationCards = (data.unmetDestinationCards || []).map((e: any) => new DestinationCardModel(e));
  }

  // get trainCardCount() {
  //   let counts = {
  //     pink: 0,
  //     black: 0,
  //     green: 0,
  //     blue: 0,
  //     white: 0,
  //     yellow: 0,
  //     orange: 0,
  //     red: 0,
  //     rainbow: 0,
  //   };
  //   for (let i = 0; i < this.trainCardHand.length; i++) {
  //     (counts as any)[this.trainCardHand[i].color!]++;
  //   }
  //   return counts;
  // }

  attachCardCounts(): void {
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
    (this as any).trainCardCount = counts;
  }

  getObject(): any {
    let data = {
      _id: this._id,
      username: this.username,
      hashedPassword: this.hashedPassword,
      claimedRouteList: this.claimedRouteList.map(model => {
        return typeof model == 'string' ? model : model.getObject();
      }),
      trainCardHand: this.trainCardHand.map(model => {
        return typeof model == 'string' ? model : model.getObject();
      }),
      destinationCardHand: this.destinationCardHand.map(model => {
        return typeof model == 'string' ? model : model.getObject();
      }),
      metDestinationCards: this.metDestinationCards.map(model => {
        return typeof model == 'string' ? model : model.getObject();
      }),
      unmetDestinationCards: this.unmetDestinationCards.map(model => {
        return typeof model == 'string' ? model : model.getObject();
      }),
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
    console.log('in user getPrivatePoints');
    return this.destinationCardPoints().then((resolved: any) => {
      this.points.private = resolved.positive;
      return this.points.private;
    });
  }

  async routePoints(): Promise<any> {
    if (!this.claimedRouteList) return 0;

    let points = 0;

    for (let i = 0; i < this.claimedRouteList.length; i++) {
      points += this.claimedRouteList[i].pointValue;
    }
    this.points.detailed.routes = points;
    return points;
  }

  async getLongestRoute(): Promise<any> {
    let LongestRoute = (routes: RouteModel[], city: string | undefined) => {
      let visited: RouteModel[] = [];

      var traverse = (curCity: string): any => {
        let lengths: number[] = [];
        for (var i = 0; i < routes.length; i++) {
          if ((routes[i].city1 == curCity || routes[i].city2 == curCity) && visited.indexOf(routes[i]) === -1) {
            visited.push(routes[i]);
            let newCity = routes[i].city1 == curCity ? routes[i].city2 : routes[i].city1;
            lengths.push(traverse(newCity!) + routes[i].length);
          }
        }
        return lengths.reduce((a, b) => Math.max(a, b), 0);
      };

      return traverse(city!);
    };

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
    console.log('in user destinationCardPoints');
    let depopulate = (arr: any[]) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i]._id;
      }
      return arr;
    };

    let DestinationCardFulfilled = (routes: RouteModel[], destinationCard: DestinationCardModel) => {
      let visited: RouteModel[] = [];

      var traverse = (curCity: string, findCity: string): any => {
        for (var i = 0; i < routes.length; i++) {
          if ((routes[i].city1 == curCity || routes[i].city2 == curCity) && visited.indexOf(routes[i]) === -1) {
            visited.push(routes[i]);
            let newCity = routes[i].city1 == curCity ? routes[i].city2 : routes[i].city1;

            if (newCity === findCity || traverse(newCity!, findCity)) return true;
          }
        }
        return false;
      };

      return traverse(destinationCard.city1!, destinationCard.city2!);
    };

    let points = {
      positive: 0,
      negative: 0,
    };

    if (!this.destinationCardHand) return points;
    console.log('destinationCardHand', this.destinationCardHand);

    if (!this.unmetDestinationCards) this.unmetDestinationCards = [];
    if (!this.metDestinationCards) this.metDestinationCards = [];

    let unmetIDs = this.unmetDestinationCards.map(card => card._id);
    let metIDs = this.metDestinationCards.map(card => card._id);

    for (let i = 0; i < this.destinationCardHand.length; i++) {
      if (unmetIDs.indexOf(this.destinationCardHand[i]._id) == -1 && metIDs.indexOf(this.destinationCardHand[i]._id) == -1) {
        this.unmetDestinationCards.push(this.destinationCardHand[i]);
        unmetIDs.push(this.destinationCardHand[i]._id);
      }
    }

    let remove: any[] = [];
    for (let i = 0; i < this.unmetDestinationCards.length; i++) {
      if (DestinationCardFulfilled(this.claimedRouteList, this.unmetDestinationCards[i])) {
        this.metDestinationCards.push(this.unmetDestinationCards[i]);
        remove.push(this.unmetDestinationCards[i]._id);
      } else {
        points.negative += this.unmetDestinationCards[i].pointValue!;
      }
    }

    for (let i = 0; i < this.metDestinationCards.length; i++) {
      points.positive += this.metDestinationCards[i].pointValue!;
    }

    //depopulate met & unmet destination cards
    this.unmetDestinationCards = this.unmetDestinationCards.filter((e: any) => {
      return remove.indexOf(e._id) === -1;
    });

    this.points.detailed.positiveDestinationCards = points.positive;
    this.points.detailed.negativeDestinationCards = points.negative;

    return points;
  }

  updatePoints(): Promise<any> {
    console.log('in user updatePoints');
    return Promise.all([this.getPublicPoints(), this.getPrivatePoints()]).then(resolved => {
      console.log(resolved);
      this.points.total = resolved[0] + resolved[1] - this.points.detailed.negativeDestinationCards;
      return this.points.total;
    });
  }
}
