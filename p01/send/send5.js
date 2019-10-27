//msg send with routing key "speed.color.species"

//server we binding exchange with queue

const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var exchange = 'topic_logs';
    
    const key='small.white'
    //const key='big.white'  
    const msg ='polar' 

    channel.assertExchange(exchange, 'topic', {
      durable: false
    });

    channel.publish(exchange, key, Buffer.from(msg));
    console.log(" [x] Sent %s:'%s'", key, msg);
  });

  setTimeout(function() { 
    connection.close(); 
    process.exit(0) 
  }, 500);
});