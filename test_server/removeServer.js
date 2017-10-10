const fs = require('fs');
const path = require('path');
const constant = require('../constants/constants');

const numberServer = constant.numberServer;
const thePath = './servers/';
const folder = 'server';
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
for (let i = 2; i <= numberServer; i += 1) {
  rmdir(path.join(thePath, folder + i));
}
fs.writeFile('./test_server/testRequestForAll.sh', `#!/bin/bash\n ${constant.commandTest}3000&`);
