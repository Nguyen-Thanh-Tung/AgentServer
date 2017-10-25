const WebSocket = require('ws');

const wss = new WebSocket.Server({
  port: 8080,
});

const now = () => new Date().getTime();

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    const msg = JSON.parse(data);
    msg.took = now() - msg.start; // time in ms from client to server
    ws.send(JSON.stringify(msg));
  });
});
