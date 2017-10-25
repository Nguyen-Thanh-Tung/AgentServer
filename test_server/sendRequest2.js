const Promise = require('bluebird');
const WebSocket = require('ws');
const async = require('async');

const nbr = 10;

const now = () => new Date().getTime();

function Client(id) {
  this.ws = null;
  this.start = () => {
    const that = this;
    this.ws = new WebSocket(`ws://localhost:${id}`);
    // this.ws = new WebSocket('ws://localhost:8080')
    this.ws.on('open', () => {
      console.log(`client connected ${id}`);
      that.send();
      that.ws.on('message', (data) => {
        const msg = JSON.parse(data);
        if (msg.start) {
          msg.roudntrip = now() - msg.start; // roundtrip time in ms
          data = JSON.stringify(msg);
        }
        console.log('received from server: ', data);
        setTimeout(() => {
          that.send();
        }, 1);
      });
    });
  };
  this.send = () => {
    const data = {
      // move: {
      //   x: Math.random(),
      //   y: Math.random(),
      // },
      start: now(),
    };
    this.ws.send(JSON.stringify(data));
  };
}

const ids = [];

for (let i = 3000; i <= 3500; i += 1) {
  if (i !== 3306) {
    ids.push(i);
  }
}
// const ids = ['3000', '3001', '3002', '3003'];

// Promise.map(ids, (id) => {
//   const c = new Client(id);
//   c.start();
//   return Promise.resolve();
// }).then(() => {
//   console.log('all up');
// });

const tung = ids.map((id) => {
  return new Client(id).start();
});

async.parallel(tung, (err, result) => {
  if (err) {
    console.log(err.message);
  } else {
    // console.log(new Date() - date);
  }
});