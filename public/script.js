const socket = io('/');
const videoGrid = document.getElementById('video-grid');
console.log(videoGrid)
var myvideo = document.createElement('video');


myvideo.muted = true
// import Peer from 'peerjs';
console.log(myvideo);
const peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3000',
    // secure: true
});

const peers = {};

let myVideoStream

peer.on('open', id => {
    console.log(id);
    socket.emit('join-room', ROOM_ID, id);
})

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
}).then(stream => {
    myVideoStream = stream;
    // window.stream = stream;
    addVideoStream(myvideo, stream)

    peer.on('call', call => {
        console.log("hello");
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            console.log("hello");
          addVideoStream(video, userVideoStream)
        })
      })
    
    socket.on('user-connected', (userId) => {
        connectToNewUser(userId,stream);
    })
})




const connectToNewUser = (userId, stream) => {
    console.log("new user");
    console.log(userId);
    const call = peer.call(userId, stream);
    console.log(call)
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        console.log('call');
        addVideoStream(video, userVideoStream);
        console.log('call');
    })
}

function addVideoStream(video, stream) {
    console.log('haha');
    video.srcObject = stream;
    // window.stream = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
}