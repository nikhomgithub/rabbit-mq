var amqp = require('amqp');
 
let connection = amqp.createConnection({ host: 'localhost', port: 5672 });

connection.on('ready', async function () {

  connection.queue('green', {autoDelete: false, passive: true}, function (q) {
    q.bind('#');
    q.subscribe({ ack: true }, function (message) {
      console.log(message.data.toString('utf8'));
      q.shift();
    });
  });
 

});


