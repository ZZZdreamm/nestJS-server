import { Inject, forwardRef } from '@nestjs/common';
import { FirebaseService } from '../database/firebase.service';
import { Answer } from '../game/answer';
import { GameState } from '../game/gameState';
import { Player } from '../game/player';

export class WebsocketService {
  constructor(
    @Inject(forwardRef(() => FirebaseService))
    private readonly firebaseService: FirebaseService,
  ) {}

  listenForGameChanges(gamecode: string, callback: (snapshot: any) => void) {
    const gamesRef = this.firebaseService.getDatabase().ref('games');
    gamesRef.child(gamecode).on('value', (snapshot) => {
      callback(snapshot);
    });
  }

  async getGame(gamecode: string) {
    const gamesRef = this.firebaseService.getDatabase().ref('games');
    let game: GameState;
    await gamesRef.child(gamecode).once('value', (snapshot) => {
      const gameVal = snapshot.val();
      if (gameVal) {
        game = gameVal;
      }
    });
    return game;
  }

  async joinGame(gamecode: string, player: Player) {
    const gamesRef = this.firebaseService.getDatabase().ref('games');
    await gamesRef
      .child(gamecode)
      .child('players')
      .once('value', (snapshot) => {
        const players = snapshot.val();
        let playerNumber = 0;
        if (players) {
          Object.keys(players).forEach((playerKey) => {
            if (parseInt(playerKey) == playerNumber) {
              playerNumber += 1;
            }
          });
        }
        player.id = playerNumber;
        gamesRef
          .child(gamecode)
          .child('players')
          .child(`${playerNumber}`)
          .set(player);
      });
    return player.id;
  }

  async setPointsForPlayer(
    gamecode: string,
    playerName: string,
    points: number,
  ) {
    const gamesRef = this.firebaseService.getDatabase().ref('games');
    gamesRef
      .child(gamecode)
      .child('players')
      .once('value', (snapshot: any) => {
        const players = snapshot.val();
        players.forEach((player: any) => {
          if (player.name == playerName) {
            gamesRef
              .child(gamecode)
              .child('players')
              .child(`${player.id}`)
              .child('points')
              .set(points);
          }
        });
      });
  }

  calculatePointsForAnswer(answer: Answer, game: GameState, bonuses: string[]) {
    if (game.gameTemplate.allQuestions[game.currentQuestion] && answer) {
      if (
        answer.choosenAnswer ==
          game.gameTemplate.allQuestions[game.currentQuestion].correctAnswer &&
        game.currentQuestion == answer.questionNumber
      ) {
        const pointsForSecond = Math.round(
          1000 / game.gameTemplate.questionTime,
        );
        let pointsMultiplier = 1;
        if (bonuses) {
          bonuses.forEach((bonus: string) => {
            if (bonus == 'DoubleNext') {
              pointsMultiplier *= 2;
            }
          });
        }
        const points =
          (1000 - pointsForSecond * answer.sendingTime) * pointsMultiplier;
        return points;
      }
    }
    return 0;
  }

