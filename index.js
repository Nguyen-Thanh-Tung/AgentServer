const constant = require('./constants/constants.js');

const numberServer = constant.numberServer;
const helper = require('./helpers/helpers');

helper.getPorts((ports) => {
  for (let i = 0; i < numberServer; i += 1) {
    require(`./AgentServer${i + 1}`).startServer(parseInt(ports[i], 10));
  }
});

