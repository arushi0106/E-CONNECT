const express = require('express');
const app = express();
const server = require('http').Server(app);
const { v4: uuidv4 } = require('uuid');
const port = process.env.PORT || 3000;
const io = require("socket.io")(server, {
    cors: {
      origin: '*'
    }
  });
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});


app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/peerjs', peerServer);

// server.listen(port,async ()=> {
//   console.log(`running port ${port}`)
// });

app.get('/home', (req, res) => {
    res.render('home1');
})

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);
})

app.get('/:room', ( req, res ) => {
    res.render('room1', { roomId: req.params.room });
})


io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        console.log("join room with");
        console.log(roomId);
        console.log(userId);
        socket.join(roomId);
        socket.to(roomId).emit('user-connected',userId);
        
    })
})


server.listen(port);