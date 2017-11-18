const express = require('express');
const http = require('http');
const agent = require('./agent06');
const request = require('request');

const app = express();
const server = http.createServer(app);
let localPort = '';

agent.connectServer({
  serverHostName: '10.10.153.136',
  serverPort: '8000',
  accountName: '5a0fe88d66b16b14153c6f29',
  accountAccessKey: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IkFkbWluIiwicGFzc3dvcmQiOiIkMmEkMDgkMmJVSTQyVlVSbkdoVVFyLmRIT3hyLkJyWmx5LnVXOWJ3b3dyVHEuQS5aM1p6a00zNUROTksifQ.3vcSHjh_le0mVS339cIS-dmrL9ClXDadnqKzwFuwzDw',
  serverId: '5a0fe88d66b16b14153c6f2a',
  serverLocalIp: '10.10.44.24',
  serverLocalName: 'DSD06-1-10.10.44.24',
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

