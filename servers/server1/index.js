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
  accountName: '5a11414a382bf46c870350c7',
  accountAccessKey: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IkFkbWluIiwicGFzc3dvcmQiOiIkMmEkMDgkcjVhT1JuZkM1RmdvTmppQUhEeFl0LklmdGxPbk1TLjhLdGpVRWJyMXhmR0xHcmtvWm9sUlMifQ.Mi2_CEIlAHbKhZMrlT8BqpldOPpfnSd9jUpJRLXXr60',
  serverId: '5a11414a382bf46c870350c8',
  serverLocalIp: '192.168.1.39',
  serverLocalName: 'DSD06-1-192.168.1.39',
});

const WebSocket = require('ws');
console.log('Test')
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

