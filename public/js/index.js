var socket = io();
socket.on('connect', () => {
    console.log('connected to server');
    socket.emit('createMessage', {
        from: "PEra",
        text: "hello man"
    });
})

socket.on('news', () => {
    console.log('NEWS')
})

socket.on('from parent', (x) => {
    console.log(x);
})

socket.on('newMessage', (message) => {
    console.log(message);
})

