
const path = require('path');
const express = require('express');   
const socketIO = require('socket.io');
const http = require('http');


const app = express();
const server = http.createServer(app);

const publicPath = path.join(__dirname, '..', 'public')
app.use(express.static(publicPath));




 

var io = socketIO(server);
io.on('connection', (socket) => {
    console.log('new user connected');

    // socket.emit('welcome', "Welcome to the chat");
    
    // socket.broadcast.emit('newUser', "New user is logged in");

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);
        io.emit('newMessage', {
            from: message.from,
            text: message.text
        })
        callback('response from server');
    })
});







                                    

const port = process.env.PORT || 3000;
server.listen(port, ()=>{
    console.log('Listening on ' + port);
})

