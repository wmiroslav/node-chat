
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
    socket.on('disconnect', () => {
        console.log('disconnect');
    })
    socket.on('custom event', (x) => {
        console.log(x);
    });
    socket.emit('newMessage', 'new message');
    // socket.emit('from parent', 'from paaarent');

    socket.on('createMessage', (message) => {
        console.log(message)
    })
});







                                    

const port = process.env.PORT || 3000;
server.listen(port, ()=>{
    console.log('Listening on ' + port);
})

