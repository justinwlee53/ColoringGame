const log = function(text){
  const parent = document.getElementById('events');
  var child = document.createElement('li');
  child.innerHTML = text;
  parent.appendChild(child);
}

const onChatSubmitted = (sock) => (e) => {//when something is submitted in the chat box
  e.preventDefault();

  const inputBox = document.getElementById('chat');
  text = inputBox.value;
  inputBox.value = '';

  console.log("message sent client side: " + text);
  sock.emit('message',text);//send the server the text under 'message'
}

const getBoard = (canvas, numCells = 20) => {
  const ctx = canvas.getContext('2d');//gets context for the context, 2d scene

  const fillRect = (x,y,color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x,y, 20, 20);
  }

  const cellSize = Math.floor(canvas.width/numCells);

  const drawGrid = () => {
    ctx.beginPath();
    for (var i = 0; i <= canvas.width; i = i + cellSize){
      ctx.moveTo(i,0);
      ctx.lineTo(i,canvas.height);
      ctx.moveTo(0,i);
      ctx.lineTo(canvas.width,i);
      ctx.stroke();
    }
  };

  const clear = () => {
    ctx.clearRect(0,0, canvas.width, canvas.height)
  };

  const reset = () => {
    clear();
    drawGrid();
  }

  return {fillRect, reset};
}

const getClickCoordinates = (element, event) => {
  const {top, left} = element.getBoundingClientRect();
  const {clientX, clientY} = event;

  return {
    x: (clientX - left) - (clientX - left)%20,
    y: (clientY - top) - (clientY - top)%20
  };
}

const canvas = document.querySelector('canvas');
const {fillRect, reset} = getBoard(canvas);
reset();

const onClick = (e) => {
  const {x,y} = getClickCoordinates(canvas, e);
  sock.emit('click',{x,y});
};

const sock = io();
sock.on('message',(text) => {
  log(text);
  console.log("logged: " + text);//for some reason it logs it but refreshes instantly
});//on receiving a an emit with keyword 'message', log the text
//on is an event listener, waiting for an emit with the first parameter 'message'
document.getElementById('chat-form').addEventListener('submit',onChatSubmitted(sock));


sock.on('click',({x,y, color}) => {
  fillRect(x,y,color);
  console.log("Filled in at " + x + "," + y);
})

canvas.addEventListener('click',onClick);
