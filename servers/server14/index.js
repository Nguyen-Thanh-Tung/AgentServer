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
  accountName: '59fdd6088147372a2ce83a80',
  accountAccessKey: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IkFkbWluIiwicGFzc3dvcmQiOiIkMmEkMDgkTFhKYUZtSTlsYXJyeUlUVnQuLy5CZWZCamFOQnFsNTZRalhNaTRyaFJtWFdPdU1Zd0RjWGkifQ.m6znX3UdFhLmLB9CzHi1rcfTf-bOv5L2glweif9B2Ng',
  serverId: '59fdd6098147372a2ce83a8e',
  serverLocalIp: '192.168.1.209',
  serverLocalName: 'DSD06-14-192.168.1.209',
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

