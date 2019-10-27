let amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    const exchange = 'direct_logs';

    const severity ="red"

    channel.assertExchange(exchange, 'direct', {
      durable: false
    });

    for (let i=1;i<30;i=i+1){
        const msg="xxxx "+i.toString()
        channel.publish(exchange, severity, Buffer.from(msg));
        console.log(" [x] Sent %s: '%s'", severity, msg);
    }  
  });

  setTimeout(function() { 
    connection.close(); 
    process.exit(0) 
  }, 500);
});