
const socket = io('/');

const VideoGrid = document.getElementById('video-grid');
const myVideo = document.createElement ('video');
myVideo.muted = true;

var peer = new Peer(undefined,{
    path: '/peerjs',
    host:'/',
    port: '3030'
});

let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream =>{
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
    console.log(stream);
    peer.on('call', call =>{
        call.answer(stream)
        const video =document.createElement('video')
        call.on("stream", userVideoStream =>{
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', (userId) =>{
        connecToNewUser(userId, stream);
    })


    let text = $('input')
    $('html').keydown((e) =>{
        if (e.which ==13 && text.val().length !==0){
            socket.emit('message', text.val());
            text.val('')
        }
    })
    socket.on('createMessage', message =>{
        console.log("create Message", message);
        $('.messages').append(`<li class="message"><b>user</b><br/>${message}</li>`); 
    })
    

})
peer.on('open', id =>{
    socket.emit('join-room', ROOM_ID, id);
})

const connecToNewUser = (userId, stream) =>{
    const call = peer.call(userId,stream)
    const video =document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
}


const addVideoStream = (video, stream) =>{
    video.srcObject = stream;
    video.addEventListener ('loadedmetadata', () =>{
        video.play();
    })
    VideoGrid.append(video);
}
const scrollToBottom = () =>{
    let d = $('.main__chat_window');
    d.scrollToBottom(d.prop("scrollHeight"));
}

// mute our video
const muteUnmute =() =>{
   const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
   }
    else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setUnmuteButton = () =>{
    const html =`
    <i class="fa-solid fa-microphone-slash Unmute"></i>
    <span>Unmute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
}

const setMuteButton = () =>{
    const html =`
    <i class="fa-solid fa-microphone "></i>
    <span> Mute </span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
}
const playStop =() =>{
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo()
    } else{
        setStopVideo()
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}


const setStopVideo = () =>{
    const html = `
    <i class="fas fa-solid fa-video "></i>
    <span> Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML =html;
}
const setPlayVideo =() =>{
    const html=`
    <i class="fas stop fa-solid fa-video-slash stop"></i>
    <span> Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML =html;
}