  async setDataInDB(
    gamecode: string,
    data: any,
    actionType: string,
    playerId: string = undefined,
  ) {
    const gamesRef = this.firebaseService.getDatabase().ref('games');
    if (actionType == 'game') {
      await gamesRef.child(gamecode).set(data);
    } else if (actionType == 'currentQuestion') {
      await gamesRef.child(gamecode).child('currentQuestion').set(data);
    } else if (actionType == 'time') {
      await gamesRef.child(gamecode).child('time').set(data);
    } else if (actionType == 'questionDone') {
      await gamesRef.child(gamecode).child('currentQuestion').set(data);
    } else if (actionType == 'points') {
      await gamesRef
        .child(gamecode)
        .child('players')
        .child(`${playerId}`)
        .child('points')
        .set(data);
    } else if (actionType == 'game') {
      await gamesRef.child(gamecode).set(data);
    } else if (actionType == 'shownComponent') {
      await gamesRef
        .child(gamecode)
        .child('players')
        .child(`${playerId}`)
        .child('shownComponent')
        .set(data);
    } else if (actionType == 'players') {
      await gamesRef.child(gamecode).child('players').set(data);
    } else if (actionType == 'gamePhase') {
      await gamesRef.child(gamecode).child('gamePhase').set(data);
    } else if (actionType == 'lastAnswer') {
      await gamesRef
        .child(gamecode)
        .child('players')
        .child(`${playerId}`)
        .child('lastAnswer')
        .set(data);
    } else if (actionType == 'gameStarted') {
      await gamesRef.child(gamecode).child('started').set(data);
    } else if (actionType == 'startingTime') {
      await gamesRef.child(gamecode).child('startingTime').set(data);
    } else if (actionType == 'winners') {
      await gamesRef.child(gamecode).child('winners').set(data);
    } else if (actionType == 'hostConnection') {
      await gamesRef.child(gamecode).child('hostConnection').set(data);
    } else if (actionType == 'hostId') {
      await gamesRef.child(gamecode).child('hostId').set(data);
    }
  }

  async fetchData(
    gamecode: string,
    data: any,
    setData: (data: any) => void,
    actionType: string,
    playerId: string,
  ) {
    const snapshot = await this.chooseTypeOnce(actionType, gamecode, playerId);
    let fetchedData = snapshot?.val();
    if (typeof data == 'number') {
      if (typeof fetchedData == 'number') {
        setData(fetchedData);
      } else {
        setData(data);
      }
    } else if (fetchedData) {
      setData(fetchedData);
    } else {
      setData(data);
    }
  }

  private async chooseTypeOnce(
    actionType: string,
    gamecode: string,
    playerId: any,
  ) {
    const gamesRef = this.firebaseService.getDatabase().ref('games');
    if (actionType == 'currentQuestion') {
      return await gamesRef
        .child(gamecode)
        .child('currentQuestion')
        .once('value');
    } else if (actionType == 'time') {
      return await gamesRef.child(gamecode).child('time').once('value');
    } else if (actionType == 'questionDone') {
      return await gamesRef
        .child(gamecode)
        .child('currentQuestion')
        .once('value');
    } else if (actionType == 'points') {
      return await gamesRef
        .child(gamecode)
        .child('players')
        .child(`${playerId}`)
        .child('points')
        .once('value');
    } else if (actionType == 'game') {
      return await gamesRef.child(gamecode).once('value');
    } else if (actionType == 'shownComponent') {
      return await gamesRef
        .child(gamecode)
        .child('players')
        .child(`${playerId}`)
        .child('shownComponent')
        .once('value');
    } else if (actionType == 'players') {
      return await gamesRef.child(gamecode).child('players').once('value');
    } else if (actionType == 'gamePhase') {
      return await gamesRef.child(gamecode).child('gamePhase').once('value');
    } else if (actionType == 'currentQuestionIndex') {
      return await gamesRef
        .child(gamecode)
        .child('currentQuestion')
        .once('value');
    } else if (actionType == 'lastAnswer') {
      return await gamesRef
        .child(gamecode)
        .child('players')
        .child(`${playerId}`)
        .child('lastAnswer')
        .once('value');
    } else if (actionType == 'startingTime') {
      return await gamesRef.child(gamecode).child('startingTime').once('value');
    } else if (actionType == 'winners') {
      return await gamesRef.child(gamecode).child('winners').once('value');
    } else if (actionType == 'hostConnection') {
      return await gamesRef.child(`${gamecode}/hostConnection`).once('value');
    } else if (actionType == 'hostShowing') {
      return await gamesRef.child(gamecode).child('hostShowing').once('value');
    } else if (actionType == 'hostId') {
      return await gamesRef.child(gamecode).child('hostId').once('value');
    }
  }

  getWinners(players: Player[]) {
    let sortedPlayers = players.sort(
      (player1, player2) => player2.points - player1.points,
    );
    const localWinners = sortedPlayers.slice(0, 3);
    return localWinners;
  }

