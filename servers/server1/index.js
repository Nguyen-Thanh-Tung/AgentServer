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
  accountName: '5a0504b089c8053486bde546',
  accountAccessKey: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IkFkbWluIiwicGFzc3dvcmQiOiIkMmEkMDgkblp5NlVtRmkuekRtbnBYSHVZcmpiLklTWmFVYy9DL1pGRHFrSnEuQzI1ZWlnb1NoUlJHRXEifQ.MHWQ9_-TR-pmR9VGIOe_lQBf33y4StGJYyEDSh0NjNE',
  serverId: '5a0504b089c8053486bde547',
  serverLocalIp: '192.168.1.209',
  serverLocalName: 'DSD06-1-192.168.1.209',
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

