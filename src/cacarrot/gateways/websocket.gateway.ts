import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, forwardRef } from '@nestjs/common';
import { FirebaseService } from '../database/firebase.service';
import { GameState } from '../game/gameState';
import { WebsocketService } from './websocket.service';

const setupGame: GameState = {
  gameTemplate: {
    id: '',
    templateName: '',
    questionTime: 5,
    allQuestions: [],
  },
  players: [],
  gamecode: '',
  started: 'waiting',
  currentQuestion: 0,
  time: 5,
  gamePhase: 1,
  startingTime: 3,
  winners: [],
  hostConnection: true,
  hostId: '',
};

@WebSocketGateway({ cors: true })
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(forwardRef(() => WebsocketService))
    private readonly websocketService: WebsocketService,
  ) {}

  private games = new Map<
    string,
    { game: GameState; gamecode: string; hostId: string }
  >();

  handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {}

  @SubscribeMessage('host')
  handleHostConnect(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    if (data.code) {
      this.games.set(data.code, {
        game: setupGame,
        gamecode: data.code,
        hostId: data.hostId,
      });
      client.data.gamecode = data.code;
      client.data.hostId = data.hostId;
      this.websocketService.listenForGameChanges(data.code, (snapshot: any) => {
        const gameVal = snapshot.val();
        if (gameVal) {
          this.games.set(data.code, gameVal);
          client.data.game = gameVal;
        }
      });
    }
  }

  @SubscribeMessage('host-reconnect')
  handleHostReconnect(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    if (data.code) {
      const gameData = this.games.get(data.code);
      gameData.hostId = data.hostId;
      gameData.gamecode = data.code;
      this.games.set(data.code, gameData);
      this.websocketService.setDataInDB(data.code, true, 'hostConnection');
    }
  }

  @SubscribeMessage('gamecode')
  handleGamecode(@ConnectedSocket() client: Socket, @MessageBody() code: any) {
    client.data.gamecode = code;
    this.websocketService.listenForGameChanges(code, (snapshot: any) => {
      const gameVal = snapshot.val();
      if (gameVal) {
        this.games.set(code, gameVal);
        client.data.game = gameVal;
      }
    });
  }

  @SubscribeMessage('player-join')
  async handlePlayerJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const gamecode = client.data.gamecode;
    if (gamecode) {
      client.data.game = await this.websocketService.getGame(gamecode);
      const playerId = await this.websocketService.joinGame(gamecode, {
        id: 0,
        name: data.playerName,
        points: 0,
        shownComponent: 'answers',
        answers: [],
      });
      client.emit(`joined/${gamecode}/${data.socketId}`, {
        game: client.data.game,
        playerId: playerId,
        playerName: data.playerName,
      });
    }
  }

  @SubscribeMessage('start-game')
  async handleStartGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const gamecode = client.data.gamecode;
    if (gamecode) {
      await this.websocketService.setDataInDB(
        gamecode,
        'started',
        'gameStarted',
      );
      this.websocketService.countdownGameTime(client.data.game);
    }
  }

  @SubscribeMessage('send-answer')
  async handleSendAnswer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const game = client.data.game;
    const gamecode = client.data.gamecode;
    if (gamecode) {
      const player = this.websocketService.getPlayer(game, data.playerName);
      let pointsForAnswer = 0;
      if (data.answer) {
        pointsForAnswer = this.websocketService.calculatePointsForAnswer(
          data.answer,
          game,
          data.bonuses,
        );
        data.answer.pointsFor = pointsForAnswer;
        await this.websocketService.sendAnswer(
          gamecode,
          player.id,
          data.answer,
        );
      }
      const prevPoints = player.points;
      const wholePoints = prevPoints + pointsForAnswer;
      this.websocketService.setPointsForPlayer(
        gamecode,
        data.playerName,
        wholePoints,
      );
    }
  }

  @SubscribeMessage('used-bonus')
  handleUsedBonus(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    if (client.data.gamecode) {
      this.websocketService.useBonus(
        client.data.game,
        data.bonusName,
        data.playerName,
        data.enemyName,
      );
    }
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    if (client.data?.hostId && client.data?.gamecode) {
      this.websocketService.setDataInDB(
        client.data.gamecode,
        false,
        'hostConnection',
      );
    }
  }
}
