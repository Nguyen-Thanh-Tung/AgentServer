const express = require('express');
const http = require('http');
const agent = require('./agent06');
const request = require('request');

const app = express();
const server = http.createServer(app);
let localPort = '';

agent.connectServer({
  serverHostName: '127.0.0.1',
  serverPort: '8000',
  accountName: '5a113dc57582526bbc6f01aa',
  accountAccessKey: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IkFkbWluIiwicGFzc3dvcmQiOiIkMmEkMDgkb0JZZ1lraWR4d2M4NFNtbjVacXV3dU9HVkNqLzhMQ3F2T3hoaUVnb0xEeUU3MFcvYmNBaHkifQ.PJnhMvRjFsGdzcvQNhhxG7TwhrJyV6KLyXjEvISUNYQ',
  serverId: '5a113dc57582526bbc6f01c0',
  serverLocalIp: '192.168.1.39',
  serverLocalName: 'DSD06-22-192.168.1.39',
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

