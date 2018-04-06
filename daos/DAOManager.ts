import { IDAO } from './IDAO';

class DAOSingleton {
  private _dao?: IDAO;

  constructor() {
    this._dao = undefined;
  }
  set dao(val: any) {
    if (val) {
      this._dao = val;
    }
  }
  get dao() {
    return this._dao;
  }
}

let DAOManager = new DAOSingleton();
export { DAOManager };
