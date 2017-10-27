const mongoose = require('mongoose');
const Server = require('../model/Server');
const constants = require('../constants/constants');
const fs = require('fs');
const path = require('path');
const replace = require('replace');

const { numberServer, error, databaseUrl } = constants;

function connectDatabase() {
  mongoose.connect(databaseUrl, {
    useMongoClient: true,
  });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, error.connectDB));
}

connectDatabase();
const promise = Server.find({}).exec();
let idArray = [];
const thePath = './servers/';
// let count = 0;

promise.then((servers) => {
  idArray = servers.map(server => server.id);
  //
  // fs.writeFile('./test_server/idArray.txt', '');
  // for (let i = 0; i < idArray.length; i += 1) {
  //   fs.appendFileSync('./test_server/idArray.txt', `${idArray[i]}\n`);
  // }
  // // console.log(idArray);

  // const lineReader = require('readline').createInterface({
  //   input: fs.createReadStream('./test_server/idArray.txt'),
  // });

  for (let i = 0; i < numberServer; i += 1) {
    // lineReader.on('line', (line) => {
    //   count += 1;
    //   const idServer = line.toString();
    const idServer = idArray[i];
    // const file = path.join(thePath, `server${parseInt(count, 10)}`);
    const file = path.join(thePath, `server${parseInt((i + 1), 10)}`);

    replace({
      regex: "serverId: '',",
      replacement: `serverId: '${idServer}',`,
      paths: [file],
      recursive: true,
      silent: true,
    });

    if (i === idArray.length - 1) {
    // if (count === numberServer) {
      console.log('done');
      mongoose.connection.close();
    }
    // });
  }
});
