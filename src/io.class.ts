import { IGame } from './interfaces/game.interface';
import { Game, Player } from './game';
import games from './in-memory-game';

class IO {
  public io;

  public init(io: any) {
    if (this.io) {
      throw(new Error('IOManager is already initialized'));
    }

    this.io = io;

    this.io.on('connection', socket => {
      socket.emit('connected');
      socket.on('play', (options, callback) => {
        // TODO type everything
        // TODO This is the in memory game, we should use redis instead
        games[options.roomId] = {};

        // TODO Status defined as const | the callback actions can be functions with a good name that returns this object and splitted in another file
        callback({ status: 'GAME_CREATED', roomId: options.roomId, socketId: socket.id })
      });

      socket.on('joinRoom', (roomId, callback) => {
        if (games[roomId]) {
          const roomSize = this.getRoomSize(roomId);

          if (roomSize > 1) {
            callback({ status: 'ERROR', message: 'FULL_GAME' });

            return;
          }

          if (roomSize === -1) {
            // Create entirely the game
            games[roomId] = new Game({
              id: roomId,
              player: new Player({ id: socket.id })
            });

            // Join the room
            socket.join(roomId);

            // Notify waiting for opponent
            callback({ status: 'OK', message: 'WAITING_OPPONENT_IN_ROOM'});

            return;
          }

          if (roomSize === 1) {
            // Add player
            games[roomId].addPlayer(new Player({ id: socket.id }));

            // Restore choices
            games[roomId].restorePlayersChoice();

            // Join room
            socket.join(roomId);

            // Communicate socket the game start
            this.io.to(roomId).emit('startGame')
          }

          return;
        }

        callback({ status: 'ERROR', message: 'UNEXISTING_GAME'});
      });

      socket.on('choice', (options, callback) => {
        const game: IGame = games[options.roomId];

        game.findPlayer(options.socketId).setChoice(options.choice);

        if (game.allPlayersMadeChoice()) {
          // Game finish
          this.io.to(options.roomId).emit('finishGame', { winner: game.determineWinner() });

          // Clean memory
          return;
        }

        callback({ status: 'OK', message: 'WAITING_OPPONENTS_CHOICE' });
      });

      socket.on('disconnect', () => {
        Object.keys(games).forEach((roomId) => {
          games[roomId].removePlayer(socket.id);
          this.io.to(roomId).emit('resetGame');
        });
      });
    });
  }

  public getRoomSize(roomId: string): number {
    return this.io.sockets.adapter.rooms.get(roomId)?.size || -1;
  }

  /**
   *   TODO setTimeout to check every 5 minutes if the games[roomId] is inside the getRooms Set
   *   forEach room, if the room is not in the games[roomId] --> delete games[roomId]
   */
  private _cleanGames(): void {
    // console.log('Cleaning games...');
  }
};

const IOManager = new IO();

export default IOManager;