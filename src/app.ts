import IOManager from './io';
import express from 'express';

// Create app
const app = express();
app.set('port', process.env.PORT || 3000);

/*
  The player that want to enter in a room
*/
app.get('/:room', (req, res) => {

  /*
    Check players in room,
    if there are more than one send error
  */
  const roomId = req.params.room;

  const roomSize = IOManager.getRoomSize(roomId);

  if (roomSize === -1) {
    return res
    .status(404)
    .json({ status: 400, error: { message: 'The game does not exist' }})
  }

  if (roomSize === 2) {
    return res
    .status(401)
    .json({ status: 401, error: { message: 'The game is full' }})
  }

  // Return the room, because can connect and will send a socket to 'joinRoom'
  return res.status(200).json({ room: req.params.room })
});

export default app;