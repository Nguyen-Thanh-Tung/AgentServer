const express = require('express');
const constant = require('./constants/constants.js');
const helper = require('./helpers/helpers');
const shell = require('shelljs');
const replace = require('replace');
const path = require('path');

let isOpen = false;
const file = path.join('./constants', 'constants.js');

let { numberServer } = constant;
let tempNumberServer = numberServer;
let tempIpServer = constant.ipServer;
const tempPortServer = constant.portServer;
let tempRequestPerServer = constant.sendRequest.requestPerServer;

const app = express();

app.listen(2999, (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log('Start success');
  }
});

app.get('/createServer/:number/:serverIp', (req, res) => {
  stopAllServer();
  const number = req.params.number;
  const serverIp = req.params.serverIp;
  if (number && parseInt(number, 10) > 0) {
    numberServer = number;
  }
  replace({
    regex: `numberServer: ${tempNumberServer},`,
    replacement: `numberServer: ${numberServer},`,
    paths: [file],
    recursive: true,
    silent: true,
  });
  tempNumberServer = numberServer;
  config(serverIp);
  if (shell.exec('node ./configurations/createServers').code !== 0) {
    shell.echo('Error: Cant create server');
    shell.exit(1);
    res.send(`callback(${JSON.stringify({
      status: 500,
      message: 'Cant create server',
    })})`);
  } else {
    res.send(`callback(${JSON.stringify({
      status: 200,
      message: 'Create success server',
    })})`);
  }
});

function config(host) {
  replace({
    regex: `ipServer: '${tempIpServer}',`,
    replacement: `ipServer: '${host}',`,
    paths: [file],
    recursive: true,
    silent: true,
  });
  tempIpServer = host;
}

app.get('/sendRequest', (req, res) => {
  if (!isOpen) {
    res.send(`callback(${JSON.stringify({
      status: 404,
      message: 'Not open server',
    })})`);
  } else {
    const requestPerServer = req.query.number;
    replace({
      regex: `requestPerServer: ${tempRequestPerServer},`,
      replacement: `requestPerServer: ${requestPerServer},`,
      paths: [file],
      recursive: true,
      silent: true,
    });
    replace({
      regex: `maxNumberResponse: ${tempRequestPerServer},`,
      replacement: `maxNumberResponse: ${requestPerServer},`,
      paths: [file],
      recursive: true,
      silent: true,
    });
    tempRequestPerServer = requestPerServer;

    require('./configurations/sendRequest').sendAll();
    res.send(`callback(${JSON.stringify({
      status: 200,
      message: 'Sending request to server',
    })})`);
  }
});
app.get('/stopSend', (req, res) => {
  require('./configurations/sendRequest').stopSend();
  res.send(`callback(${JSON.stringify({
    status: 200,
    message: 'Stop send request to server',
  })})`);
});
app.get('/startServer', (req, res) => {
  startAllSever();
  res.send(`callback(${JSON.stringify({
    status: 200,
    message: 'Start server success',
  })})`);
});

app.get('/closeServer', (req, res) => {
  require('./configurations/sendRequest').stopSend();
  stopAllServer();
  res.send(`callback(${JSON.stringify({
    status: 200,
    message: 'Stop server success',
  })})`);
});

function startAllSever() {
  if (!isOpen) {
    helper.getPorts((ports) => {
      for (let i = 0; i < numberServer; i += 1) {
        require(`./servers/server${i + 1}`).startServer(parseInt(ports[i], 10));
      }
    });
    isOpen = true;
  }
}

function stopAllServer() {
  if (isOpen) {
    for (let i = 0; i < tempNumberServer; i += 1) {
      require(`./servers/server${i + 1}`).stopServer();
    }
    isOpen = false;
  }
}

