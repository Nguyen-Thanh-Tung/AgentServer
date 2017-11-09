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
  accountName: '5a039a99df43602bc965afe7',
  accountAccessKey: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IkFkbWluIiwicGFzc3dvcmQiOiIkMmEkMDgkOGwwaFYvNFpST1VRckQwMTF6WUJXT1cwMURkZGxkVWFiZ3dHbUp4ZnBrMFhqeFRpTjBpQ0cifQ.mEhrm_DHdL3VIK55IMNBc70AG_gYRBmCrTW0lC-NAOM',
  serverId: '5a039a9adf43602bc965afe8',
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

