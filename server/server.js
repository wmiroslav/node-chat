
const path = require('path');
const express = require('express');   
const socketIO = require('socket.io');
const http = require('http');
const validateString = require('./utils/validation');

const app = express();
const server = http.createServer(app);

const publicPath = path.join(__dirname, '..', 'public')
app.use(express.static(publicPath));

const Users = require('./utils/users');



 
var users = new Users();
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

        socket.join(params.room);
        users.removeUser(socket.id); // remove this user if it's already in the room
        users.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit('updateUserList', users.getUserList(params.room))

        
        // send init Welcome message to current user
        socket.emit('newMessage', {
            from: 'Admin',
            text: params.name + ', welcome to ' + params.room + ' chat!'
        })
        // send to all other users that new user is in room
        socket.broadcast.to(params.room).emit('newMessage', {
            from: 'Admin',
            text: params.name + " joined to our " + params.room + " room!"
        });
        
        // any user create a message
        socket.on('createMessage', (message, callback) => {
            var user = users.getUser(socket.id);
            if(user && validateString(message.text)) {
                io.to(user.room).emit('newMessage', {
                    from: user.name,
                    text: message.text
                })
            }

            // io.to(params.room).emit('newMessage', {
            //     from: params.name,
            //     text: message.text
            // })
            callback('response from server');
        })
        


        // remove user
        // socket.on('leave', ()=>{
        //     var user = users.removeUser(socket.id);
        //     if (user) {
        //         io.to(user.room).emit('updateUserList', users.getUserList(user.room));
        //         io.to(user.room).emit('newMessage', {
        //             from: 'Admin',
        //             text: user.name + ' has left the room.'
        //         });
        //     }
        //     socket.leave(params.room);
        // })
        socket.on('disconnect', () => {
            var user = users.removeUser(socket.id);
            if (user) {
                io.to(user.room).emit('updateUserList', users.getUserList(user.room));
                io.to(user.room).emit('newMessage', {
                    from: 'Admin',
                    text: user.name + ' has left the room.'
                });
            }
        })
        
        
        callback();
    });


});







                                    

const port = process.env.PORT || 3000;
server.listen(port, ()=>{
    console.log('Listening on ' + port);
})

