const fs = require('fs');
const path = require('path');
const ncp = require('ncp').ncp;
const async = require('async');
const faker = require('faker');
const replace = require('replace');

const Account = require('../models/Account');
const Server = require('../models/Server');

ncp.limit = 0;
const constants = require('../constants/constants');
const helpers = require('../helpers/helpers');

const thePath = './servers/';
const folder = 'server';
const {
  error, ipServer, portServer,
} = constants;
const numberServer = constants.numberServer;
const ipLocal = helpers.getIp();
let count = 0;
let account = null;
const servers = [];

helpers.connectDatabase();

helpers.getPorts((ports) => {
  create(ports);
});

let create = (ports) => {
  removeServer(() => {
    // Add to database
    createAccount((accountData) => {
      account = accountData;
      const arrAddServer = [];

      for (let i = 0; i < numberServer; i += 1) {
        const newFolder = `server${parseInt(i + 1, 10)}`;
        ncp(path.join('./', `${folder}Template`), path.join(thePath, newFolder), (err) => {
          if (err) {
            return console.error(err);
          }
          const port = parseInt(ports[i], 10);

          arrAddServer.push(addServer.bind(null, port));
          fs.appendFileSync('./configurations/listServer.txt', `${ipLocal}:${port}\n`);

          if (arrAddServer.length === numberServer) {
            async.series(
              arrAddServer,
              (er) => {
                if (er) {
                  console.log(error.add.all);
                } else {
                  afterCreateServer();
                }
              },
            );
          }
        });
      }
    });
  });
};

function createAccount(cb) {
  const username = 'Admin';
  const password = helpers.generateHashPassword('123456');
  const accessToken = helpers.encodeToken({
    username,
    password,
  });

  Account.remove({}, (err) => {
    if (err) {
      console.log(constants.error.delete.account);
    } else {
      const accountData = {
        username,
        password,
        access_token: accessToken,
      };
      const acc = new Account(accountData);

      acc.save((er) => {
        if (err) {
          console.log(`${error.add.account} ${er.message}`);
        } else {
          cb(acc);
        }
      });
    }
  });
}

function addServer(port, cb) {
  count += 1;
  async.parallel([
    function (callback) {
      const accountId = account;
      const serverName = `DSD${count}`;
      const domain = faker.internet.domainName();
      const serverIp = ipLocal;
      const description = `Server at ${serverIp}:${port}`;
      const serverParams = [
        accountId,
        serverName,
        domain,
        serverIp,
        port,
        description,
      ];

      createServer(serverParams, callback);
    },
  ], cb);
}

function createServer(serverParams, callback) {
  const serverDetail = {
    account_id: serverParams[0],
    server_name: serverParams[1],
    domain: serverParams[2],
    server_ip: serverParams[3],
    port: serverParams[4],
    description: serverParams[5],
  };

  const server = new Server(serverDetail);
  server.save((err) => {
    if (err) {
      console.log(`${error.add.server} ${err.message}`);
    } else {
      servers.push(server);
      callback(null, 'createServer');
    }
  });
}

function removeServer(cb) {
  fs.writeFile('./configurations/listServer.txt', '');
  const rmdir = (dir) => {
    const list = fs.readdirSync(dir);
    for (let i = 0; i < list.length; i += 1) {
      const filename = path.join(dir, list[i]);
      const stat = fs.statSync(filename);

      if (filename === '.' || filename === '..') {
        //
      } else if (stat.isDirectory()) {
        rmdir(filename);
      } else {
        fs.unlinkSync(filename);
      }
    }
    fs.rmdirSync(dir);
  };

  rmdir(path.join(thePath));

  if (!fs.existsSync(thePath)) {
    fs.mkdirSync(thePath);
  }

  Server.remove({ server_ip: ipLocal }, (err) => {
    if (err) {
      console.log(constants.error.delete.account);
    } else {
      cb();
    }
  });
}

function afterCreateServer() {
  const serverArray = servers.map(server => ({
    serverId: server.id,
    serverName: server.server_name,
    serverIp: server.server_ip,
  }));

  for (let i = 0; i < numberServer; i += 1) {
    const server = serverArray[i];
    const file = path.join(thePath, `server${parseInt((i + 1), 10)}`);

    replace({
      regex: "serverHostName: '',",
      replacement: `serverHostName: '${ipServer}',`,
      paths: [file],
      recursive: true,
      silent: true,
    });

    replace({
      regex: "serverPort: '',",
      replacement: `serverPort: '${portServer}',`,
      paths: [file],
      recursive: true,
      silent: true,
    });

    replace({
      regex: "accountName: '',",
      replacement: `accountName: '${account.id}',`,
      paths: [file],
      recursive: true,
      silent: true,
    });

    replace({
      regex: "accountAccessKey: '',",
      replacement: `accountAccessKey: '${account.access_token}',`,
      paths: [file],
      recursive: true,
      silent: true,
    });

    replace({
      regex: "serverId: '',",
      replacement: `serverId: '${server.serverId}',`,
      paths: [file],
      recursive: true,
      silent: true,
    });

    replace({
      regex: "serverLocalIp: '',",
      replacement: `serverLocalIp: '${server.serverIp}',`,
      paths: [file],
      recursive: true,
      silent: true,
    });

    replace({
      regex: "serverLocalName: '',",
      replacement: `serverLocalName: '${server.serverName}',`,
      paths: [file],
      recursive: true,
      silent: true,
    });

    if (i === serverArray.length - 1) {
      console.log('Create server done');
      helpers.closeConnectDB();
    }
  }
}
