var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var fs = require('fs');
var creds = '';

var redis = require('redis');
var client = '';

// Read credentials from JSON
fs.readFile('creds.json', 'utf-8', function (err, data) {
    if (err) throw err;
    creds = JSON.parse(data);
    client = redis.createClient('redis://' + creds.host + ':' + creds.port);

    // Redis Client Ready
    client.once('ready', function () {

        // Initialize Messages
        client.get('UploadNotification', function (err, reply) {
            if (reply) {
                chat_messages = reply;
            }
        });
    });
});

var port = process.env.PORT || 8080;

// Start the Server
http.listen(port, function () {
    console.log('Server Started. Listening on *:' + port);
});

// Store messages in chatroom
var chat_messages = [];

// Express Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

// Render Main HTML file
app.get('/', function (req, res) {
    res.sendFile('views/index.html', {
        root: __dirname
    });
});

// API - Send + Store Message
app.post('/send_message', function (req, res) {
    client.set('UploadNotification', JSON.stringify(req.body));
    res.send({
        'status': 'OK'
    });
});

// API - Get Messages
app.get('/get_messages', function (req, res) {
    res.send(chat_messages);
});

// Socket Connection
io.on('connection', function (socket) {
    // Fire 'UploadNotification' event for updating Message list in UI
    socket.on('message', function (data) {
        io.emit('UploadNotification', data);
    });
});
