$(function () {

    // test
    var socket = io();
    var chatter_count;
    $.get('/get_chatters', function (response) {
        
        chatter_count = response.length; //update chatter count
        if (response.status == 'OK') { //username doesn't already exists
            socket.emit('update_chatter_count', {
                'action': 'increase'
            });
            $('#leave-chat').data('username', username);
            $('#send-message').data('username', username);
            $.get('/get_messages', function (response) {
                if (response.length > 0) {
                    var message_count = response.length;
                    var html = '';
                    for (var x = 0; x < message_count; x++) {
                        html += "<div class='msg'><div class='user'>" + response[x]['sender'] + "</div><div class='txt'>" + response[x]['message'] + "</div></div>";
                    }
                    $('.messages').html(html);
                }
            })
        }
    });
    
    $('#send-message').click(function () {
        var message = $.trim($('#message').val());
        $.ajax({
            url: '/send_message',
            type: 'POST',
            dataType: 'json',
            data: {
                'message': message
            },
            success: function (response) {
                if (response.status == 'OK') {
                    socket.emit('message', {
                        'message': message
                    });
                    $('#message').val('');
                }
            }
        });
    });
    socket.on('send', function (data) {
        var message = data.message;
        var html = "<div class='msg'><div class='user'>" + "</div><div class='txt'>" + message + "</div></div>";
        $('.messages').append(html);
    });
    socket.on('count_chatters', function (data) {
        if (data.action == 'increase') {
            chatter_count++;
        } else {
            chatter_count--;
        }
        $('.chat-info').text("There are currently " + chatter_count + " people in the chat room");
    });
});
