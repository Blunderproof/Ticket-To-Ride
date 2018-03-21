import CommandResults from '../../modules/commands/CommandResults';
import { Message } from '../../models/Message';
import { MessageType } from '../../constants';
import { User } from '../../models/User';
import { Game } from '../../models/Game';

export default class GameFacade {
	private constructor() {}

	private static instance = new GameFacade();
	static instanceOf() {
		if (!this.instance) {
			this.instance = new GameFacade();
		}
		return this.instance;
	}

	validateUserAuth(data: any) {
		console.log(data);
		if (!data.reqUserID) {
			const promise = new Promise((resolve: any, reject: any) => {
				resolve({
					success: false,
					data: {},
					errorInfo: 'User must be logged in to execute this command.'
				});
			});
			return promise;
		} else if (!data.reqGameID) {
			const promise = new Promise((resolve: any, reject: any) => {
				resolve({
					success: false,
					data: {},
					errorInfo:
						'User must have an open game to execute this command.'
				});
			});
			return promise;
		} else {
			return null;
		}
	}

	sendMessage(data: any): Promise<any> {
		let loginCheck: any = null;
		if ((loginCheck = this.validateUserAuth(data)) != null) {
			return loginCheck;
		}
		let newMessage = new Message({
			message: data.message,
			user: data.reqUserID,
			game: data.reqGameID,
			type: MessageType.Chat
		});

		return newMessage.save().then(message => {
			return {
				success: true,
				data: {},
				emit: [
					{
						command: 'updateChatHistory',
						data: { id: data.reqGameID },
						to: data.reqGameID
					}
				]
			};
		});
	}

	// implement
	async initialSelectDestinationCard(data: any): Promise<any> {
		let loginCheck: any = null;
		if ((loginCheck = this.validateUserAuth(data)) != null) {
			return loginCheck;
		}

		if (!data.discardCards) {
			const promise = new Promise((resolve: any, reject: any) => {
				resolve({
					success: false,
					data: {},
					errorInfo: "Request is missing parameter 'discardCards'."
				});
			});
			return promise;
		} else if (data.discardCards.length > 1) {
			const promise = new Promise((resolve: any, reject: any) => {
				resolve({
					success: false,
					data: {},
					errorInfo:
						'You must choose two or three destination cards to keep.'
				});
			});
			return promise;
		}

		let game = await Game.findOne({ _id: data.reqGameID });

		if (!game) {
			return {
				success: false,
				data: {},
				errorInfo: "That game doesn't exist."
			};
		}
		// force unwrap game
		let unwrappedGame = game!;

		if (unwrappedGame.turnNumber >= 0) {
			return {
				success: false,
				data: {},
				errorInfo:
					'The game has already been initialized and all users have performed their initial card selection!'
			};
		} else if (unwrappedGame.playersReady.indexOf(data.reqUserID) >= 0) {
			return {
				success: false,
				data: {},
				errorInfo: 'You already performed your initial card selection!'
			};
		}

		return User.findOne({ _id: data.reqUserID }).then(async user => {
			if (!user) {
				return {
					success: false,
					data: {},
					errorInfo: "That user doesn't exist."
				};
			}

			if (data.discardCards.length == 0) {
				// pass
			} else {
				// unpopulated so we're just comparing ids
				user.destinationCardHand = user.destinationCardHand.filter(
					function(i) {
						return data.discardCards.indexOf(i.toString()) < 0;
					}
				);

				// the only amount that we could subtract is by 1! so length should be 2.
				// if it's not 2, then the discardCard submitted wasn't in the users hand.
				// this is sorta strange way to do it, but whatever. it's as good as checking it before.
				if (user.destinationCardHand.length != 2) {
					return {
						success: false,
						data: {},
						errorInfo:
							"The card you submitted to discard isn't in your hand."
					};
				}

				for (let index = 0; index < data.discardCards.length; index++) {
					const element = data.discardCards[index];
					unwrappedGame.destinationCardDiscardPile.push(element);
				}
			}

			unwrappedGame.playersReady.push(user._id);
			if (
				unwrappedGame.playersReady.length ==
				unwrappedGame.userList.length
			) {
				unwrappedGame.turnNumber = 0;
			}

			await unwrappedGame.save();

			return user.save().then(savedUser => {
				return {
					success: true,
					data: {},
					gameHistory: `selected ${
						savedUser.destinationCardHand.length
					} destination cards.`,
					emit: [
						{
							command: 'updateGameState',
							data: { id: data.reqGameID },
							room: data.reqGameID
						}
					]
				};
			});
		});
	}

