const portastic = require('portastic');

exports.getPorts = (callback) => {
  portastic.find({
    min: 3000,
    max: 4999,
  }).then((ports) => {
    callback(ports);
  });
};
