const WebSocket = require('ws');
const request = require('request');
const async = require('async');
const fs = require('fs');
const constants = require('../constants/constants');

const sendRequestArray = [];
const requestPerServer = 30;
const now = () => new Date().getTime();

const lineReader = require('readline').createInterface({
  input: fs.createReadStream('./test_server/listServer.txt'),
});

lineReader.on('line', (line) => {
  const server = line.toString();
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
    } else {
      console.log(new Date() - date);
    }
    reSend(arr);
  });
}

function sendRequestWithSocket(server, callback) {
  const wst = new WebSocket(constants.preNameServer + server);
  wst.on('open', () => {
    for (let i = 0; i < requestPerServer; i += 1) {
      // wst.send(JSON.stringify({ start: now() }));
      wst.send('');
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
