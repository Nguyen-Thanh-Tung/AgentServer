const constants = {
  numberServer: 1,
  commandTest: 'loadtest -c 1 -t 10 http://127.0.0.1:',
  preNameServer: 'ws://',
  nameServer: 'localhost:',
  ipServer: '127.0.0.1',
  portServer: '8000',
  error: {
    connectDB: 'Error when connect db',
    add: {
      account: 'Add account error',
      server: 'Add server error',
      report: 'Add report error',
      all: 'Add all error',
    },
    delete: {
      account: 'Delete account error',
      server: 'Delete server error',
      report: 'Delete report error',
      all: 'Delete all error',
    },
  },
  databaseUrl: 'mongodb://localhost/logsystem',
  secretJWTKey: 'dsd06bkhn',

  sendRequest: {
    requestPerServer: 15,
    timeOut: 500,
  },
  agent: {
    maxTimeWait: 500,
    maxNumberResponse: 30,
  },
};

module.exports = constants;
