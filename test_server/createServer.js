const fs = require('fs');
const path = require('path');
const ncp = require('ncp').ncp;

ncp.limit = 0;
const constant = require('../constants/constants');
const helper = require('../helpers/helpers');

const thePath = './servers/';
const folder = 'server';
const numberServer = constant.numberServer;

helper.getPorts((ports) => {
  create(ports);
});


let create = (ports) => {
  // fs.appendFileSync('./test_server/testRequestForAll.sh', `\n${constant.commandTest}${parseInt(ports[0], 10)}&`);
  fs.writeFile('./test_server/listServer.txt', '');
  fs.appendFileSync('./test_server/listServer.txt', `${constant.nameServer}${parseInt(ports[0], 10)}`);

  for (let i = 0; i < numberServer - 1; i += 1) {
    const newFolder = `server${parseInt(i + 2, 10)}`;
    ncp(path.join(thePath, `${folder}1`), path.join(thePath, newFolder), (err) => {
      if (err) {
        return console.error(err);
      }
      // fs.appendFileSync('./test_server/testRequestForAll.sh', `\n${constant.commandTest}${parseInt(ports[i + 1], 10)}&`);
      fs.appendFileSync('./test_server/listServer.txt', `\n${constant.nameServer}${parseInt(ports[i + 1], 10)}`);
    });
  }
};