  async useBonus(
    game: GameState,
    bonusName: string,
    playerName: string,
    enemyName: string,
  ) {
    const gamesRef = this.firebaseService.getDatabase().ref('games');
    let thisPlayer: Player;
    let enemy: Player;
    game.players.forEach((player) => {
      if (player.name == playerName) {
        thisPlayer = player;
      }
    });
    game.players.forEach((player) => {
      if (player.name == enemyName) {
        enemy = player;
      }
    });
    var playerRef = gamesRef
      .child(game.gamecode)
      .child('players')
      .child(`${thisPlayer?.id}`);
    var enemyRef: any;
    if (enemyName) {
      enemyRef = gamesRef
        .child(game.gamecode)
        .child('players')
        .child(`${enemy.id}`);
    }
    playerRef.child('points').set(thisPlayer.points - 500);
    if (bonusName == 'DoubleNext') {
      const bonuses = (
        await playerRef.child('activeBonuses').once('value')
      ).val();
      const amountOfBonuses = bonuses ? bonuses.length : 0;
      playerRef
        .child('activeBonuses')
        .child(`${amountOfBonuses}`)
        .set('DoubleNext');
    } else if (bonusName == 'EraseEnemyPoints') {
      enemyRef.child('points').set(enemy.points - 700);
    }
  }

  getPlayer(game: GameState, playerName: string) {
    let player: Player = undefined;
    game.players.forEach((currentPlayer) => {
      if (currentPlayer.name == playerName) {
        player = currentPlayer;
      }
    });
    return player;
  }

  async countdown(time: number, game: GameState, timeType: any) {
    const gamesRef = this.firebaseService.getDatabase().ref('games');
    const timerRef = gamesRef.child(game.gamecode).child(timeType);

    await timerRef.set(time);
    return new Promise((resolve, _) => {
      const countdown = setInterval(async () => {
        time -= 1;
        await timerRef.set(time);

        if (time <= 0) {
          clearInterval(countdown);
          resolve(undefined);
        }
      }, 1000);
    });
  }

  async countdownGameTime(game: GameState) {
    const gamesRef = this.firebaseService.getDatabase().ref('games');
    var thisGameRef = gamesRef.child(game.gamecode);
    var listener = thisGameRef.on('value', (snapshot) => {
      const gameVal = snapshot.val();
      if (gameVal) {
        game = gameVal;
      }
    });
    await this.countdown(3, game, 'startingTime');
    await this.countdown(game.gameTemplate.questionTime, game, 'time');
    game = {
      ...game,
      gamePhase: game.gamePhase + 1,
    };
    await gamesRef.child(game.gamecode).child('gamePhase').set(game.gamePhase);
    await this.countdown(game.gameTemplate.questionTime, game, 'time');
    game = {
      ...game,
      gamePhase: game.gamePhase + 1,
    };
    await gamesRef.child(game.gamecode).child('gamePhase').set(game.gamePhase);

    if (game.gamePhase == game.gameTemplate.allQuestions.length * 2 + 1) {
      game.winners = this.getWinners(game.players);
      this.setDataInDB(game.gamecode, game.winners, 'winners');
      await this.setDataInDB(game.gamecode, 'winners', 'gameStarted');
    } else {
      game = {
        ...game,
        currentQuestion: game.currentQuestion + 1,
      };
      await gamesRef
        .child(game.gamecode)
        .child('currentQuestion')
        .set(game.currentQuestion);

      thisGameRef.off('value', listener);
      this.countdownGameTime(game);
    }
  }

  async sendAnswer(gamecode: string, playerId: number, answer: Answer) {
    const gamesRef = this.firebaseService.getDatabase().ref('games');
    await gamesRef
      .child(gamecode)
      .child('players')
      .child(`${playerId}`)
      .child('answers')
      .child(`${answer.questionNumber}`)
      .set(answer);
    await gamesRef
      .child(gamecode)
      .child('players')
      .child(`${playerId}`)
      .child('activeBonuses')
      .set(null);
  }
}
