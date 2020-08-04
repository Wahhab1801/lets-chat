// const socket = io(`https://lets-chat1.herokuapp.com`); //location of where server is hosting socket app
const socket = io('http://localhost:3000');
socket.on('chat-message', data => {
    console.log(data)
});

// query DOM
const message = document.getElementById('message');
handle = document.getElementById('handle');
button = document.getElementById('submit');
output = document.getElementById('output');
typing = document.getElementById('typing');

//  send typing message
message.addEventListener('keypress', () => {
    socket.emit('userTyping', hanlde.value)
})
// Emit events


button.addEventListener('click', () => {
    socket.emit('chat', {
        message: message.value,
        handle: handle.value
    })
    document.getElementById('message').value = "";
})

// Listen to events

socket.on('chat', (data) => {
    //typing.innerHTML="";
    output.innerHTML += '<p> <strong>' + data.handle + ': </strong>' + data.message + '</p>'
})
socket.on('userTyping', (data) => {
    typing.innerHTML += '<p> <em>' + data + ' is typing... </em></p>'
})

/* video chat*/

// get the local video and display it with permission
function getLVideo(callbacks) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    var constraints = {
        audio: true,
        video: true
    }
    navigator.getUserMedia(constraints, callbacks.success, callbacks.error)
}

function recStream(stream, elemid) {
    var video = document.getElementById(elemid);
    console.log(elemid);
    console.log('receve strean');
    console.log(video)

    video.srcObject = stream;

    window.peer_stream = stream;
}

function removeStream(stream, elemid) {
    var video = document.getElementById(elemid);
    video.srcObject = null;
    window.peer_stream = stream;
}

var conn;
var peer_id;
// create a peer connection with peer obj
var peer = new Peer();

// display the peer id on the DOM
peer.on('open', function () {
    document.getElementById("displayId").innerHTML = peer.id
})

peer.on('connection', function (connection) {
    conn = connection;
    peer_id = connection.peer
    console.log("helo");
    document.getElementById('connId').value = peer_id;
    
});
peer.on('error', function (err) {
    alert("an error has happened:" + err)
    // console.log(err);
})

// to stop sharing video and audio
function stopSharingVideoAndAudio(stream) {
    stream.getTracks().forEach(track => {
        if (track.readyState === 'live') {
            track.stop();
        }
    })
}

// onclick open video button to access camera
document.getElementById('triggerBtn').addEventListener('click', function () {
    let videoDiv = document.getElementById('Upper');
    if (videoDiv.style.display === 'none') {
        stopSharingVideoAndAudio(window.localstream);
    } else {
        getLVideo({
            success: function (stream) {
                window.localstream = stream;
                recStream(stream, 'lVideo');
            },
            error: function (err) {
                alert("cannot access your camera");
                console.log(err);
            }
        })
    }
})

// onclick with the connection butt = expose ice info
document.getElementById('conn_button').addEventListener('click', function () {
    peer_id = document.getElementById("connId").value;
    if (peer_id) {
        conn = peer.connect(peer_id)
    }
    else {
        alert("enter an id");
        return false;
    }
})
// call on click (offer and answer is exchanged)
peer.on('call', function (call) {
    var acceptCall = confirm("Do you want to answer this call");

    if (acceptCall) {
        call.answer(window.localstream);

        call.on('stream', function (stream) {
            window.peer_stream = stream;
            recStream(stream, 'rVideo')
        });
        call.on('close', function () {
            alert('The call has endend')
        })
    }
    else {
        console.log("call denied")
    }
});

peer.on('disconnected', function () {
    console.log(peer.disconnected);
 //   peer.peer_stream.get
})
// ask to call
document.getElementById('call_button').addEventListener('click', function () {
    console.log("calling a peer:" + peer_id);

    var call = peer.call(peer_id, window.localstream);

    call.on('stream', function (stream) {
        window.peer_stream = stream;
        recStream(stream, 'rVideo');
    })
})
// accept the call

// display the remote video and local video on the clients.

// End video Stream
document.getElementById('end_button').addEventListener('click', function () {
    // peer.disconnect();
    peer.destroy();
    stopSharingVideoAndAudio(window.peer_stream);
    // peer.removeTrack(window.peer_stream);
    // window.peer_stream = undefined;
    //   window.localStream.end();

    // mediaStream.getVideoTracks()[0].enabled = !(mediaStream.getVideoTracks()[0].enabled);

    //  window.existingCall.close();

    // onStart();
})