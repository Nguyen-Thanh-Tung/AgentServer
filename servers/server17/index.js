const express = require('express');
const http = require('http');
const agent = require('./agent06');
const request = require('request');

const app = express();
const server = http.createServer(app);
let localPort = '';

agent.connectServer({
  serverHostName: '192.168.1.209',
  serverPort: '8000',
  accountName: '59fc99decd26ec63c86380b2',
  accountAccessKey: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IkFkbWluIiwicGFzc3dvcmQiOiIkMmEkMDgkR2tNSWN0ZmI2TnliOXZjS2tXOUc0dUtMYm5ibGxYZGYyelJqMi5lc2ExMFZhT09ydGpaQnUifQ.gEDZtH83gKXOLjeleZeeGe1SSF80IgRybhcJcbE81yQ',
  serverId: '59fc99decd26ec63c86380c3',
  serverLocalIp: '192.168.1.209',
  serverLocalName: 'DSD17',
});

const WebSocket = require('ws');

const wss = new WebSocket.Server({ server });
agent.agent(wss);
app.use(agent.agentHttp());

exports.startServer = (port) => {
  localPort = port;
  server.listen(port, () => {
    console.log(`listen in port ${port}`);
  });
  app.get('/', (req, res) => {
    res.send(`Test${port}`);
  });
};

exports.stopServer = () => {
  server.close();
  console.log(`Closed port ${localPort}`);
};

