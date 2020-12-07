import { nanoid } from 'nanoid';
class IO {
  public io;

  public init(io: any) {
    if (this.io) {
      throw(new Error('IOManager is already initialized'));
    }

    this.io = io;

    this.io.on('connection', socket => {
      console.log('socket id: ', socket.id);
      socket.emit('connected');


      socket.on('play', () => {
        const roomId = nanoid()
        console.log('roomId: ', roomId);
        socket.join(roomId);

        console.log('Wanna play');

      });

      socket.on('joinRoom', (roomId) => {
        console.log('roomId: ', roomId);
        socket.join(roomId);

        console.log('Joined to room');

      });

      // Check if room exists and there is less than 2 people

      // If there is only 1 the player will wait

      // On second connection emit 'start game'
    });
  }

  public getRoomSize(roomId: string): number {
    return this.io.sockets.adapter.rooms.get(roomId)?.size || -1;
  }
};

const IOManager = new IO();

export default IOManager;