const socket = io('/');
const videoGrid = document.getElementById('video-grid');

var myname = document.createElement('div');
myname.innerHTML=person;

// const title=[];

// console.log(videoGrid)
var myvideo = document.createElement('video');

// if(count==0)
// {
//    var MeetTilte= prompt("Give meeting a tilte","End game");
//    mytitle=document.createElement('h2');
//    mytitle.innerHTML=MeetTilte
//    title= document.getElementById('MeetTitle');
//   title.append(mytitle);
// }


// myvideo.muted = true
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
    audio: true
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
   
    socket.on('user-disconnected', (userId) => {
        console.log("disconnecting");
        if (peers[userId]) peers[userId].close()
    })
})




const connectToNewUser = (userId, stream) => {
    console.log("new user");
    console.log(userId);
    const call = peer.call(userId, stream);
    console.log(call)
    const video = document.createElement('video');
    call.on('stream', userVideoStream => { 
        addVideoStream(video, userVideoStream);
    })

    call.on('close', () => {
        video.remove()
        // count--;
      })
    
      peers[userId] = call
}

function addVideoStream(video, stream) {
    // console.log('haha');
    video.srcObject = stream;
    // window.stream = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(myname);
    myname.append(video);
}

function leave()
{
    window.location.href='/home';
}

function mute()
{
    console.log(myVideoStream);
    const enable =myVideoStream.getAudioTracks()[0].enabled;
  if (enable) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

function setMuteButton()
{
    const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.mutebutton').innerHTML = html;
}

function setUnmuteButton()
{
    const html = `
    <i class="fas fa-microphone-slash"></i>
    <span>Mute</span>
  `
  document.querySelector('.mutebutton').innerHTML = html;
}

function PausePlayvideo()
{
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      stopVideo()
    } else {
      setPlayVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

function playVideo()
{
    const html = `
    <i class="fa fa-video-camera"></i>
    <span>Video</span>
  `
  document.querySelector('.videobutton').innerHTML = html;
}

function stopVideo()
{
    const html = `
    <i class="fas fa-video-camera-slash"></i>
    <span>Video</span>
  `
  document.querySelector('.videobutton').innerHTML = html;
}