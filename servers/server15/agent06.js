const morgan = require('morgan');
const json = require('morgan-json');

const format = json(':method :url :res[content-length] :status :response-time', { stringify: true });
const request = require('request');
const io = require('socket.io-client');
const WebSocket = require('ws');
// const urlExists = require('url-exists');
const url = require('url');
const constants = require('../../constants/constants');

let serverHostName; // Dia chi IP hoac host name cua server thu thap
let serverPort; // Port cua server thu thap
let accountName; // Ten tai khoan he thong
let accountAccessKey; // Access Key duoc cap cho tai khoan
let serverId; // Ma Id
let serverLocalIp; // Ip cua nguon thu thap
let serverLocalName; // Name cua nguon thu thap
const logArr = [];
const routerArr = ['/', '/list', '/add'];
const maxLength = constants.agent.maxNumberResponse; // number message
const maxTime = constants.agent.maxTimeWait; // ms
let date;
let ws1 = null;

const now = () => new Date().getTime();

exports.agent = (wss) => {
  wss.on('connection', (ws, req) => {
    ws.on('message', (data) => {
      if (ws1 && ws1.readyState === 1) {
        const msg = JSON.parse(data);
        // msg.took = now() - msg.start; // time in ms from client to server
        // ws.send('ok');
        const responseTime = now() - msg.start;
        logArr.push(getData(req, responseTime));
        if (logArr.length >= maxLength || (now() - date) >= maxTime) {
          ws1.send(JSON.stringify({
            serverName: serverLocalName,
            serverIp: serverLocalIp,
            serverId,
            logs: logArr,
          }));
          logArr.length = 0;
          date = new Date();
        }
      }
    });
  });
};

exports.agentHttp = () => morgan(format, {
  stream: {
    write: (obj) => {
      if (ws1 && ws1.readyState === 1) {
        logArr.push(JSON.parse(obj));
        if (logArr.length >= maxLength || (now() - date) >= maxTime) {
          // sendData(JSON.stringify({
          //   serverName: serverLocalName,
          //   serverIp: serverLocalIp,
          //   serverId,
          //   connection: 5,
          //   logs: logArr,
          // }), () => {
          //   logArr.length = 0;
          //   date = new Date();
          // });
          const dataSend = setMessage(1);
          sendMessage(dataSend);
          logArr.length = 0;
          date = new Date();
        }
      }
    },
  },
});

// Get info of server
exports.connectServer = (data) => {
  getInfoServer(data);
  ws1 = connectServer(serverHostName, serverPort);
};

function getInfoServer(data) {
  serverHostName = data.serverHostName;
  serverPort = data.serverPort;
  accountName = data.accountName;
  accountAccessKey = data.accountAccessKey;
  serverLocalIp = data.serverLocalIp;
  serverId = data.serverId;
  serverLocalName = data.serverLocalName;
}

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

// Get Log
function getData(req, responseTime) {
  const uri = url.parse(req.url, true).pathname;
  const statusCode = getStatusCode(routerArr, uri);
  const contentLength = (statusCode === '404') ? 0 : 10;
  return {
    serverName: serverLocalName,
    serverIp: serverLocalIp,
    path: uri,
    method: req.method,
    contentLength,
    status: statusCode,
    responseTime,
  };
}

function setMessage() {
  return {
    serverName: serverLocalName,
    serverIp: serverLocalIp,
    serverId,
    logs: logArr,
  };
}

function connectServer(host, port) {
  return new WebSocket(`ws://${host}:${port}`);
}

function sendMessage(message) {
  ws1.send(JSON.stringify(message));
}