	// async selectDestinationCard(data: any): Promise<any> {
	//   let loginCheck: any = null;
	//   if ((loginCheck = this.validateUserAuth(data)) != null) {
	//     return loginCheck;
	//   }

	//   let game = await Game.findOne({ _id: data.reqGameID });

	//   if (!game) {
	//     return {
	//       success: false,
	//       data: {}
	//     }
	//   }
	//   // force unwrap game
	//   let unwrappedGame = game!;

	//   return User.findOne({ user: data.reqUserID }).then(async user => {
	//     if (!user) {
	//       return {
	//         success: false,
	//         data: {},
	//         errorInfo: "That user doesn't exist.",
	//       };
	//     }

	//     let top3 = game.destinationCardDeck.slice(2);

	//     let discard = top3.filter(function(cardID) {
	//       return data.keepCards.indexOf(cardID.toString()) < 0;
	//     });
	//     let keep = top3.filter(function(cardID) {
	//       return data.keepCards.indexOf(cardID.toString()) >= 0;
	//     });

	//     // unpopulated so we're just comparing ids
	//     for (let index = 0; index < keep.length; index++) {
	//       const element = keep[index];
	//       user.destinationCardHand.push(element);
	//     }

	//     // add the game
	//     game.destinationCardDeck = game.destinationCardDeck.filter(function(
	//       cardID
	//     ) {
	//       return discard.indexOf(cardID.toString()) < 0;
	//     });

	// for (let index = 0; index < discard.length; index++) {
	//   const element = discard[index];
	//   unwrappedGame.destinationCardDiscardPile.push(element);
	// }

	//     // remove the cards from the deck
	//     game.destinationCardDeck.splice(0, 3);
	//     await game.save();

	//     return user.save().then(savedUser => {
	//       return {
	//         success: true,
	//         data: {},
	//         emit: [
	//           {
	//             command: 'updateGameState',
	//             data: { id: data.reqGameID },
	//             room: data.reqGameID,
	//             gameHistory: `selected ${
	//                savedUser.destinationCardHand.length
	//             } destination cards.`,
	//           },
	//         ],
	//       };
	//     });
	//   });
	// }

	claimRoute(data: any): Promise<any> {
		return Game.findById(data.reqGameID).then(async game => {
			if (!game) {
				return {
					success: false
				};
			}
			game = game!;
			game.turnNumber++;
			//game.turnNumber %= game.userList.length;

			return game.save().then(savedGame => {
				return {
					success: true,
					emit: [
						{
							command: 'updateGameState',
							data: { id: savedGame._id },
							room: savedGame._id
						}
					]
				};
			});
		});
	}

	chooseDestinationCard(data: any): Promise<any> {
		return Game.findById(data.reqGameID).then(async game => {
			if (!game) {
				return {
					success: false
				};
			}
			game = game!;
			game.turnNumber++;
			//game.turnNumber %= game.userList.length;

			return game.save().then(savedGame => {
				return {
					success: true,
					emit: [
						{
							command: 'updateGameState',
							data: { id: savedGame._id },
							room: savedGame._id
						}
					]
				};
			});
		});
	}

	chooseTrainCard(data: any): Promise<any> {
		return Game.findById(data.reqGameID).then(async game => {
			if (!game) {
				return {
					success: false
				};
			}
			game = game!;
			game.turnNumber++;
			//game.turnNumber %= game.userList.length;

			return game.save().then(savedGame => {
				return {
					success: true,
					emit: [
						{
							command: 'updateGameState',
							data: { id: savedGame._id },
							room: savedGame._id
						}
					]
				};
			});
		});
	}
}
