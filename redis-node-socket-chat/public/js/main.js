$(function () {
    var socket = io();
    
    $('#send-message').click(function () {
        var message = $.trim($('#message').val());
        $.ajax({
            url: '/send_message',
            type: 'POST',
            dataType: 'json',
            data: message,
            success: function (response) {
                if (response.status == 'OK') {
                    socket.emit('message', message);
                }
            }
        });
    });
    socket.on('UploadNotification', function (data) {
        var html = "<div class='msg'>" + "</div><div class='txt'>" + data + "</div>";
        $('.messages').append(html);
    });
});
