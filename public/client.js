const socket = io(`http://lets-chat1.herokuapp.com`); //location of where server is hosting socket app

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