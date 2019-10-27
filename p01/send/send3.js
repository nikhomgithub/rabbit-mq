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
    //var msg = process.argv.slice(2).join(' ') || 'Hello World!';

    channel.assertExchange(exchange, 'fanout', {
      durable: false
      //ne need to keep it durable
    });
    
    for (let i=1;i<30;i=i+1){
        let msg="xxxx "+i.toString()
        channel.publish(exchange, '', Buffer.from(msg));
        
        //no need to put queue name
        
        console.log(" [x] Sent %s", msg);
    }     

});

  setTimeout(function() { 
    connection.close(); 
    process.exit(0); 
  }, 500);
});

//No queue name = not keep in queue
//msg will go to listening receiver only
//