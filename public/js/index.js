var socket = io();
socket.on('connect', () => {
})


socket.on('newMessage', (message) => {
    console.log('newMessage', message);
    var li = $('<li></li>');
    li.text(message.from + ": " + message.text);
    $('#messages').append(li);
})



$(document).ready(function(){
    var message = $('#message');
    $('#form').on('submit', function(e) {
        e.preventDefault();
        var value = message.val().trim();
        if (value) {
            socket.emit('createMessage', {
                from: "User",
                text: value.trim()
            }, function(response) {
                message.val("");
            })
        }
    })
});





