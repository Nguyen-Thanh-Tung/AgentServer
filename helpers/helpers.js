const portastic = require('portastic');
const mongoose = require('mongoose');
const constants = require('../constants/constants');
const bcrypt = require('bcrypt-nodejs');
const os = require('os');
const jwt = require('jwt-simple');

const {
  databaseUrl, error, secretJWTKey, ipServer,
} = constants;

exports.getPorts = (callback) => {
  portastic.find({
    min: 3000,
    max: 4999,
  }).then((ports) => {
    callback(ports);
  });
};

exports.connectDatabase = () => {
  const databaseUrlNetwork = databaseUrl.toString().replace('localhost', ipServer);
  mongoose.connect(databaseUrlNetwork, {
    useMongoClient: true,
  });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, error.connectDB));
};

exports.closeConnectDB = () => {
  mongoose.connection.close();
};

exports.generateHashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

exports.getIp = () => {
  const ifaces = os.networkInterfaces();
  let ip = null;

  Object.keys(ifaces).forEach((ifname) => {
    let alias = 0;

    ifaces[ifname].forEach((iface) => {
      if (iface.family !== 'IPv4' || iface.internal !== false) {
        return;
      }

      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        ip = iface.address;
      } else {
        // this interface has only one ipv4 adress
        ip = iface.address;
      }
      alias += 1;
    });
  });
  return ip;
};

exports.encodeToken = payload => jwt.encode(payload, secretJWTKey);

