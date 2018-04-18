var socket = io();
socket.on('connect', () => {
    var params = getQueryObject();
    socket.emit('join', params, function(err) {
        if (err) {
            alert(err);
            window.location.href = "/";
            return;
        }
    });
})


socket.on('newMessage', (message) => {
    var li = $('<li></li>');
    li.text(message.from + ": " + message.text);
    $('#messages').append(li);
})

socket.on('updateUserList', (users) => {
    console.log(users);
    $('#online').empty();
    for(var i = 0, len = users.length; i < len; i++) {
        var li = $('<li></li>');
        li.text(users[i]);
        $('#online').append(li);
    }
})


// parse a string to convert query string to object
function getQueryObject() {
    var queryString = location.search.replace(/\?/g, ''); // remove ?
    queryString = queryString.replace(/\+/g, ' '); //remove +
    var queryArray = queryString.split('&');
    var paramsObj = {};
    queryArray.forEach(param => {
        var params = param.split('=');
        paramsObj[params[0]] = params[1];
    })
    return paramsObj;
}


$(document).ready(function(){
    var message = $('#message'); 
    $('#form').on('submit', function(e) {
        e.preventDefault();
        var value = message.val().trim();
        if (value) {
            socket.emit('createMessage', {
                // from: "User",
                text: value  
            }, function(response) {
                message.val("");
            })
        }
    })
});





