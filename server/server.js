
const path = require('path');
const express = require('express');   
const socketIO = require('socket.io');
const http = require('http');
const validateString = require('./utils/validation');

const app = express();
const server = http.createServer(app);

const publicPath = path.join(__dirname, '..', 'public')
app.use(express.static(publicPath));




 

var io = socketIO(server);
io.on('connection', (socket) => {
    console.log('new user connected');

    // join to the room
    socket.on('join', (params, callback) => {
        if(!params) {
            callback('Name and room are required');
            return;
        }
        if(!validateString(params.name) || !validateString(params.room)) {
            callback('Name and room are required');
            return;
        }

        socket.join(params.room); //socket.leave(params.room)
        // io.emit -> io.to(params.room).emit(...)
        // socket.broadcast.emit -> socket.broadcast.to(params.room).emit(...)
        // socket.emit -> specificno za jednog usera, pa nema tu sta "to()"
        
        // send init message to current user
        socket.emit('newMessage', {
            from: 'Admin',
            text: params.name + ', welcome to ' + params.room + ' chat!'
        })
        // send to all other users
        socket.broadcast.to(params.room).emit('newMessage', {
            from: 'Admin',
            text: params.name + " joined to our " + params.room + " room!"
        });
        

        socket.on('createMessage', (message, callback) => {
            console.log('createMessage', message);
            io.to(params.room).emit('newMessage', {
                from: params.name,
                text: message.text
            })
            callback('response from server');
        })
        
        socket.on('leave', ()=>{
            socket.leave(params.room);
        })
        
        
        
        callback();
    });


});







                                    

const port = process.env.PORT || 3000;
server.listen(port, ()=>{
    console.log('Listening on ' + port);
})

