import * as mongoose from 'mongoose';
import { Route, IRouteModel } from './Route';
import { TrainCard, ITrainCardModel } from './TrainCard';
import { DestinationCard, IDestinationCardModel } from './DestinationCard';
import { PlayerColor } from '../constants';
import { Schema } from 'mongoose';

export interface IUser {
	username: string;
	hashedPassword: string;
	claimedRouteList: IRouteModel[];
	trainCardHand: ITrainCardModel[];
	destinationCardHand: IDestinationCardModel[];
	points: {
		public: number;
		private: number;
		detailed: {
			routes: number;
			destinationCardPositive: number;
			destinationCardNegative: number;
			longestRoute: number;
		};
	};
	score: number;
	tokenCount: number;
	color: PlayerColor;
}

export interface IUserModel extends IUser, mongoose.Document {}

export var UserSchema: mongoose.Schema = new mongoose.Schema(
	{
		username: { type: String, required: true, index: { unique: true } },
		hashedPassword: { type: String, required: true },
		claimedRouteList: [{ type: Schema.Types.ObjectId, ref: 'Route' }],
		trainCardHand: [{ type: Schema.Types.ObjectId, ref: 'TrainCard' }],
		destinationCardHand: [
			{ type: Schema.Types.ObjectId, ref: 'DestinationCard' }
		],
		score: Number,
		tokenCount: Number,
		color: String
	},
	{
		toObject: { virtuals: true },
		toJSON: { virtuals: true }
	}
);

UserSchema.virtual('points.public').get(function(this: IUserModel) {
	return this.get('detailed.routes') + this.get('detailed.longestRoute');
});

UserSchema.virtual('points.private').get(function(this: IUserModel) {
	return (
		this.get('detailed.destinationCardNegative') +
		this.get('detailed.destinationCardPositive')
	);
});

UserSchema.virtual('detailed.routes').get(async function(this: IUserModel) {
	if (!this.claimedRouteList) return 0;

	let points = 0;
	let routes = await this.populate('claimedRouteList').execPopulate();
	for (let i = 0; i < this.claimedRouteList.length; i++) {
		points += this.claimedRouteList[i].pointValue;
	}
	return points;
});

UserSchema.virtual('detailed.destinationCardNegative').get(function(
	this: IUserModel
) {
	return 0;
});

UserSchema.virtual('detailed.destinationCardPositive').get(function(
	this: IUserModel
) {
	return 0;
});

UserSchema.virtual('detailed.longestRoute').get(function(this: IUserModel) {
	return 0;
});

UserSchema.virtual('trainCardCount').get(function(this: IUserModel) {
	let counts = {
		pink: 0,
		black: 0,
		green: 0,
		blue: 0,
		white: 0,
		yellow: 0,
		orange: 0,
		red: 0,
		rainbow: 0
	};
	for (let i = 0; i < this.trainCardHand.length; i++) {
		(counts as any)[this.trainCardHand[i].color]++;
	}
	return counts;
});

export const User: mongoose.Model<IUserModel> = mongoose.model<IUserModel>(
	'User',
	UserSchema
);
