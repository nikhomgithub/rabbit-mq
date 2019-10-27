//Sub Pub pattern
//Exchange fanout to all
//channel.publish('logs', '', Buffer.from('Hello World!'));
//                exchange queue msg
// no need queue name

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var exchange = 'logs';

    channel.assertExchange(exchange, 'fanout', {
      durable: false
    });

    channel.assertQueue('', {
      exclusive: true
      //queue name = '' => non-durable queue 
      //system generate a auto-random name =q.queue:
    }, function(error2, q) {
      if (error2) {
        throw error2;
      }
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
      
      channel.bindQueue(q.queue, exchange, '');
      //                 q-name  exchange  binding key
      channel.consume(q.queue, function(msg) {
        if(msg.content) {
            console.log(" [x] %s", msg.content.toString());
            //channel.ack("OK")
          }
      }, {
        noAck:true
        //Ack: true 
        //no need to acknowledge
      });
    });
  });
});

// run this receive3.js on multiple terminal 
// run send3.js later 