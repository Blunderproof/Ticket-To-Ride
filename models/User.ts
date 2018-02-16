import * as mongoose from "mongoose";

// TODO put this in another file?
export interface IUser {
  username: string;
  hashedPassword: string;
}

export interface IUserModel extends IUser, mongoose.Document {}

export var UserSchema: mongoose.Schema = new mongoose.Schema({
  username: { type: String, required: true, index: { unique: true } },
  hashedPassword: { type: String, required: true },
});

export const User: mongoose.Model<IUserModel> = mongoose.model<IUserModel>(
  "User",
  UserSchema
);
