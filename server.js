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
const { disconnect } = require('process');
const peerServer = ExpressPeerServer(server, {
  debug: true
});

const UniId={};
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/peerjs', peerServer);

let count=0;



app.get('/', (req, res) => {
    res.render('home');
})

app.get('/call', (req, res) => {
    res.redirect(`/${uuidv4()}`);
})

app.get('/:room', ( req, res ) => {
    res.render('room', { roomId: req.params.room ,count});
})


io.on('connection', socket => {
    socket.on('join-room', (roomId, userId, name) => {
      count++;
        console.log("join room with");
        console.log(roomId);
        console.log(userId);
        socket.join(roomId);
        console.log(count);
        socket.to(roomId).emit('user-connected',userId, name);
         
        socket.on('chat-message',(roomId, msg, name)=>{
          socket.to(roomId).emit('msg-recieved', msg, name );
        })
          socket.on('disconnect', () => {
            count--;
            socket.to(roomId).emit('user-disconnected', userId)
          })
        
    })
})


server.listen(port);