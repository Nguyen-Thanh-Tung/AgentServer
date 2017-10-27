const WebSocket = require('ws');
const request = require('request');
const async = require('async');
const fs = require('fs');
const constants = require('../constants/constants');

const sendRequestArray = [];
const requestPerServer = 30;
const now = () => new Date().getTime();
const pathArray = ['/demo', '/list', '/add', '/'];

const lineReader = require('readline').createInterface({
  input: fs.createReadStream('./test_server/listServer.txt'),
});

lineReader.on('line', (line) => {
  const random = Math.round(Math.random() * (pathArray.length - 1));
  const server = line.toString() + pathArray[random];
  sendRequestArray.push(sendRequestWithSocket.bind(null, server));

  if (sendRequestArray.length === constants.numberServer) {
    reSend(sendRequestArray);
  }
});

function reSend(arr) {
  const date = new Date();
  async.parallel(arr, (err, result) => {
    if (err) {
      console.log(err.message);
    }
    const timeSend = new Date() - date;
    console.log(timeSend);
    if (timeSend < 1000) {
      setTimeout(() => { reSend(arr); }, (1000 - timeSend));
    } else {
      reSend(arr);
    }
  });
}

function sendRequestWithSocket(server, callback) {
  const wst = new WebSocket(constants.preNameServer + server);
  wst.on('open', () => {
    for (let i = 0; i < requestPerServer; i += 1) {
      wst.send(JSON.stringify({ start: now() }));
      if (i === requestPerServer - 1) {
        callback(null, server);
      }
    }
  });
}

function sendRequestWithHttp(server, callback) {
  const url = `http://${server}`;
  const options = {
    url,
    form: {
      start: now(),
    },
  };
  for (let i = 0; i < requestPerServer; i += 1) {
    request.get(options, (error, response, body) => {});
    if (i === requestPerServer - 1) {
      callback(null, server);
    }
  }
}
