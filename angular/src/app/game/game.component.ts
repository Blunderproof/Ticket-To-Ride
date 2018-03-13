import { Component, OnInit } from '@angular/core';
import { UserInfo } from '../services/user_info.service';
import { User } from '../classes/user';
import { Message } from '../classes/message';
import { MessageType } from '../classes/constants';
import { ServerProxy } from '../services/server_proxy.service';
import { GameHistory } from '../services/game-history.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  historyOpen = true;
  gameStart = false;

  simState = 0;

  constructor(
    private _serverProxy: ServerProxy,
    public _gameHistory: GameHistory,
    public _userInfo: UserInfo
  ) {}

  ngOnInit() {
    this._userInfo.getUser();
    this._userInfo.getGame();
    this.printUserInfo();
  }

  printUserInfo() {
    console.log(this._userInfo);

    console.log('YES');
  }

  simulateChanges() {
    let index = 0;
    let cardIndex = 0;
    switch (this.simState) {
      case 0:
        alert('Changing player points.');
        index = Math.floor(Math.random() * this._userInfo.game.userList.length);
        const score = Math.floor(Math.random() * 50);
        this._userInfo.game.userList[index].score = score;

        alert(
          `Changed player ${
            this._userInfo.game.userList[index].username
          }'s points to ${score}.`
        );
        break;
      case 1:
        alert(`Changing my number of train cards and destination cards.`);
        for (index = 0; index < this._userInfo.game.userList.length; index++) {
          const element = this._userInfo.game.userList[index];
          if (element._id === this._userInfo.user._id) {
            break;
          }
        }
        for (let i = 0; i < 3; i++) {
          // cardIndex = Math.floor(
          //   Math.random() * this._userInfo.game.trainCardDeck.length
          // );
          const card = this._userInfo.game.trainCardDeck.splice(i, 1)[0];
          this._userInfo.user.trainCardCount[
            card.color
            // this._userInfo.game.trainCardDeck[cardIndex].color
          ] += 1;

          this._userInfo.game.userList[index].trainCardHand.push(
            card
          );
        }

        for (let i = 0; i < 2; i++) {
          // cardIndex = Math.floor(
          //   Math.random() * this._userInfo.game.destinationCardDeck.length
          // );
          const card = this._userInfo.game.destinationCardDeck.splice(i, 1)[0];
          this._userInfo.game.userList[index].destinationCardHand.push(
            card
          );
        }
        alert(
          `Changed my train card hand to ${
            this._userInfo.game.userList[index].trainCardHand.length
          } cards and destination card to ${
            this._userInfo.game.userList[index].destinationCardHand.length
          }.`
        );
        break;
      case 2:
        alert(
          `Now changing other user's number of train cards, destination cards, and train car tokens.`
        );

        while (true) {
          index = Math.floor(
            Math.random() * this._userInfo.game.userList.length
          );
          if (this._userInfo.game.userList[index]._id !== this._userInfo.user._id) {
            break;
          }
        }

        for (let i = 0; i < 3; i++) {
          cardIndex = Math.floor(
            Math.random() * this._userInfo.game.trainCardDeck.length
          );
          this._userInfo.game.userList[index].trainCardHand.push(
            this._userInfo.game.trainCardDeck[cardIndex]
          );
        }

        for (let i = 0; i < 4; i++) {
          cardIndex = Math.floor(
            Math.random() * this._userInfo.game.destinationCardDeck.length
          );
          this._userInfo.game.userList[index].destinationCardHand.push(
            this._userInfo.game.destinationCardDeck[cardIndex]
          );
        }

        this._userInfo.game.userList[index].tokenCount = Math.floor(
          Math.random() * 30
        );
        alert(
          `Changed player ${
            this._userInfo.game.userList[index].username
          }'s trainCards to ${
            this._userInfo.game.userList[index].trainCardHand.length
          } and their destination cards to ${
            this._userInfo.game.userList[index].destinationCardHand.length
          } and their train car tokens to ${
            this._userInfo.game.userList[index].tokenCount
          }.`
        );

        break;
      case 3:
        alert(
          `Changing the number of train cards and destination cards in the decks.`
        );

        const destCountToDelete = Math.floor(
          Math.random() * this._userInfo.game.destinationCardDeck.length / 2
        );
        this._userInfo.game.destinationCardDeck.splice(0, destCountToDelete);

        const trainCountToDelete = Math.floor(
          Math.random() * this._userInfo.game.trainCardDeck.length / 2
        );
        this._userInfo.game.trainCardDeck.splice(6, trainCountToDelete);
        alert(
          `Removed ${destCountToDelete} destination cards and ${trainCountToDelete} train cards.`
        );
        break;
      case 4:
        alert('Click a route to claim it');

        break;
      case 5:
        alert('Adding chat message.');

        this._serverProxy.sendMessage('test messsage sent!!').then((x: any) => {
          alert('Chat message sent.');
        });

        break;
      case 6:
        alert(
          'Note how gameHistory was changed upon selecting the destination cards.'
        );

        break;

      default:
        break;
    }

    this.simState += 1;
    // Add claimed route (for any player)
    // Add chat message from any player
    // Add game history entries
  }
}
