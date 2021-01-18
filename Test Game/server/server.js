const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const randomColor = require('randomcolor');

const app = express();

app.use(express.static(`${__dirname}/../client`)); //serving static files from the client folder

const server = http.createServer(app);//parameter is an event listener, what will the server do if there is a new event
const io = socketio(server); //wraps around the server, filter outs requests that relate to realtime communication, and the other ones will get passed to the createServer

io.on('connection', (sock) => {//when there is a new connection
  const color = randomColor();
  sock.emit("message","yay a new connection");//sends the message to the one client who logs on
  //emit: You emit from one side, and the other listens through a .on('keyword', function)

  sock.on('message', (text) => {
    io.emit('message',text);
    console.log("message received server side:" + text);
  });//sends the received message to all logged on users

  sock.on('click', ({x,y}) => {
    io.emit('click',({x,y, color}));
  })

})



server.on('error', (err) => {
  console.error(err); //if there is an error print the error message
})

server.listen(8080, () => { //uhhhh idk what 8080 is but this listens for when the server starts and the function is what it does
  console.log('server is ready');
})
