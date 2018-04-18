import { USER_TABLE_NAME } from '../../constants';
import { UserModel } from '../../models/UserModel';
import { DynamoHelpers } from './DynamoDAOHelpers';
import IUserDAO from '../IUserDAO';

export class DynamoUserDAO extends DynamoHelpers implements IUserDAO {
  constructor() {
    super();
  }

  findOne(query: any, populates: any[]): Promise<UserModel | null> {
    var params = {
      TableName: USER_TABLE_NAME,
    };

    return new Promise((yes, no) => {
      this.dbClient.scan(params, (err, data) => {
        if (err) {
          no(err);
        } else {
          let results = this.query(data.Items!, query);
          yes(new UserModel(results[0]));
        }
      });
    });
  }
  remove(data: any): Promise<void> {
    var params = {
      TableName: USER_TABLE_NAME,
      Key: data,
    };

    return new Promise((yes, no) => {
      this.dbClient.delete(params, (err, data) => {
        if (err) {
          no(err);
        } else {
          yes();
        }
      });
    });
  }
  create(user: any): Promise<UserModel> {
    user._id = this.new_id();
    return this.save(user);
  }
  save(user: UserModel): Promise<UserModel> {
    let params = {
      Item: user,
      TableName: USER_TABLE_NAME,
    };

    return new Promise((yes, no) => {
      this.dbClient.put(params, (err, data) => {
        if (err) {
          no(err);
        } else {
          yes(new UserModel(data.Attributes));
        }
      });
    });
  }
}
