const morgan = require('morgan');
const json = require('morgan-json');

const format = json(':method :url :res[content-length] :status :response-time', { stringify: true });
const request = require('request');
const io = require('socket.io-client');
const WebSocket = require('ws');
// const urlExists = require('url-exists');
const url = require('url');

let serverHostName; // Dia chi IP hoac host name cua server thu thap
let serverPort; // Port cua server thu thap
let accountName; // Ten tai khoan he thong
let accountAccessKey; // Access Key duoc cap cho tai khoan
let serverId; // Ma Id cua nguon thu thap
const logArr = [];
const routerArr = ['/'];
const maxLength = 15; // number message
const maxTime = 500; // ms
let date;

const now = () => new Date().getTime();

exports.agent = (wss) => {
  const ws1 = new WebSocket(`ws://${serverHostName}:${serverPort}`);
  wss.on('connection', (ws, req) => {
    ws.on('message', (data) => {
      const msg = JSON.parse(data);
      // msg.took = now() - msg.start; // time in ms from client to server
      // ws.send(JSON.stringify(msg));
      const responseTime = Math.round((now() - msg.start) / 1000);
      logArr.push(getData(req, responseTime));
      if (logArr.length >= maxLength || (now() - date) >= maxTime) {
        const dataSend = {
          server_id: serverId,
          connection: wss.clients.size,
          logs: logArr,
        };
        ws1.send(JSON.stringify(dataSend));
        logArr.length = 0;
        date = new Date();
      }
    });
  });
};

exports.agentHttp = () => morgan(format, {
  stream: {
    write: (obj) => {
      logArr.push(JSON.parse(obj));
      if (logArr.length >= maxLength || (now() - date) >= maxTime) {
        sendData(JSON.stringify({
          server_id: serverId,
          connection: 5,
          logs: logArr,
        }), () => {
          logArr.length = 0;
          date = new Date();
        });
      }
    },
  },
});

exports.connectServer = (data) => {
  serverHostName = data.serverHostName;
  serverPort = data.serverPort;
  accountName = data.accountName;
  accountAccessKey = data.accountAccessKey;
  serverId = data.serverId;
};

function getStatusCode(routerArray, path) {
  // urlExists(`http://${req.headers.host}/tung`,(err, exists) => {
  //   if (!exists) {
  //     statusCode = '404';
  //   }
  // });
  if (routerArray.indexOf(path) !== -1) {
    return '200';
  } 
  return '404';
}

function sendData(data, callback) {
  const urlServer = `http://${serverHostName}:${serverPort}/reports/add-report`;
  const options = {
    url: urlServer,
    form: { data },
  };
  request.post(options, (error, response, body) => {});
  callback();
}

function getData(req, responseTime) {
  const uri = url.parse(req.url, true).pathname;
  const statusCode = getStatusCode(routerArr, uri);
  const contentLength = (statusCode === '404') ? 0 : 10;
  return {
    url: uri,
    method: req.method,
    res: contentLength,
    status: getStatusCode(routerArr, uri),
    'response-time': responseTime,
  };
}
