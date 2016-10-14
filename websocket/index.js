const app = require('express')();
const http = require('http').Server(app);
const fs = require('fs');
const io = require('socket.io')(http);

let pollingQueue = [];

http.listen(3000);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg, fn){
    console.log('message: ' + msg);
    //console.log(io.sockets);
    //console.log(io.sockets.connected[msg]);

    //socket.broadcast.emit('broadcastMessage', msg);
    
    //io.sockets.connected[msg].emit('serverMsg', msg);
    
    if (msg == 'flushQueue') {
    	while(pollingQueue.length) {
    		let item = pollingQueue.pop();
    		item.res.send('Response ' + new Date());
    	}
    }
    
    fn('done');
  });

  socket
  	.on('query', (msg, fn) => {
  		if(msg === 'all-sockets') {
  			fn(Object.keys(io.sockets.adapter.sids));
  		}
  	});
});

app.get('/polling', function(req, res) {
  pollingQueue.push({req, res});
});