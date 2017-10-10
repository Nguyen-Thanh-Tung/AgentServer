const express = require('express');
const agent = require('agent06');
const request = require('request');

const app = express();

// const cluster = require('cluster');
// const numCPUs = require('os').cpus().length;

// if (cluster.isMaster) {
//   console.log(`Master ${process.pid} is running`);
//
//   // Fork workers.
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }
//
//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`);
//   });
// } else {
//   console.log(`Worker ${process.pid} started`);
// }


agent.connectServer({
  serverHostName: '127.0.0.1',
  serverPort: '8000',
  accountName: 'thanhtungtvg95',
  accountAccessKey: '123456',
  serverId: '59d9dc91d92b87391d251450',
});
app.use(agent.agent());

exports.startServer = (port) => {
  app.listen(port, () => {
    console.log(`listen in port ${port}`);
  });
  app.get('/', (req, res) => {
    res.send(`Test${port}`);
  });
};

