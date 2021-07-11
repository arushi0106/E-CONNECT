const socket = io('/');
const videoGrid = document.getElementById('video-grid');

// creating video element for user
var myvideo = document.createElement('video');


myvideo.muted = true;
console.log(myvideo);

// Creating a new peer object

const peer = new Peer(undefined, {
  path: '/peerjs',
  
  host: 'quiet-cliffs-61940.herokuapp.com',
  port: '443',
  // secure: true
});

const peers = {};

let myVideoStream
let myname;

// A new peer connection opens here and id is given to user
peer.on('open', id => {
  console.log(id);
  myname = prompt("Please enter your name", "Tony Stark");
  socket.emit('join-room', ROOM_ID, id, myname);
})

// Here we are getting video stream of the user and ansewring the call from other users
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myvideo, stream)
  peer.on('call', (call) => {
    console.log("hello");
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      console.log("hello");
      addVideoStream(video, userVideoStream)
    })
  })


// this function runs when a new user has joined
socket.on('user-connected', (userId, username) => {
  connectToNewUser(userId, stream, username);
})

socket.on('user-disconnected', (userId) => {
  console.log("disconnecting");
  if (peers[userId]) peers[userId].close()
});
});


// here we are connecting to the new user who has joined 
const connectToNewUser = (userId, mystream, username) => {
  console.log("new user");
  console.log(username);
  console.log(userId);
  // calling the new user who has joined and sending our own stream to him in mystream
  const call = peer.call(userId, mystream);
  // console.log(call)
  // creating video element for new user stream
  const video = document.createElement('video');
  // answering call of newuser and adding his stream to our stream
  call.on('stream', (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  })

// when call disconnect removing video
call.on('close', () => {
  video.remove()
})

peers[userId] = call
}

// adding video streams to our videoGrid
function addVideoStream(video, stream) {
 
  video.srcObject = stream;
  
  video.addEventListener('loadedmetadata', () => {
    video.play();
  })
  videoGrid.append(video);
  
}

// when a user leaves the meeting redirecting him to home page
function leave() {
  window.location.href = '/home';
}

// for mute/unmute mic
function mute() {
  // console.log(myVideoStream);
  const enable = myVideoStream.getAudioTracks()[0].enabled;
  if (enable) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

// setting button icon to mute
function setMuteButton() {
  const html = `
    <i class="fas fa-microphone"></i>
    
  `
  document.querySelector('.mutebutton').innerHTML = html;
}
// setting button icon to unmute
function setUnmuteButton() {
  const html = `
    <i class="fas fa-microphone-slash"></i>
    
  `
  document.querySelector('.mutebutton').innerHTML = html;
}
// To pause and play video
function PausePlayvideo() {
  console.log('object')
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    stopVideo();
    
  } else {

    myVideoStream.getVideoTracks()[0].enabled = true;
    
    playVideo();
  }
}

// To change button icon to video on
function playVideo() {
  const html = `
    <i class="fas fa-video"></i>
  `
  document.querySelector('.videobutton').innerHTML = html;
}
// To change button icon to video off
function stopVideo() {
  const html = `
    <i class="stop fas fa-video-slash"></i>
  `
  document.querySelector('.videobutton').innerHTML = html;
}

// for sending messages
function sendMessage() {
  let msg = document.getElementById('chat_message').value;
  // checking so that user don't send an empty message
  if (msg.length < 1) {
    alert('Please enter some text')
    return
  }
  // console.log(msg);
  document.getElementById('chat_message').value = '';
  $("ul").append(`<li class="messages list-group-item active"><b>You</b><br/>${msg}</li>`);
  // sending message to everyone in room
  socket.emit('chat-message', ROOM_ID, msg, myname);
  scrollToBottom();

}

// On recieving a msg
socket.on('msg-recieved', (msg, username) => {
  console.log(msg);
  console.log(username);
  $("ul").append(`<li class="messages list-group-item"><b>${username}</b><br/>${msg}</li>`);
  scrollToBottom();

})

const scrollToBottom = () => {
  var d = $('.main__right');
  d.scrollTop(d.prop("scrollHeight"));
}

